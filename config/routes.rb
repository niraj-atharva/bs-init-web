# frozen_string_literal: true

class ActionDispatch::Routing::Mapper
  def draw(routes_name)
    instance_eval(File.read(Rails.root.join("config/routes/#{routes_name}.rb")))
  end
end

Rails.application.routes.draw do
  devise_for :users, controllers: {
    registrations: "users/registrations",
    sessions: "users/sessions",
    passwords: "users/passwords",
    invitations: "users/invitations",
    omniauth_callbacks: "users/omniauth_callbacks"
  }

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  # For opening the email in the web browser in non production environments
  if ENV["EMAIL_DELIVERY_METHOD"] == "letter_opener_web"
    mount LetterOpenerWeb::Engine, at: "/sent_emails"
  end

  root to: "root#index"
  draw(:internal_api)
  resources :dashboard, only: [:index]

  # get "*path", to: "home#index", via: :all
  resource :company, only: [:new, :show, :create, :update], controller: :companies do
    resource :purge_logo, only: [:destroy], controller: "companies/purge_logo"
  end

  resources :time_tracking, only: [:index], path: "time-tracking"

  resources :team, only: [:index, :update, :destroy, :edit]

  resources :reports, only: [:index]

  resources :workspaces, only: [:update]

  get "clients/*path", to: "clients#index", via: :all
  get "clients", to: "clients#index"

  get "invoices/*path", to: "invoices#index", via: :all
  get "invoices", to: "invoices#index"

  get "projects/*path", to: "projects#index", via: :all
  get "projects", to: "projects#index"

  devise_scope :user do
    get "profile", to: "users/registrations#edit"
    delete "profile/purge_avatar", to: "users/registrations#purge_avatar"
  end
end
