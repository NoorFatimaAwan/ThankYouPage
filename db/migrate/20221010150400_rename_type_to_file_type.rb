class RenameTypeToFileType < ActiveRecord::Migration[5.2]
  def change
    rename_column :orders, :type, :file_type
  end
end
