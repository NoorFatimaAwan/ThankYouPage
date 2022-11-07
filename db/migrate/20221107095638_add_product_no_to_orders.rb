class AddProductNoToOrders < ActiveRecord::Migration[5.2]
  def change
    add_column :orders, :product_no, :integer
  end
end
