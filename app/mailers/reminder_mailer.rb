class ReminderMailer < ApplicationMailer

  def new_reminder
    mail to: "fnoor8004@gmail.com", subject: "Reminder Email"
  end
end
