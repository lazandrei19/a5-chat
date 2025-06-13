# frozen_string_literal: true

RubyLLM.configure do |config|
  config.openai_api_key      = ENV.fetch("OPENAI_API_KEY", nil)
  config.anthropic_api_key   = ENV.fetch("ANTHROPIC_API_KEY", nil)
  config.gemini_api_key      = ENV.fetch("GEMINI_API_KEY", nil)
  config.deepseek_api_key    = ENV.fetch("DEEPSEEK_API_KEY", nil)
  config.openrouter_api_key  = ENV.fetch("OPENROUTER_API_KEY", nil)

  # === Custom endpoints / proxies ===
  # Example: use Azure OpenAI or a local proxy implementing the OpenAI protocol.
  config.openai_api_base     = ENV.fetch("OPENAI_API_BASE", nil)

  # === Defaults ===
  # These are used when no explicit model is passed from the code.
  # Prefer Google Gemini 2.5 Flash (non-thinking variant) served via OpenRouter.
  # Docs: https://openrouter.ai/google/gemini-2.5-flash-preview-05-20
  # The provider will automatically resolve to :openrouter given this model id.
  config.default_model            = ENV.fetch("RUBYLLM_DEFAULT_MODEL",  "google/gemini-2.5-flash-preview-05-20")
  config.default_embedding_model  = ENV.fetch("RUBYLLM_DEFAULT_EMBED_MODEL", "text-embedding-3-small")
  config.default_image_model      = ENV.fetch("RUBYLLM_DEFAULT_IMAGE_MODEL", "dall-e-3")

  # === Time-outs & retries ===
  config.request_timeout          = ENV.fetch("RUBYLLM_TIMEOUT", 120).to_i
  config.max_retries              = ENV.fetch("RUBYLLM_MAX_RETRIES", 3).to_i

  # === Logging ===
  # Use debug level in development, info in production
  config.log_file   = Rails.root.join("log/ruby_llm.log").to_s
  config.log_level  = Rails.env.development? ? :debug : :info
end
