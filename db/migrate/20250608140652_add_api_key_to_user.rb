class AddApiKeyToUser < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :api_key, :string, limit: 512
  end
end
