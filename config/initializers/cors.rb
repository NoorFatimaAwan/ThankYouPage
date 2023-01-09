Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "https://9a85-110-39-190-158.ngrok.io",'*', %r{\Ahttps://[a-z0-9-]+stupefied-noyce-1a3cb4\.netlify\.app\z},
            %r{\Ahttps://[a-z0-9-]+\.assistalong\.com\z},
            /localhost:3000/,
            "https://image-video-shop.myshopify.com"

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             max_age: 600
  end
end