class AssetUploadJob < ApplicationJob
  queue_as :default

  def perform(order)
    order.save!
  end
end
