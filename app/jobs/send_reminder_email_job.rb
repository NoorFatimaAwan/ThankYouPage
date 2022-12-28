class SendReminderEmailJob < ApplicationJob
  queue_as :default
  require 'uri'
  require 'net/http'
  require 'openssl'
  

  def perform(*args)
    user_email = args[0]
    order_no = args[1]
    user_name = args[2]
    thank_you_page_url = args[3]
    order_id = args[4]
    @order = Order.where(shop_order_id: order_id)&.last
    send_email = false
    if @order.created_at.to_date + 2.days == Date.today
      send_email = true
      @order.update(email_status: 'Delivered after 2 days')
    elsif @order.created_at.to_date + 7.days == Date.today
      send_email = true
      @order.update(email_status: 'Delivered after 7 days')
    elsif @order.created_at.to_date + 14.days == Date.today
      send_email = true
      @order.update(email_status: 'Delivered after 14 days')
    elsif @order.created_at.to_date + 21.days == Date.today
      send_email = true
      @order.update(email_status: 'Delivered after 21 days')
    elsif @order.email_status == 'unsubscribed'
      send_email = false
    end
    if send_email == true
      ReminderMailer.new_reminder(user_email,order_no,user_name,thank_you_page_url,order_id,false).deliver_now!
    end
  end

end