class Api::V1::ChatsController < ApplicationController
  # These endpoints are consumed by the React frontend. They only serve JSON.
  protect_from_forgery with: :null_session

  # Only proceed if the user is signed in; otherwise, actions will handle the
  # unauthenticated case explicitly.

  before_action :set_chat, only: :show
  # Ensure the chat belongs to the current user when showing a single chat
  before_action :ensure_authorized_user!, only: :show

  # GET /api/v1/chats
  # Returns a list of available chats (dummy data seeded in db/seeds.rb)
  def index
    # Return an empty array when no user is signed in
    unless user_signed_in?
      return render json: []
    end

    chats = current_user.chats.includes(:messages)

    render json: chats.map { |chat| conversation_json(chat) }
  end

  # GET /api/v1/chats/:id
  # Returns the chat, including all its messages
  def show
    # If a redirect has already been issued by a before_action, do nothing.
    return if performed?

    # If the user is not logged in, return an empty JSON object so the frontend
    # does not receive any conversation data.
    unless user_signed_in?
      return render json: {}
    end

    # At this point, @chat is guaranteed to belong to current_user by the
    # before_action :ensure_authorized_user!
    render json: conversation_json(@chat).merge(messages: messages_json(@chat))
  end

  private

  def set_chat
    @chat = Chat.includes(:messages).find_by(id: params[:id])
  end

  def conversation_json(chat)
    {
      id: chat.id,
      title: chat.messages.first&.content&.truncate(40) || "Chat #{chat.id}",
      timestamp: chat.updated_at.iso8601,
      messageCount: chat.messages.size,
      hasNewActivity: false # This would normally be calculated based on user activity
    }
  end

  def messages_json(chat)
    chat.messages.order(:created_at).map do |msg|
      {
        id: msg.id,
        content: msg.content,
        role: msg.role,
        timestamp: msg.created_at.iso8601,
        model: msg.model_id
      }
    end
  end

  # Redirect signed-in users to the root path if they attempt to access a chat
  # that doesn't belong to them. This prevents them from seeing another user's
  # data while still allowing the frontend to handle the redirect cleanly.
  def ensure_authorized_user!
    # Skip authorization if the user isn't signed in. The action itself will
    # handle the unauthenticated case.
    return unless user_signed_in?

    return if @chat.present? && @chat.user_id == current_user.id

    # Either the chat does not exist or it belongs to another user.
    redirect_to root_path and return
  end
end
