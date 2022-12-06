class SendReminderEmailJob < ApplicationJob
  queue_as :default
  require 'uri'
  require 'net/http'
  require 'openssl'
  

  def perform(user_email,product_image_url,order_no,user_name,thank_you_page_url,order_id)
    Order.find_by(shop_order_id: order_id)&.update(email_status: "Delivered")
    ReminderMailer.new_reminder(user_email,product_image_url,order_no,user_name,thank_you_page_url).deliver_now
  end

end