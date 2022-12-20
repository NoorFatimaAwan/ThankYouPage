class ReminderMailer < ApplicationMailer

  def new_reminder(user_email,order_no,user_name,thank_you_page_url,sent_at_completion)
    @order_no = order_no
    @user_name = user_name
    @sent_at_completion = sent_at_completion
    @thank_you_page_url = thank_you_page_url.to_s
    mail to: user_email, subject: "Reminder Email From Mcacao"
  end
end
