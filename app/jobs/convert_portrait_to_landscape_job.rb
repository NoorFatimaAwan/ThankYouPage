class ConvertPortraitToLandscapeJob < ActiveJob::Base
  #queue_as :default

  def perform(order,video_count)
    if order.present? && video_count > 0
      video_count.times do |index|
        video_path = ActiveStorage::Blob.service.path_for(order&.videos[index]&.key)
        video_data = MiniExiftool.new("#{video_path}")
        height = video_data&.imageheight
        width = video_data&.imagewidth
        testing_file = "#{Rails.root}/testing#{index}.mp4"
        dimensions = order&.variant_title&.downcase&.include?("8 pieces") ? "854:480" : "1280:720"
        if video_data&.imageheight > video_data&.imagewidth || (video_data&.rotation == 90 || video_data&.rotation == 270) 
          temp_file = "#{Rails.root}/temp#{index}.mp4"
          system(`ffmpeg -i  "#{video_path}" -filter_complex "[0:v]scale=ih*16/9:-1,boxblur=luma_radius='min(h\,w)/20':luma_power=1:chroma_radius='min(cw\,ch)/20':chroma_power=1[bg];[bg][0:v]overlay=(W-w)/2:(H-h)/2,crop=h=iw*9/16" "temp#{index}.mp4"`)
          system(`ffmpeg -i "temp#{index}.mp4" -vf "scale=#{dimensions}:force_original_aspect_ratio=decrease,pad=#{dimensions}:(ow-iw)/2:(oh-ih)/2" "testing#{index}.mp4"`)
          if (File.exists?(temp_file))
            File.delete(temp_file) 
          end
        else 
          system(`ffmpeg -i "#{video_path}" -vf "scale=#{dimensions}:force_original_aspect_ratio=decrease,pad=#{dimensions}:(ow-iw)/2:(oh-ih)/2" "testing#{index}.mp4"`)
        end
        if (File.exists?(testing_file))
          downloaded_video = open(testing_file)
          order.videos.attach(io: downloaded_video  , filename: "#{order&.videos[index]&.filename}")
          order.videos[index].purge
          downloaded_video.close
          File.delete(testing_file) 
        end
      end
    end
  end
end
