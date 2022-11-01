class Order < ApplicationRecord
  has_many_attached :images
  has_one_attached :video

  validates :shop_id, presence: true

  def thumbnail input
    return self.images[input].variant(resize: '300x300!').processed
  end
end