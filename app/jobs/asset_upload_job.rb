class AssetUploadJob < ApplicationJob
  queue_as :default

  def perform(order)
    if order.save!
      asset = = order.file_type == 'image' ? order&.images : order&.videos
      asset_count = asset&.count
      Delayed::Job.enqueue ConvertPortraitToLandscapeJob.new(order,asset_count) if order.present? && video_count > 0
    end
  end
end
