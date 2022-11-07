class OrdersController < ApplicationController


  def index
    @orders = Order.all.paginate(page: params[:page], per_page: 20)
    render(json: { orders: @orders })
  end

  def new
    @order = Order.new
    @shop_id = Shop.find_by(shopify_domain: params[:domain])&.id
    @product_title = params[:product_title]
    @product_image_url = params[:product_image_url]
    @existing_order = Order.where("order_no =?  and product_id = ? and product_no = ? and product_title = ?",params[:order_no], params[:product_id],params[:product_no],params[:product_title])
  end

  def create
    params[:order][:images].present? ? params[:order][:file_type] = 'image' : params[:order][:file_type] = 'video' 
    @order = Order.new(order_params)
    if params[:order][:parent_product_id].present? && params[:order][:prev_checkbox].present? &&  params[:order][:prev_checkbox] != "0"
      @parent_product = Order.where(product_id:  params[:order][:parent_product_id]&.to_i) 
      if @parent_product.present? && @parent_product&.last&.images.attached? 
        @parent_product_files = @parent_product&.last&.images&.map(&:blob)
        @order&.images&.attach(@parent_product_files)
      elsif @parent_product.present? && @parent_product&.last&.video.attached?
        @parent_product_files = @parent_product&.last&.video&.blob
        @order&.video&.attach(@parent_product_files)
      end
    end
    @order.save!
    rescue ActiveRecord::RecordInvalid
    raise Errors::Invalid.new(@order.errors)
  end

  def should_show
    @product_required = params[:product_title].include? 'expressio'
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
      @parent_product_order =  Order.where("product_id= ? and order_no = ?",  params[:parent_product_id],params[:order_no]).last || Order.where("product_id= ? and order_no = ?",  params[:product_id],params[:order_no]).last
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



  private

  def order_params
    params.fetch(:order).permit(:shop_id,:product_id,:file_type,:prev_checkbox,:parent_product_id,:product_title,:order_no,:product_no, :video, images: [])
  end

end
