class AddShopAccessScopesColumn < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :access_scopes, :string
  end
end
