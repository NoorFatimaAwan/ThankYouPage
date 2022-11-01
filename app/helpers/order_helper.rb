module OrderHelper
  def product_size(param)
    if param&.include? "6"
      return 6
    elsif param&.include? "4"
      return 4
    end
  end
end