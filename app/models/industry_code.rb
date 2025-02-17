# frozen_string_literal: true

# == Schema Information
#
# Table name: industry_codes
#
#  id         :bigint           not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class IndustryCode < ApplicationRecord
  has_many :leads

  validates :name, uniqueness: true
end
