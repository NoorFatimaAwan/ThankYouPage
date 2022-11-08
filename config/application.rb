require_relative 'boot'

require 'rails/all'
require 'dotenv'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)
Dotenv::Railtie.load
module ImageVideoApp
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.2

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins 'https://c5c4-202-166-171-14.ngrok.io'
    
        resource '*',
                 headers: :any,
                 methods: [:get, :post, :put, :patch, :delete, :options, :head],
                 credentials: true,
                 max_age: 600
      end
    end
  end
end
