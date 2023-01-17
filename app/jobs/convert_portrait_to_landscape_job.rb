class ConvertPortraitToLandscapeJob < ApplicationJob
  queue_as :default

  def perform(order,video_count)

    for i in 0..video_count
      video_path = ActiveStorage::Blob.service.path_for(order&.videos[i]&.key)
      temp_file = "#{Rails.root}/testing#{i}.mp4"
      system( "ffmpeg -i '#{video_path}' -c copy -aspect 16:9 'testing#{i}.mp4'")
      if (File.exists?(temp_file))
        downloaded_video = open(temp_file)
        order.videos.attach(io: downloaded_video  , filename: "#{order&.videos[i]&.filename}")
        order.videos[i].purge
        downloaded_video.close
        File.delete(temp_file)  
      end
    end
  end
end
