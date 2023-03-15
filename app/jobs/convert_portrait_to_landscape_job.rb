class ConvertPortraitToLandscapeJob < ApplicationJob
  queue_as :default

  def perform(order,video_count)
    if order.present? && video_count > 0
      video_count.times do |index|
        video_path = ActiveStorage::Blob.service.path_for(order&.videos[index]&.key)
        video_data = MiniExiftool.new("#{video_path}")
        height = video_data&.imageheight
        width = video_data&.imagewidth
        if video_data&.imageheight > video_data&.imagewidth || (video_data&.rotation == 90 || video_data&.rotation == 270) 
          gcd = greatest_common_divisor(height,width)
          if video_data&.imageheight > video_data&.imagewidth
            height_ratio = height/gcd
            width_ratio = width/gcd
          else
            height_ratio = width/gcd
            width_ratio = height/gcd
          end
          temp_file = "#{Rails.root}/testing#{index}.mp4"
          system(`ffmpeg -i "#{video_path}" -filter_complex "[0:v]scale=ih*#{height_ratio}/#{width_ratio}:-1,boxblur=luma_radius='min(h\,w)/20':luma_power=1:chroma_radius='min(cw\,ch)/20':chroma_power=1[bg];[bg][0:v]overlay=(W-w)/2:(H-h)/2,crop=h=iw*#{width_ratio}/#{height_ratio}" "testing#{index}.mp4"`)
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
  def greatest_common_divisor(height,width)
    if (height > width) 
      x = height;
      y = width;
    else 
      x = width;
      y = height;
    end
    rem = x % y;
    while (rem != 0) 
      x = y;
      y = rem;
      rem = x % y;
    end
    return y
  end
end
