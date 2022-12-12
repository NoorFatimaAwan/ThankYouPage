class Order < ApplicationRecord
  has_many_attached :images
  has_one_attached :video

  validates :shop_id, presence: true

  def thumbnail input
    return self.images[input].variant(resize: '300x300!').processed
  end

  def self.update_email_status(order_id)
    @order = Order.where(shop_order_id: order_id)&.last
    send_email = false
    if @order.created_at.to_date + 1.day == Date.today
      send_email = true
      order.update(email_status: 'Delivered after 1 day')
    elsif @order.created_at.to_date + 3.days == Date.today
      send_email = true
      order.update(email_status: 'Delivered after 3 days')
    elsif @order.created_at.to_date + 4.days == Date.today
      send_email = true
      order.update(email_status: 'Delivered after 4 days')
    elsif @order.created_at.to_date + 7.days == Date.today
      send_email = true
      order.update(email_status: 'Delivered after 7 days')
    elsif @order.created_at.to_date + 14.days == Date.today
      send_email = true
      order.update(email_status: 'Delivered after 14 days')
    end
    return send_email
  end
end