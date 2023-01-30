class AssetUploadJob < ApplicationJob
  queue_as :default

  def perform(order)
    if order.save!
      video_count = order&.videos&.count
      ConvertPortraitToLandscapeJob.perform_now(order,video_count) if order.present? && video_count > 0
    end
  end
end
