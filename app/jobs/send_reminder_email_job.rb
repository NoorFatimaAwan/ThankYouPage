class SendReminderEmailJob < ApplicationJob
  queue_as :default
  require 'uri'
  require 'net/http'
  require 'openssl'
  

  def perform(*arg)
    list = Klaviyo::Lists.add_to_list(
    'Y5VZPP',
      profiles: [
        {
          email: 'noor.fatima@phaedrasolutions.com'
        }
      ]
    )
    email = Klaviyo::EmailTemplates.send_template(
      'Y5tfPs',
      from_email: 'noor.fatima@phaedrasolutions.com',
      from_name: 'Phaedra Solutions',
      subject: 'Reminder Email',
      to: 'fnoor8004@gmail.com',
      context: {
        name: 'Noor'
      }
    )
  end
end