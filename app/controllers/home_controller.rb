# frozen_string_literal: true

class HomeController < ApplicationController
  use_inertia_instance_props

  before_action :redirect_unauthorized_chat
  before_action :store_chat_location_for_signed_out_user

  def index
    return unless params[:id].present? && user_signed_in?
    chat = current_user.chats.includes(:messages).find_by(id: params[:id])
    return unless chat
    @selected_conversation = chat.id
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

  def redirect_unauthorized_chat
    return unless user_signed_in? && params[:id].present?

    unless current_user.chats.exists?(id: params[:id])
      redirect_to root_path
    end
  end

  def store_chat_location_for_signed_out_user
    return if user_signed_in?

    # Only store locations for chat pages (they include an :id param).
    return unless params[:id].present?

    store_location_for(:user, request.fullpath)
  end
end
