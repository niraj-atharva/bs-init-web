# == Schema Information
#
# Table name: lead_tech_stacks
#
#  id            :bigint           not null, primary key
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  lead_id       :bigint
#  tech_stack_id :bigint
#
# Indexes
#
#  index_lead_tech_stacks_on_lead_id        (lead_id)
#  index_lead_tech_stacks_on_tech_stack_id  (tech_stack_id)
#
class LeadTechStack < ApplicationRecord
  include Discard::Model

  belongs_to :lead
  belongs_to :tech_stack

  validates :tech_stack_id, uniqueness: {scope: :lead_id}
end
