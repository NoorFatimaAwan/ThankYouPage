class AddColumnToOrders < ActiveRecord::Migration[5.2]
  def change
    add_column :orders, :email_status, :string
    add_column :orders, :variant_title, :string
  end
end
