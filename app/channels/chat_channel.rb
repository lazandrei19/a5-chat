class ChatChannel < ApplicationCable::Channel
  # Called when the consumer has successfully
  # become a subscriber of this channel.
  def subscribed
    chat = current_user.chats.find_by(id: params[:chat_id])
    reject unless chat

    # Stream updates scoped to this specific chat record
    stream_for chat
  end

  # Client-side performs "send_message" with:
  # { chat_id: <uuid>, content: <string>, model_id: <string> }
  def send_message(data)
    chat_id   = data["chat_id"]
    content   = (data["content"] || "").to_s.strip
    model_id  = data["model_id"]

    return if content.blank?

    chat = current_user.chats.find_by(id: chat_id)
    return unless chat

    # Persisting and broadcasting is now handled entirely inside ChatStreamJob to
    # avoid creating duplicate user messages. We only enqueue the job with the
    # raw user content & chosen model.

    # Kick off background job which will:
    #   1. Create & broadcast the user message (once) to all subscribers
    #   2. Process the conversation via RubyLLM
    #   3. Stream the assistant response back to this channel
    ChatStreamJob.perform_later(chat.id, content, model_id)
  end
end
