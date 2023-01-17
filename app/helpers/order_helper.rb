module OrderHelper
  def product_size(param)
    if param&.include? "16 Pieces"
      return 6
    elsif param&.include? "8 Pieces"
      return 4
    end
  end

  def user_email(email)
    email.to_s
  end
end