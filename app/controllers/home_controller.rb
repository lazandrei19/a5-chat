# frozen_string_literal: true

class HomeController < ApplicationController
  use_inertia_instance_props

  before_action :redirect_unauthorized_chat
  before_action :store_chat_location_for_signed_out_user

  def index
    @logged_in = user_signed_in?

    # When a chat ID is present in the route, expose the conversation details
    # (title, messages, etc.) to the Inertia frontend so it doesn't need to
    # perform an extra fetch request.

    # params[:id] is only present for the `/chat/:id` route.
    return unless params[:id].present? && user_signed_in?

    # Load the chat that belongs to the current user (the before_action
    # `redirect_unauthorized_chat` will already have prevented access to
    # chats that don't belong to the user).
    chat = current_user.chats.includes(:messages).find_by(id: params[:id])

    # If the chat cannot be found (e.g., it was deleted), simply return and
    # let the view render with no conversation selected.
    return unless chat

    # Selected conversation ID so the frontend knows which chat is active.
    @selected_conversation = chat.id

    # Conversation title: fall back to a truncated version of the first
    # message if the chat has no explicit title.
    @conversation_title = chat.title.presence || chat.messages.first&.content&.truncate(40) || "Chat #{chat.id}"

    # Serialize messages in the shape the React components expect.
    @messages = chat.messages.order(:created_at).map do |msg|
      {
        id: msg.id,
        content: msg.content,
        role: msg.role,
        timestamp: msg.created_at.iso8601,
        model: msg.model_id
      }
    end
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
