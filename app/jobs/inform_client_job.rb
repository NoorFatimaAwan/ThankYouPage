class InformClientJob < ApplicationJob
  # queue_as :default

  def perform(user_email,order)
    # Do something later
    InformMailer.inform_client(user_email,order).deliver_now!
  end
end
