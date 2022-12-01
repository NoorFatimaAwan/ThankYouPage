class ApplicationController < ActionController::Base

  # protect_from_forgery  except: :should_show
  after_action :allow_shopify_iframe
  # before_action :cors_set_access_control_headers
  include Rails.application.routes.url_helpers

  private
  
  def allow_shopify_iframe
    response.headers.except! "X-Frame-Options"
  end

  def cors_set_access_control_headers
    response.headers['Access-Control-Allow-Origin'] = "*"
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  end
end
