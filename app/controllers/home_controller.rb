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
  end
end
