Rails.application.routes.draw do
  root :to => 'home#index'
  require 'sidekiq/web'
  mount Sidekiq::Web => '/sidekiq'
  get '/products', :to => 'products#index'
  get '/products', :to => 'products#show'
  get '/orders/products_choosen', :to => "orders#products_choosen"
  get '/orders/should_show', :to => "orders#should_show"
  get '/orders/preview_files', :to => "orders#preview_files"
  post '/orders/download_assets', :to => "orders#download_assets"
  get '/orders/unsubscribe/:id', :to => "orders#unsubscribe"
  get '/orders/delete_assets', :to => "orders#delete_assets"
  get '/orders/remove_script', :to => "orders#remove_script"
  resources 'orders', only:[:index,:new,:create,:show]
  mount ShopifyApp::Engine, at: '/'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
