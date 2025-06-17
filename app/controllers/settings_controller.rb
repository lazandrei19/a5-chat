class SettingsController < ApplicationController
  before_action :authenticate_user!

  def edit
    render inertia: "settings/index", props: {
      api_key: current_user.api_key
    }
  end

  def update
    api_key = params.require(:api_key)
    if current_user.update(api_key: api_key)
      redirect_to settings_path, notice: "API key updated successfully."
    else
      redirect_to settings_path, inertia: { errors: current_user.errors.full_messages }, alert: "Failed to update API key."
    end
  end
end
