class ConvertPortraitToLandscapeJob < ApplicationJob
  queue_as :default

  def perform(order,video_count)
    if order.present? && video_count > 0
      video_count.times do |index|
        video_path = ActiveStorage::Blob.service.path_for(order&.videos[index]&.key)
        video_data = MiniExiftool.new("#{video_path}")
        if video_data&.imageheight > video_data&.imagewidth || video_data&.rotation == 90
          temp_file = "#{Rails.root}/testing#{index}.mp4"
          system(`ffmpeg -i "#{video_path}" -lavfi "color=color=black@.5:size=270x360:d=1[dark];[0:v]crop=270:360[blurbase];    [blurbase]boxblur=luma_radius='min(h,w)/20':luma_power=1:chroma_radius='min(cw,ch)/20':chroma_power=1[blurred];  [blurred][dark]overlay[darkened]; [darkened]scale=720:700[bg];    [0:v]scale=-1:700[fg]; [bg][fg]overlay=(W-w)/2:(H-h)/2" "testing#{index}.mp4"`)
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
end
