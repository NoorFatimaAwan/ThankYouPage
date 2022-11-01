class SendReminderEmailJob < ApplicationJob
  queue_as :default

  def perform(*args)
    ReminderMailer.new_reminder.deliver_later
  end
end