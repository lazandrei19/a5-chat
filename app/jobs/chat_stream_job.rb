class ChatStreamJob < ApplicationJob
  queue_as :default

  # @param chat_id [Integer]
  # @param user_content [String]
  # @param model_id [String, nil]
  def perform(chat_id, user_content, model_id = nil)
    chat = Chat.find(chat_id)

    # Update the model id on the chat if requested by the client
    chat = chat.with_model(model_id) if model_id.present?

    assistant_message = nil

    chat.ask(user_content) do |chunk|
      # Fetch the assistant message record only once, after the first chunk arrives
      assistant_message ||= chat.messages.where(role: "assistant").order(:created_at).last
      next unless chunk.content.present? && assistant_message

      ChatChannel.broadcast_to(
        chat,
        type: "stream",
        message_id: assistant_message.id.to_s,
        content: chunk.content
      )
    end

    # Ensure we broadcast the final full assistant message (tokens, model etc.)
    assistant_message ||= chat.messages.where(role: "assistant").order(:created_at).last
    if assistant_message
      ChatChannel.broadcast_to(
        chat,
        type: "final",
        message: {
          id: assistant_message.id.to_s,
          content: assistant_message.content,
          role: "assistant",
          timestamp: assistant_message.created_at.iso8601,
          model: assistant_message.model_id
        }
      )
    end
  rescue StandardError => e
    Rails.logger.error("ChatStreamJob failed: #{e.class} - #{e.message}")

    ChatChannel.broadcast_to(
      chat,
      type: "error",
      message: {
        id: SecureRandom.uuid,
        content: "⚠️ Sorry, I couldn't complete that request. Please try again.",
        role: "assistant",
        timestamp: Time.current.iso8601,
        model: nil
      }
    )
  end
end
