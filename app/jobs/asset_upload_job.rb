class AssetUploadJob < ApplicationJob
  queue_as :default

  def perform(order,video_count)
    if order.save!
      ConvertPortraitToLandscapeJob.perform_now(order,video_count) if order.present? && video_count.present?
    end
  end
end
