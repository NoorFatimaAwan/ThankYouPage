module OrderHelper
  def product_size(param)
    if param&.downcase&.include? "16 pieces"
      return 6
    elsif param&.downcase&.include? "8 pieces"
      return 4
    else
      return 0
    end
  end

  def user_email(email)
    email.to_s
  end
end