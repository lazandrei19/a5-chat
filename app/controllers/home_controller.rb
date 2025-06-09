# frozen_string_literal: true

class HomeController < ApplicationController
  use_inertia_instance_props

  def index
    @logged_in = user_signed_in?
  end
end
