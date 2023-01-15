class AddShopOrderIdToOrders < ActiveRecord::Migration[5.2]
  def change
    add_column :orders, :shop_order_id, :integer, limit: 8
  end
end
