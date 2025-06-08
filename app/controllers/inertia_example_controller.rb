# frozen_string_literal: true

class InertiaExampleController < ApplicationController
  def index
    render inertia: "InertiaExample", props: {
      logged_in: user_signed_in?
    }
  end
end
