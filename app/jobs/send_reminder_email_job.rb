class SendReminderEmailJob < ApplicationJob
  queue_as :default
  require 'uri'
  require 'net/http'
  require 'openssl'
  

  def perform(user_email)
    ReminderMailer.new_reminder(user_email).deliver_now
    Order.last.update(email_status: "Delivered")
  end

end