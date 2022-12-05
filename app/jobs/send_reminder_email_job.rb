class SendReminderEmailJob < ApplicationJob
  queue_as :default
  require 'uri'
  require 'net/http'
  require 'openssl'
  

  def perform(user_email,product_image_url,order_no,user_name,thank_you_page_url)
    ReminderMailer.new_reminder(user_email,product_image_url,order_no,user_name,thank_you_page_url).deliver_now
    Order.last.update(email_status: "Delivered")
  end

end