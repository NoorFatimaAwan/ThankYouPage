class AddVariantsToShop < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :enabled_app_variants, :string, array: true, default: []
  end
end
