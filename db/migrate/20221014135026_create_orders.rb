class CreateOrders < ActiveRecord::Migration[5.2]
  def change
    create_table :orders do |t|
      t.references :shop, foreign_key: true
      t.integer :product_id, limit: 8
      t.string :file_type
      t.boolean :prev_checkbox
      t.timestamps
    end
  end
end
