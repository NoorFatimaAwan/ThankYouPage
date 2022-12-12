class SendReminderEmailJob < ApplicationJob
  queue_as :default
  require 'uri'
  require 'net/http'
  require 'openssl'
  

  def perform(user_email,product_image_url,order_no,user_name,thank_you_page_url,order_id)
    send_email = Order.update_email_status(order_id)
    if send_email == true
      ReminderMailer.new_reminder(user_email,product_image_url,order_no,user_name,thank_you_page_url).deliver_now
    end
  end

end