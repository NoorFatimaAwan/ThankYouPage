class ReminderMailer < ApplicationMailer

  def new_reminder(user_email)
    mail to: user_email, subject: "Reminder Email"
  end
end
