class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  inertia_share do
    {
      logged_in: user_signed_in?,
      llm_models: LlmModels::BaseModel.frontend_options
    }
  end

  inertia_share chats: -> {
    if user_signed_in?
      current_user.chats.select(:id, :title, :created_at)
    else
      []
    end
  }
end
