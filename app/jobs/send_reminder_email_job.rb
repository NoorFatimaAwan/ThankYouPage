class SendReminderEmailJob < ApplicationJob
  queue_as :default
  require 'uri'
  require 'net/http'
  require 'openssl'
  

  def perform(user_email,product_image_url,order_no,user_name,thank_you_page_url,order_id)
    @order = Order.where(shop_order_id: order_id)&.last
    send_email = false
    if @order.created_at.to_date + 1.day == Date.today
      send_email = true
      @order.update(email_status: 'Delivered after 1 day')
    elsif @order.created_at.to_date + 3.days == Date.today
      send_email = true
      @order.update(email_status: 'Delivered after 3 days')
    elsif @order.created_at.to_date + 4.days == Date.today
      send_email = true
      @order.update(email_status: 'Delivered after 4 days')
    elsif @order.created_at.to_date + 7.days == Date.today
      send_email = true
      @order.update(email_status: 'Delivered after 7 days')
    elsif @order.created_at.to_date + 14.days == Date.today
      send_email = true
      @order.update(email_status: 'Delivered after 14 days')
    end
    if send_email == true
      ReminderMailer.new_reminder(user_email,product_image_url,order_no,user_name,thank_you_page_url).deliver_now
    end
  end

end