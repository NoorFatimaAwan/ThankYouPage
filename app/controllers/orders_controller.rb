class OrdersController < ApplicationController
  require('zip')
  skip_before_action :verify_authenticity_token

  def index
    @q = Order.ransack(params[:q])
    @orders = @q.result(distinct: true).order(created_at: :desc).paginate(page: params[:page], per_page: 20)
  end

  def new
    @order = Order.new
    @shop_id = Shop.find_by(shopify_domain: params[:domain])&.id
    @product_title = params[:product_title]
    @variant_title = params[:variant_title]
    @product_image_url = params[:product_image_url]
    @existing_order = Order.where("order_no =?  and product_id = ? and product_no = ? and product_title = ?",params[:order_no], params[:product_id],params[:product_no],params[:product_title])
    @first_product = params[:product_no] == "0" ? params[:product_title] == params[:first_product_title] ? false : true : true
    @user_email = params[:user_email].present? ? params[:user_email] : nil
    render layout: false
  end

  def create
    params[:order][:images].present? ? params[:order][:file_type] = 'image' : params[:order][:file_type] = 'video' 
    @order = Order.new(order_params)
    if params[:order][:parent_product_id].present? && params[:order][:prev_checkbox].present? &&  params[:order][:prev_checkbox] != "0"
      @parent_product = Order.where("product_id= ? and order_no = ?", params[:order][:parent_product_id],params[:order][:order_no]&.to_i)
      @order.file_type = @parent_product&.last&.file_type
      if @parent_product.present? && @parent_product&.last&.images.attached? 
        @parent_product_files = @parent_product&.last&.images&.map(&:blob)
        @order&.images&.attach(@parent_product_files)
      elsif @parent_product.present? && @parent_product&.last&.video.attached?
        @parent_product_files = @parent_product&.last&.video&.blob
        @order&.video&.attach(@parent_product_files)
      end
    end
    total_image_size = 0 
    if params[:order][:images].present?
      params[:order][:images].each do |image|
        total_image_size = total_image_size + image.size
      end
    elsif params[:order][:video].present?
      total_video_size = params[:order][:video].size > 4 * 1024 * 1024
    end
    if total_image_size > 4 * 1024 * 1024 || total_video_size
      AssetUploadJob.perform_now(@order)
    else
      @order.save!
    end
    rescue ActiveRecord::RecordInvalid
    raise Errors::Invalid.new(@order.errors)
  end

  def should_show    
    product_title_array = []
    (0...params[:product_amount].to_i).each do |index|
      product_title_array.push(params[:product_title]["#{index}"][:title].include? 'expressio')
    end
    @product_required = product_title_array.include?(false) ? false : true
    render json: @product_required ,:callback => params[:callback]
  end

  def show
    @order = Order.find(params[:id])
    @images = @order.images if @order.images.attached?
    @video = @order.video if @order.video.attached?
    @product_title = @order.product_title
    @order_no = "Order #" + @order.order_no.to_s
  end

  def preview_files
    if params[:checkbox_value] == 'true'
      image_urls = []
      @order = Order.last
      parent_product_no = (params[:product_no].to_i - 1)
      @parent_product_order = parent_product_no >= 0 ? Order.where("product_id= ? and order_no = ? and product_no = ?",  params[:parent_product_id],params[:order_no],parent_product_no).last : Order.where("product_id= ? and order_no = ?",  params[:parent_product_id],params[:order_no]).last
      if @parent_product_order == @order
        @order.images.each do |image|
          image_urls << url_for(image)
        end
        @video_url = url_for(@order.video) if @order.video.attached?
      else
        error_message = 'Please submit the above files before checking check box.'
      end
    end
    render json: {video_url: @video_url, image_urls: image_urls, error_message: error_message}
  end

  def download_assets  
    filename = 'my_assets.zip'
    temp_file = Tempfile.new(filename)
    @order = Order.find(params[:order_id])
    begin
      Zip::OutputStream.open(temp_file) { |zos| }
    
      Zip::File.open(temp_file.path, Zip::File::CREATE) do |zipfile|
        if @order.video.attached?
          image_file = Tempfile.new("#{@order.video}")
          File.open(image_file.path, 'w', encoding: 'ASCII-8BIT') do |file|
            @order.video.download do |chunk|
              file.write(chunk)
            end

            zipfile.add("#{@order.video.filename}", image_file.path)
          end

        elsif @order.images.attached?

          @order.images.each do |image|
            image_file = Tempfile.new("#{image}")
            
            File.open(image_file.path, 'w', encoding: 'ASCII-8BIT') do |file|
              image.download do |chunk|
                file.write(chunk)
              end
            end
      
            zipfile.add("#{image.filename}", image_file.path)
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

  def send_email
    if params[:order_no].to_i != Order.last.order_no
      SendReminderEmailJob.perform_later(params[:user_email])
    end
  end

  private

  def order_params
    params.fetch(:order).permit(:shop_id,:product_id,:file_type,:prev_checkbox,:parent_product_id,:product_title,:order_no,:product_no, :video, images: [])
  end

end
