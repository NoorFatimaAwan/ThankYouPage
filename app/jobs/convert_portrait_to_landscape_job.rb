class ConvertPortraitToLandscapeJob < ActiveJob::Base
  #queue_as :default

  def perform(order,asset_count,user_email)
    if order.present? && asset_count > 0
      asset_count.times do |index|
        asset = order.file_type == 'image' ? order&.images : order&.videos
        asset_path = ActiveStorage::Blob.service.path_for(asset[index]&.key)
        asset_data = MiniExiftool.new("#{asset_path}")
        height = asset_data&.imageheight
        width = asset_data&.imagewidth
        filetypeextension = asset_data&.filetypeextension
        testing_file = "#{Rails.root}/testing#{index}.#{filetypeextension}"
        if asset_data&.imageheight > asset_data&.imagewidth || (asset_data&.rotation == 90 || asset_data&.rotation == 270)
          temp_file = "#{Rails.root}/temp#{index}.#{filetypeextension}"
          if order.file_type == 'video'
            dimensions = order&.variant_title&.downcase&.include?("8 piece") || order&.product_title&.downcase&.include?("8 piece") || order&.variant_title&.downcase&.include?("4\"") || order&.product_title&.downcase&.include?("4\"") ? "854:480" : "1280:720"
            system(`ffmpeg -i  "#{asset_path}" -filter_complex "[0:v]scale=ih*16/9:-1,boxblur=luma_radius='min(h\,w)/20':luma_power=1:chroma_radius='min(cw\,ch)/20':chroma_power=1[bg];[bg][0:v]overlay=(W-w)/2:(H-h)/2,crop=h=iw*9/16" "#{temp_file}"`)
            system(`ffmpeg -i "#{temp_file}" -vf "scale=#{dimensions}:force_original_aspect_ratio=decrease,pad=#{dimensions}:(ow-iw)/2:(oh-ih)/2" "#{testing_file}"`)
            filename = "#{asset[index]&.filename}"
          elsif order.file_type == 'image'
            testing_file = "#{Rails.root}/testing#{index}.jpg"
            dimensions = order&.variant_title&.downcase&.include?("8 piece") || order&.product_title&.downcase&.include?("8 piece") || order&.variant_title&.downcase&.include?("4\"") || order&.product_title&.downcase&.include?("4\"") ? "800:480" : "960:540"
            system(`ffmpeg -i  "#{asset_path}" -filter_complex "[0:v]scale=ih*16/9:-1,boxblur=luma_radius='min(h\,w)/20':luma_power=1:chroma_radius='min(cw\,ch)/20':chroma_power=1[bg];[bg][0:v]overlay=(W-w)/2:(H-h)/2,crop=h=iw*9/16" "#{temp_file}"`)
            system(`ffmpeg -i "#{temp_file}" -vf "scale=#{dimensions}" "#{testing_file}"`)
            name = "#{asset[index]&.filename}"
            filename = name.split('.')[0] + ".jpg"
          end
          File.delete(temp_file) if File.exists?(temp_file) && !temp_file.nil?
        else
          if order.file_type == 'video'
            dimensions = order&.variant_title&.downcase&.include?("8 piece") || order&.product_title&.downcase&.include?("8 piece") || order&.variant_title&.downcase&.include?("4\"") || order&.product_title&.downcase&.include?("4\"") ? "854:480" : "1280:720"
            system(`ffmpeg -i "#{asset_path}" -vf "scale=#{dimensions}:force_original_aspect_ratio=decrease,pad=#{dimensions}:(ow-iw)/2:(oh-ih)/2" "#{testing_file}"`)
            filename = "#{asset[index]&.filename}"
          elsif order.file_type == 'image'
            dimensions = order&.variant_title&.downcase&.include?("8 piece") || order&.product_title&.downcase&.include?("8 piece") || order&.variant_title&.downcase&.include?("4\"") || order&.product_title&.downcase&.include?("4\"") ? "800:480" : "960:540"
            system(`ffmpeg -i "#{asset_path}" -vf "scale=#{dimensions}" "#{testing_file}"`)
            name = "#{asset[index]&.filename}"
            filename = name.split('.')[0] + ".jpg"
          end
        end
        if (File.exists?(testing_file))
          downloaded_video = open(testing_file)
          asset.attach(io: downloaded_video  , filename: filename)
          asset[index].purge
          downloaded_video.close
          File.delete(testing_file)
        end
      end
    end
    Delayed::Job.enqueue InformClientJob.new(user_email,order) 
  end
end
