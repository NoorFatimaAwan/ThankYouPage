class AddScriptCheckBoxToShop < ActiveRecord::Migration[5.2]
  def change
    add_column :shops, :script_check_box, :boolean
  end
end
