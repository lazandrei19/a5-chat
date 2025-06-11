# frozen_string_literal: true

class HomeController < ApplicationController
  use_inertia_instance_props

  before_action :redirect_unauthorized_chat
  before_action :store_chat_location_for_signed_out_user

  def index
    @logged_in = user_signed_in?
  end

  private

  # Redirect signed-in users to the root path if they try to access a chat that
  # does not belong to them. Signed-out users are allowed to stay on the page so
  # that, once they authenticate, they can be redirected back to the intended
  # chat.
  def redirect_unauthorized_chat
    return unless user_signed_in? && params[:id].present?

    unless current_user.chats.exists?(id: params[:id])
      redirect_to root_path
    end
  end

  # When a signed-out visitor lands on /chat/:id we want Devise to return them
  # to the same URL once they authenticate. We accomplish this by storing the
  # current path in Devise's session storage.
  def store_chat_location_for_signed_out_user
    return if user_signed_in?

    # Only store locations for chat pages (they include an :id param).
    return unless params[:id].present?

    store_location_for(:user, request.fullpath)
  end
end
