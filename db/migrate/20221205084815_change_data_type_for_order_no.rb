class ChangeDataTypeForOrderNo < ActiveRecord::Migration[5.2]
  def up
    change_column :orders, :order_no, :string
  end

  def down
      change_column :orders, :order_no, :integer, limit: 8
  end
end
