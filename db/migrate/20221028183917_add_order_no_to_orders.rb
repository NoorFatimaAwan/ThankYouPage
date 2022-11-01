class AddOrderNoToOrders < ActiveRecord::Migration[5.2]
  def change
    add_column :orders, :order_no, :integer, limit: 8
  end
end
