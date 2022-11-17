Rails.application.routes.draw do
  root :to => 'home#index'
  require 'sidekiq/web'
  mount Sidekiq::Web => '/sidekiq'
  get '/products', :to => 'products#index'
  get '/products', :to => 'products#show'
  get '/orders/should_show', :to => "orders#should_show"
  get '/orders/preview_files', :to => "orders#preview_files"
  post '/orders/download_assets', :to => "orders#download_assets"
  resources 'orders', only:[:index,:new,:create,:show]
  mount ShopifyApp::Engine, at: '/'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
