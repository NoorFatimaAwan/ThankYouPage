class ReminderMailer < ApplicationMailer

  def new_reminder(user_email,product_image_url,order_no,user_name,thank_you_page_url)
    @product_image_url = product_image_url
    @order_no = order_no
    @user_name = user_name
    @thank_you_page_url = thank_you_page_url
    mail to: user_email, subject: "Reminder Email From Mcacao"
  end
end
