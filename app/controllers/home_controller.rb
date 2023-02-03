# frozen_string_literal: true

class HomeController < ApplicationController
  include ShopifyApp::EmbeddedApp
  include ShopifyApp::RequireKnownShop
  include ShopifyApp::ShopAccessScopesVerification

  def index
    @q = Order.ransack(params[:q])
    @orders = @q.result(distinct: true).order(created_at: :desc).paginate(page: params[:page], per_page: 20)
    @shop_origin = current_shopify_domain
    @host = params[:host]
    @shop = Shop.find_by_shopify_domain(@shop_origin)
    @script_check_box = @shop.script_check_box
    session = ShopifyAPI::Session.new(domain: @shop.shopify_domain, token: @shop.shopify_token, api_version: @shop.api_version)
      ShopifyAPI::Base.activate_session(session)
    @products = ShopifyAPI::Product.all
    @variants = @products.map(&:variants)
  end
end
