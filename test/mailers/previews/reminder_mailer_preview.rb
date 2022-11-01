# Preview all emails at http://localhost:3000/rails/mailers/reminder_mailer
class ReminderMailerPreview < ActionMailer::Preview
  def new_reminder
    ReminderMailer.new_reminder
  end
end
