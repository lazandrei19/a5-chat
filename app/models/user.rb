class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :omniauthable

  encrypts :api_key

  has_many :chats, dependent: :destroy
  has_many :messages, dependent: :destroy

  def get_context
    RubyLLM.context do |config|
      config.openrouter_api_key = api_key
    end
  end
end
