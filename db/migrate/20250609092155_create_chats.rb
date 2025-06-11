class CreateChats < ActiveRecord::Migration[8.0]
  def change
    create_table :chats, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.string :model_id
      t.string :title
      t.references :user, null: false, foreign_key: { on_delete: :cascade }

      t.timestamps
    end
  end
end
