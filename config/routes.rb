Rails.application.routes.draw do
  devise_for :user, only: []

  devise_scope :user do
    # Sessions
    post "users/sign_in", to: "devise/sessions#create", as: :user_session
    delete "users/sign_out", to: "devise/sessions#destroy", as: :destroy_user_session

    # Registrations
    post "users", to: "devise/registrations#create", as: :user_registration
    put "users", to: "devise/registrations#update"
    delete "users", to: "devise/registrations#destroy"
  end

  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  namespace :api do
    namespace :v1 do
      resources :chats, only: %i[index show], defaults: { format: :json }
    end
  end

  # Defines the root path route ("/")
  root "home#index"

  # WebSocket endpoint for ActionCable
  mount ActionCable.server => "/cable"

  # Settings page
  get "settings", to: "settings#edit", as: :settings
  patch "settings", to: "settings#update"

  # Inertia frontend route for individual chats
  get "chat/:id", to: "home#index", as: :chat
end
