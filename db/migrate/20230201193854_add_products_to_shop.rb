class AddProductsToShop < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :enabled_app_products, :string, array: true, default: []
  end
end
