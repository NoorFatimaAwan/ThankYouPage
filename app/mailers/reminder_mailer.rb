class ReminderMailer < ApplicationMailer

  def new_reminder(user_email,order_no,user_name,thank_you_page_url,order_id,sent_at_completion)
    @order_no = order_no
    @user_name = user_name
    @thank_you_page_url = "#{thank_you_page_url.to_s}?open_with_mail"
    @sent_at_completion = sent_at_completion
    @order_id = order_id
    @unsubscribe = "https://mcacao.phaedrasolutions.com/orders/unsubscribe/#{order_id}"
    mail to: user_email, subject: "Reminder Email From Mcacao"
  end
end
