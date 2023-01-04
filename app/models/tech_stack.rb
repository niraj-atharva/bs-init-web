# == Schema Information
#
# Table name: tech_stacks
#
#  id         :bigint           not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class TechStack < ApplicationRecord
  has_many :lead_tech_stacks, dependent: :destroy
  has_many :leads, through: :lead_tech_stacks

  validates :name, uniqueness: true
end
