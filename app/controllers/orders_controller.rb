class OrdersController < ApplicationController
  require('zip')
  require 'streamio-ffmpeg'
  require 'mini_exiftool'
  require 'open-uri'
  skip_before_action :verify_authenticity_token

  def index
    @q = Order.ransack(params[:q])
    @orders = @q.result(distinct: true).order(created_at: :desc).paginate(page: params[:page], per_page: 20)
    @shop_domain = params[:shop_domain]
    @shop = Shop.find_by_shopify_domain(params[:shop_domain])
    if @shop.present?
      @script_check_box = @shop.script_check_box
      session = ShopifyAPI::Session.new(domain: @shop.shopify_domain, token: @shop.shopify_token, api_version: @shop.api_version)
      ShopifyAPI::Base.activate_session(session)
      @products = ShopifyAPI::Product.find(:all, params: { limit: 100 })
      @variants = @products.map(&:variants)
    end
  end

  def new
    @order = Order.new
    @shop_id = Shop.find_by(shopify_domain: params[:domain])&.id
    @product_title = params[:product_title]
    @variant_title = params[:variant_title] if params[:variant_title].present? && params[:variant_title] != "null"
    @product_image_url = params[:product_image_url]
    @existing_order = Order.where("shop_order_id =?  and product_id = ? and product_no = ? and product_title = ?",params[:order_id], params[:product_id],params[:product_no],params[:product_title])
    @first_product = params[:product_index].to_i == 1 ? false : true
    @user_email = params[:user_email].present? ? params[:user_email] : nil
    render layout: false
  end

  def create
    params[:order][:images].present? ? params[:order][:file_type] = 'image' : params[:order][:file_type] = 'video' 
    @order = Order.new(order_params)
    if params[:order][:parent_product_id].present? && params[:order][:prev_checkbox].present? &&  params[:order][:prev_checkbox] != "0"
      if params[:order][:product_no].to_i <= 0
        @parent_product = Order.where("shop_order_id = ? and product_no = ? and product_id = ?", params[:order][:shop_order_id],((params[:product_length].to_i) - 1),params[:order][:parent_product_id])
      elsif params[:order][:product_no].to_i > 0 
        @parent_product = Order.where("shop_order_id = ? and variant_title = ? and product_no = ?",params[:order][:shop_order_id], params[:order][:variant_title],((params[:order][:product_no].to_i) - 1))
      end
      @order.file_type = @parent_product&.last&.file_type
      if @parent_product.present? && @parent_product&.last&.images.attached? 
        @parent_product_files = @parent_product&.last&.images&.map(&:blob)
        @order&.images&.attach(@parent_product_files)
      elsif @parent_product.present? && @parent_product&.last&.videos.attached?
        @parent_product_files = @parent_product&.last&.videos&.map(&:blob)
        @order&.videos&.attach(@parent_product_files)
      end
    end
    total_image_size = 0 
    total_video_size = 0
    if params[:order][:images].present?
      params[:order][:images].each do |image|
        total_image_size = total_image_size + image.size
      end
    elsif params[:order][:videos].present?
      params[:order][:videos].each do |video|
        total_video_size = total_video_size + video.size
      end
    end
    if total_image_size > 4 * 1024 * 1024 || total_video_size > 4 * 1024 * 1024
      AssetUploadJob.perform_now(@order) if @order.present?
    else
      @order.save!
      if (@order&.videos.attached? && @order&.prev_checkbox == false)
        video_count = @order&.videos&.count
        Delayed::Job.enqueue ConvertPortraitToLandscapeJob.new(@order,video_count) if @order.present?
      end  
    end
    @last_order = Order.where("shop_order_id = ? and product_no = ? and product_id = ?", params[:order][:shop_order_id],params[:order][:product_no],params[:order][:product_id])
    @order_count = @last_order.count
    if @order_count > 1
      if params[:file_length].to_i == 0 && !@last_order.last.prev_checkbox
        @last_order.last.images&.attach(@last_order.first.images&.map(&:blob)) if params[:order][:file_type] == 'image'
        @last_order.last.videos&.attach(@last_order.first.videos&.map(&:blob)) if params[:order][:file_type] == 'video'
      end
      @last_order.first.destroy
    end
    if @order.save!
      @products_submitted = Order.where(shop_order_id: @order.shop_order_id).count
      if @products_submitted == params[:total_products].to_i
        @order.update(email_status: 'Completed')
      end
      if @order.email_status != 'Completed'
        job = Sidekiq::Cron::Job.new(name: 'Reminder Email',args: [params[:user_email],@order.order_no,params[:user_name],params[:thank_you_page_url],@order.shop_order_id], cron: '0 12 * * *', class: 'SendReminderEmailJob')
        job.save
      end
      render json: {status: :ok}
    end
    rescue ActiveRecord::RecordInvalid
    raise Errors::Invalid.new(@order.errors)
  end

  def should_show
    @order = Order.where(shop_order_id: params[:order_id].to_i)
    @products_submitted = @order.count
    if !params[:thank_you_page_url]&.split('?')[1]&.include?('open_with_mail') && $order_id_for_email != params[:order_id] && @products_submitted == 0
      $order_id_for_email = params[:order_id]
      ReminderMailer.new_reminder(params[:user_email], params[:order_no], params[:user_name], params[:thank_you_page_url],params[:order_id],true).deliver_now!  
    end
  end

  def show
    @order = Order.find(params[:id])
    @images = @order.images if @order.images.attached?
    @videos = @order.videos if @order.videos.attached?
    @product_title = @order.product_title
    @variant_title = @order.variant_title
    @order_no = "Order/confirmation #" + @order.order_no.to_s
    @shop = params[:shop_domain]
  end

  def preview_files
    if params[:checkbox_value] == 'true'
      assets_urls = []
      assets_blobs = []
      parent_product_no = (params[:product_no].to_i - 1)
      if params[:product_no].to_i <= 0
        @parent_product_order = Order.where("shop_order_id = ? and product_no = ? and product_id = ?", params[:order_id],((params[:product_length].to_i) - 1),params[:parent_product_id]).last
      elsif params[:product_no].to_i > 0
        @parent_product_order = Order.where("shop_order_id = ? and variant_title = ? and product_no = ?",params[:order_id], params[:variant_title],parent_product_no).last
      end
      @parent_assets = @parent_product_order&.file_type == 'image' ? @parent_product_order&.images : @parent_product_order&.videos if @parent_product_order.present?
      if @parent_assets&.attached?
        @parent_assets&.each do |asset|
          assets_urls << url_for(asset)
          assets_blobs << asset.blob
        end
      else
        error_message = 'Please upload and submit assets on box above.'
      end
    end
     render json: {assets_urls: assets_urls,assets_blobs: assets_blobs,file_type: @parent_product_order&.file_type,error_message: error_message, generic_error: @parent_product_order&.errors&.messages}
  end

  def download_assets  
    filename = 'my_assets.zip'
    temp_file = Tempfile.new(filename)
    @order = Order.find(params[:order_id])
    begin
      Zip::OutputStream.open(temp_file) { |zos| }

      Zip::File.open(temp_file.path, Zip::File::CREATE) do |zipfile|

        @order_assets = @order.videos.attached? ? @order.videos : @order.images
        if @order_assets.present?

          @order_assets.each do |asset|
            file = Tempfile.new("#{asset}")
            File.open(file.path, 'w', encoding: 'ASCII-8BIT') do |file|
              asset.download do |chunk|
                file.write(chunk)
              end
            end
      
            zipfile.add("#{asset.filename}", file.path)
          end
        end
      end

      zip_data = File.read(temp_file.path)
      send_data(zip_data, type: 'application/zip', disposition: 'attachment', filename: filename)
    ensure 
      temp_file.close
      temp_file.unlink
    end  
  end

  def unsubscribe
    @order = Order.where(shop_order_id: params[:id].to_i)&.last
    @order&.update(email_status: 'unsubscribed')
    if @order.present?
      @msg = "You've unsubscribed from our mailing list. You won't receive any more mails"
    else
      @msg = "Please upload images/videos for your chocolate box (or boxes!) before unsubscribing"
    end
  end

  def delete_assets
    @order = Order.where("shop_order_id = ? and product_no = ? and product_id = ?", params[:order_id],params[:product_no],params[:product_id])&.last
    if params[:asset_type] == "remove_all"        
      destroyed = @order&.destroy
      deleted = 'removed_all' if destroyed
    end
    file_index = 0
    asset_index = params[:index].to_i
    if @order.present?
      @order_assets = @order&.file_type == 'image' ? @order&.images : @order&.videos
      if params[:asset_type] == "uploaded_images" || params[:asset_type] == "uploaded_videos"
        @order_assets&.last(params[:asset_length].to_i).map(&:blob).each_with_index do |blob,index|
          if "#{blob.filename}" == params[:index]
            file_index = index
          end
        end
        @order_assets&.last(params[:asset_length].to_i)[file_index]&.purge
      elsif params[:asset_type] == "more_uploaded_images" || params[:asset_type] == "more_uploaded_videos"
        @order_assets&.first(params[:more_asset_length].to_i).map(&:blob).each_with_index do |blob,index|
          if "#{blob.filename}" == params[:index]
            file_index = index
          end
        end
        @order_assets&.first(params[:more_asset_length].to_i)[file_index]&.purge
      end
    end
    render json: {deleted: deleted,asset_type: params[:asset_type],file_index: file_index}
  end

  def remove_script
    shop = Shop.find_by_shopify_domain(params[:shop_domain])
    session = ShopifyAPI::Session.new(domain: shop.shopify_domain, token: shop.shopify_token, api_version: shop.api_version)
      ShopifyAPI::Base.activate_session(session)
    if params[:toggle] == "false" && ShopifyAPI::ScriptTag.last.present?
      shop.update(script_check_box: false)
      ShopifyAPI::ScriptTag.last&.destroy
    elsif params[:toggle] == "true" && ShopifyAPI::ScriptTag.last.nil?
      shop.update(script_check_box: true)
      script_tag = ShopifyAPI::ScriptTag.create(event:'onload', src:"https://mcacao.phaedrasolutions.com/returns/img_vid.js")
      script_tag.save  
    end
    render json: {script_tag_removed: ShopifyAPI::ScriptTag.all.empty?}
  end

  def products_choosen
    @shop = Shop.find_by_shopify_domain(params[:shop_domain])
    if params[:show_response] == 'true'
      @shop_enabled_app_products = @shop&.enabled_app_products
      @product_with_enabled_app = params[:products_in_order]&.all? {|x| @shop_enabled_app_products&.include?(x) }
      @enabled = @shop_enabled_app_products.empty? ? nil : @product_with_enabled_app
      render json: @enabled,:callback => params[:callback]  
    else
      product_titles = params[:product_titles].split(',')
      @shop.update(enabled_app_products: product_titles)
      redirect_to request.referer
    end
  end

  private

  def order_params
    params.fetch(:order).permit(:shop_id,:product_id,:file_type,:prev_checkbox,:parent_product_id,:product_title,:order_no,:product_no,:email_status,:variant_title,:shop_order_id, videos: [], images: [])
  end

end
