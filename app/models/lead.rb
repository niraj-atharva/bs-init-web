# frozen_string_literal: true

# == Schema Information
#
# Table name: leads
#
#  id                            :bigint           not null, primary key
#  address                       :text
#  base_currency                 :string           default("USD")
#  budget_amount                 :decimal(, )      default(0.0)
#  country                       :string
#  description                   :string
#  discarded_at                  :datetime
#  donotbulkemail                :boolean          default(FALSE)
#  donotemail                    :boolean          default(FALSE)
#  donotfax                      :boolean          default(FALSE)
#  donotphone                    :boolean          default(FALSE)
#  email                         :string
#  emails                        :text             default([]), is an Array
#  first_name                    :string
#  job_position                  :string
#  last_name                     :string
#  linkedinid                    :string
#  mobilephone                   :string
#  preferred_contact_method_code :integer
#  priority_code                 :integer
#  quality_code                  :integer
#  skypeid                       :string
#  source_code                   :integer
#  stage_code                    :integer
#  status_code                   :integer
#  tech_stack_ids                :text             default([]), is an Array
#  telephone                     :string
#  timezone                      :string
#  title                         :string
#  websites                      :text             default([]), is an Array
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  assignee_id                   :bigint
#  company_id                    :bigint
#  created_by_id                 :bigint
#  industry_code_id              :integer
#  reporter_id                   :bigint
#  updated_by_id                 :bigint
#
# Indexes
#
#  index_leads_on_assignee_id    (assignee_id)
#  index_leads_on_company_id     (company_id)
#  index_leads_on_created_by_id  (created_by_id)
#  index_leads_on_discarded_at   (discarded_at)
#  index_leads_on_reporter_id    (reporter_id)
#  index_leads_on_updated_by_id  (updated_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (assignee_id => users.id)
#  fk_rails_...  (company_id => companies.id)
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (reporter_id => users.id)
#  fk_rails_...  (updated_by_id => users.id)
#
class Lead < ApplicationRecord
  include Discard::Model
  include LeadConstants
  include LeadTimeliness

  belongs_to :assignee, class_name: :User, optional: true
  belongs_to :reporter, class_name: :User, optional: true
  belongs_to :created_by, class_name: :User, optional: true
  belongs_to :updated_by, class_name: :User, optional: true
  belongs_to :company, optional: true
  belongs_to :industry_code, optional: true

  has_many :lead_line_items, dependent: :destroy
  has_many :lead_quotes, dependent: :destroy
  has_many :lead_timelines, dependent: :destroy

  validates :first_name, :last_name, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, if: :email

  before_validation :assign_default_values

  validate :validate_emails

  def validate_emails
    emails.each do |email|
      unless email.match?(/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i)
        errors.add(:emails, "#{email} is not a valid email address.")
      end
    end
  end

  validate :validate_websites

  def validate_websites
    websites.each do |website|
      unless website.slice(URI.regexp(%w(http https))) == website
        errors.add(:websites, "#{website} is not a valid url.")
      end
    end
  end

  def self.filter(params: {}, user: User.none, ids: false)
    allow_leads = Lead.none

    return(allow_leads) if user.blank?

    quality_codes = params[:quality_codes].present? ? params[:quality_codes].split(",").map(&:to_i) : []
    assignees = params[:assignees].present? ? params[:assignees].split(",").map(&:to_i) : []
    reporters = params[:reporters].present? ? params[:reporters].split(",").map(&:to_i) : []
    country_alphas = params[:country_alphas].present? ? params[:country_alphas].split(",") : []
    industry_codes = params[:industry_codes].present? ? params[:industry_codes].split(",").map(&:to_i) : []
    source_codes = params[:source_codes].present? ? params[:source_codes].split(",").map(&:to_i) : []
    status_codes = params[:status_codes].present? ? params[:status_codes].split(",").map(&:to_i) : []
    stage_codes = params[:stage_codes].present? ? params[:stage_codes].split(",").map(&:to_i) : []

    allow_leads = Lead.includes(:assignee, :reporter, :created_by, :updated_by).where(discarded_at: nil)

    if user.having_department?(17)
      allow_leads = allow_leads.where(
        "assignee_id = ? OR reporter_id = ? OR created_by_id = ?", user.id, user.id,
        user.id)
    end

    allow_leads = allow_leads.where("first_name LIKE ?", "%#{params[:q]}%") if params[:q].present?
    allow_leads = allow_leads.where("last_name LIKE ?", "%#{params[:q]}%") if params[:q].present?
    allow_leads = allow_leads.where(assignee_id: assignees) if assignees.present?
    allow_leads = allow_leads.where(reporter_id: reporters) if reporters.present?
    allow_leads = allow_leads.where(quality_code: quality_codes) if quality_codes.present?
    allow_leads = allow_leads.where(country: country_alphas) if country_alphas.present?
    allow_leads = allow_leads.where(industry_code: industry_codes) if industry_codes.present?
    allow_leads = allow_leads.where(source_code: source_codes) if source_codes.present?
    allow_leads = allow_leads.where(status_code: status_codes) if status_codes.present?
    allow_leads = allow_leads.where(stage_code: stage_codes) if stage_codes.present?

    ids ? allow_leads.pluck(:id).uniq : allow_leads
  end

  def assign_default_values
    self.updated_by_id = self.created_by_id if self.updated_by_id.blank? && self.created_by_id.present?
    self.status_code = Lead::STATUS_CODE_OPTIONS.group_by(&:name)["New"].first.id if self.status_code.blank?
  end

  def industry_code_name_hash
    Lead::INDUSTRY_CODE_OPTIONS.group_by(&:id).transform_values { |val| val.first.name }
    IndustryCode.all.group_by(&:id).transform_values { |val| val.first.name }
  end

  def quality_code_name_hash
    Lead::QUALITY_CODE_OPTIONS.group_by(&:id).transform_values { |val| val.first.name }
  end

  def stage_code_name_hash
    Lead::STAGE_CODE_OPTIONS.group_by(&:id).transform_values { |val| val.first.name }
  end

  def status_code_name_hash
    Lead::STATUS_CODE_OPTIONS.group_by(&:id).transform_values { |val| val.first.name }
  end

  def preferred_contact_method_code_name_hash
    Lead::PREFERRED_CONTACT_METHOD_CODE_OPTIONS.group_by(&:id).transform_values { |val| val.first.name }
  end

  def source_code_name_hash
    Lead::SOURCE_CODE_OPTIONS.group_by(&:id).transform_values { |val| val.first.name }
  end

  def priority_code_name_hash
    Lead::PRIORITY_CODE_OPTIONS.group_by(&:id).transform_values { |val| val.first.name }
  end

  def tech_stack_name_hash
    Lead::TECH_STACK_OPTIONS.group_by(&:id).transform_values { |val| val.first.name }
  end

  def industry_code_name
    return "" if industry_code.nil?

    self.industry_code.name
    # self.industry_code_name_hash[industry_code]
  end

  def quality_code_name
    return "" if quality_code.nil?

    self.quality_code_name_hash[quality_code]
  end

  def stage_code_name
    return "" if stage_code.nil?

    self.stage_code_name_hash[stage_code]
  end

  def status_code_name
    return "" if status_code.nil?

    self.status_code_name_hash[status_code]
  end

  def preferred_contact_method_code_name
    return "" if preferred_contact_method_code.nil?

    self.preferred_contact_method_code_name_hash[preferred_contact_method_code]
  end

  def source_code_name
    return "" if source_code.nil?

    self.source_code_name_hash[source_code]
  end

  def priority_code_name
    return "" if priority_code.nil?

    self.priority_code_name_hash[priority_code]
  end

  def tech_stack_names
    return [] unless tech_stack_ids.present?

    self.tech_stack_name_hash.values_at(*tech_stack_ids.map(&:to_i)).flatten.compact.uniq
  end

  def assignee_name
    self.assignee ? self.assignee.full_name : ""
  end

  def reporter_name
    self.reporter ? self.reporter.full_name : ""
  end

  def created_by_name
    self.created_by ? self.created_by.full_name : ""
  end

  def updated_by_name
    self.updated_by ? self.updated_by.full_name : ""
  end

  def name
    [first_name, last_name].compact.join(" ")
  end

  def lead_detail
    {
      id: self.id,
      address: self.address,
      base_currency: self.base_currency,
      budget_amount: self.budget_amount,
      country: self.country,
      description: self.description,
      discarded_at: self.discarded_at,
      donotbulkemail: self.donotbulkemail,
      donotemail: self.donotemail,
      donotfax: self.donotfax,
      donotphone: self.donotphone,
      industry_code_id: self.industry_code_id,
      linkedinid: self.linkedinid,
      mobilephone: self.mobilephone,
      name: self.name,
      email: self.email,
      quality_code: self.quality_code,
      skypeid: self.skypeid,
      stage_code: self.stage_code,
      status_code: self.status_code,
      telephone: self.telephone,
      timezone: self.timezone,
      assignee_id: self.assignee_id,
      reporter_id: self.reporter_id,
      created_by_id: self.created_by_id,
      updated_by_id: self.updated_by_id,
      preferred_contact_method_code: self.preferred_contact_method_code,
      first_name: self.first_name,
      last_name: self.last_name,
      job_position: self.job_position,
      source_code: self.source_code,
      tech_stack_ids: self.tech_stack_ids || [],
      emails: self.emails || [],
      priority_code: self.priority_code,
      title: self.title,
      company_id: self.company_id,
      industry_code_name:	self.industry_code_name,
      quality_code_name:	self.quality_code_name,
      stage_code_name:	self.stage_code_name,
      status_code_name:	self.status_code_name,
      assignee_name: self.assignee_name,
      reporter_name: self.reporter_name,
      created_by_name: self.created_by_name,
      updated_by_name: self.updated_by_name,
      preferred_contact_method_code_name: self.preferred_contact_method_code_name,
      source_code_name: self.source_code_name,
      priority_code_name: self.priority_code_name,
      tech_stack_names: self.tech_stack_names,
      websites: self.websites || []
    }
  end
end
