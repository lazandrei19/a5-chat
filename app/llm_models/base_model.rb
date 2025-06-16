module LlmModels
  class BaseModel
    class << self
      # Human-readable model name.
      def name
        raise_not_implemented(__method__)
      end

      # Full identifier recognised by OpenRouter.
      def openrouter_id
        raise_not_implemented(__method__)
      end

      # Identifier used by the native provider (OpenAI, Anthropic, etc.).
      def id
        raise_not_implemented(__method__)
      end

      # Symbolic provider name.
      def provider
        raise_not_implemented(__method__)
      end

      def get_context(user)
        RubyLLM.context do |config|
          config.openrouter_api_key = user.api_key if user.respond_to?(:api_key)
          config.default_model      = openrouter_id
        end
      end

      def available_models
        descendants
      end

      def frontend_options
        available_models.map { |klass| { constant: klass.to_s, label: klass.name } }
      end

      private

      def raise_not_implemented(method_name)
        raise NotImplementedError, "#{self}.#{method_name} must be implemented in a subclass"
      end
    end
  end
end
