class ConvertPortraitToLandscapeJob < ApplicationJob
  queue_as :default

  def perform(order,video_count)
    if order.present? && video_count > 0
      for index in 0..video_count
        video_path = ActiveStorage::Blob.service.path_for(order&.videos[index]&.key)
        temp_file = "#{Rails.root}/testing#{index}.mp4"
        system( "ffmpeg -i '#{video_path}' -c copy -aspect 16:9 'testing#{index}.mp4'")
        if (File.exists?(temp_file))
          downloaded_video = open(temp_file)
          order.videos.attach(io: downloaded_video  , filename: "#{order&.videos[index]&.filename}")
          order.videos[index].purge
          downloaded_video.close
          File.delete(temp_file)  
        end
      end
    end
  end
end
