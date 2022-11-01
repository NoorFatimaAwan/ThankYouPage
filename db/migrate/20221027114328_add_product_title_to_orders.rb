class AddProductTitleToOrders < ActiveRecord::Migration[5.2]
  def change
    add_column :orders, :product_title, :string
  end
end
