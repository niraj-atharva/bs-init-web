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
end
