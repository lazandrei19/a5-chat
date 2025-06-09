class Message < ApplicationRecord
  acts_as_message

  belongs_to :user

  has_many_attached :attachments
end
