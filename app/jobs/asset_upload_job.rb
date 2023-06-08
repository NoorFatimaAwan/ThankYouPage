class AssetUploadJob < ApplicationJob
  queue_as :default

  def perform(order)
    if order.save!
      asset = order.file_type == 'image' ? order&.images : order&.videos
      asset_count = asset&.count
      puts "asset_job"
      puts order
      puts asset_count
      puts "=========="
      Delayed::Job.enqueue ConvertPortraitToLandscapeJob.new(order,asset_count) if order.present? && asset_count > 0
    end
  end
end
