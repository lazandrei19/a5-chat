class Api::V1::ChatsController < ApplicationController
  # These endpoints are consumed by the React frontend. They only serve JSON.
  protect_from_forgery with: :null_session

  before_action :set_chat, only: :show

  # GET /api/v1/chats
  # Returns a list of available chats (dummy data seeded in db/seeds.rb)
  def index
    chats = Chat.includes(:messages)

    render json: chats.map { |chat| conversation_json(chat) }
  end

  # GET /api/v1/chats/:id
  # Returns the chat, including all its messages
  def show
    return render json: { error: "Chat not found" }, status: :not_found unless @chat

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
end
