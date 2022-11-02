# frozen_string_literal: true
class Shop < ActiveRecord::Base
  include ShopifyApp::ShopSessionStorageWithScopes

  def connect
      ShopifyAPI::Base.clear_session
      puts "====session cleared====="
      session = ShopifyAPI::Session.new(domain: shopify_domain, token: shopify_token, api_version: api_version)
      ShopifyAPI::Base.activate_session(session)
      puts "========Shop Session Activated========"
  end

  def api_version
    ShopifyApp.configuration.api_version
  end
end
