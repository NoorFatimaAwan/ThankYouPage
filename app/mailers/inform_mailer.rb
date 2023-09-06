class InformMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.inform_mailer.inform_client.subject
  #
  def inform_client(user_email,order)
    @message = "Your expressio order, for #{order.order_no} has finalized and the proper sizes/aspects have been verified. The images/video are ready for you to upload to your customer’s expressio box."
    # @message = "Hi, Your assets of Order no. <b>#{order.order_no}</b> with product <b>#{order.product_title}</b> and variant <b>#{order.variant_title}</b> have been successfully converted.".html_safe
    mail to: ["hello@mcacao.com","Michelle@8wavescreative.com","Joe@8wavescreative.com","noor.fatima@phaedrasolutions.com"], subject: "Information About Assets From Mcacao"
  end
end
