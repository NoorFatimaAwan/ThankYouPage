class SendReminderEmailJob < ApplicationJob
  queue_as :default
  require 'uri'
  require 'net/http'
  require 'openssl'
  

  def perform(*arg)
    list = Klaviyo::Lists.add_to_list(
    'U6f6AQ',
      profiles: [
        {
          email: 'ambreen@phaedrasolutions.com'
        },
        {
          email: 'talha@phaedrasolutions.com'
        }
      ]
    )
    email = Klaviyo::EmailTemplates.send_template(
      'UKRy3w',
      from_email: 'talha@phaedrasolutions.com',
      from_name: 'Klaviyo',
      subject: 'Reminder Email',
      to: 'talha@phaedrasolutions.com',
      context: {
        name: 'Noor'
      }
    )
  end
end