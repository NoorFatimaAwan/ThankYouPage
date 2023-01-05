# frozen_string_literal: true

class ChangeVideoToVideo < ActiveRecord::Migration[5.2]
  def up
    ActiveStorage::Attachment.where(name: "video")
                             .where(record_type: "Order")
                             .update(name: "videos")
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
