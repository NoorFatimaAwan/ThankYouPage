class AssetUploadJob < ApplicationJob
  queue_as :default

  def perform(order,user_email)
    if order.save!
      asset = order.file_type == 'image' ? order&.images : order&.videos
      asset_count = asset&.count
      Delayed::Job.enqueue ConvertPortraitToLandscapeJob.new(order,asset_count,user_email) if order.present? && asset_count > 0
    end
  end
end
