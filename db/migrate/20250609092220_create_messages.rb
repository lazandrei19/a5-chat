class CreateMessages < ActiveRecord::Migration[8.0]
  def change
    create_table :messages do |t|
      t.references :chat, type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.string :role
      t.text :content
      t.string :model_id
      t.integer :input_tokens
      t.integer :output_tokens

      t.timestamps
    end
  end
end
