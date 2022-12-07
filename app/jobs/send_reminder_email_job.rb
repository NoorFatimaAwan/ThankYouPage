class SendReminderEmailJob < ApplicationJob
  queue_as :default
  require 'uri'
  require 'net/http'
  require 'openssl'
  

  def perform(user_email,product_image_url,order_no,user_name,thank_you_page_url,order_id)
    @order = Order.find_by(shop_order_id: order_id)
    if @order.email_status == 'Pending'        
      if @order.created_at.to_date + 1.days == Date.today
        ReminderMailer.new_reminder(user_email,product_image_url,order_no,user_name,thank_you_page_url).deliver_now
      elsif @order.created_at.to_date + 3.days == Date.today
        ReminderMailer.new_reminder(user_email,product_image_url,order_no,user_name,thank_you_page_url).deliver_now
      elsif @order.created_at.to_date + 7.days == Date.today
        ReminderMailer.new_reminder(user_email,product_image_url,order_no,user_name,thank_you_page_url).deliver_now
      elsif @order.created_at.to_date + 14.days == Date.today
        ReminderMailer.new_reminder(user_email,product_image_url,order_no,user_name,thank_you_page_url).deliver_now
      end
    end
  end

end