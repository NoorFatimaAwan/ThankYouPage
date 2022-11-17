Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://4b9a-110-39-190-158.ngrok.io'

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             credentials: true,
             max_age: 600
  end
end