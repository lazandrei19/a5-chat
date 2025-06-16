# Define namespace and configure autoloader so that
# files inside app/llm_models/ map to the LlmModels:: namespace.
module LlmModels; end

Rails.autoloaders.main.push_dir(Rails.root.join("app/llm_models"), namespace: LlmModels)
