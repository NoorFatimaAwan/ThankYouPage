class InformMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.inform_mailer.inform_client.subject
  #
  def inform_client(user_email)
    @greeting = "Hi"
    mail to: user_email, subject: "Information About Assets From Mcacao"
  end
end
