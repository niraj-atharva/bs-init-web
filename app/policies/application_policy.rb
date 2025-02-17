# frozen_string_literal: true

class ApplicationPolicy
  attr_reader :user, :record

  ROLES = %i[owner admin employee book_keeper]
  def initialize(user, record)
    @user = user
    @record = record
  end

  ROLES.each do |role|
    define_method "user_#{role}_role?" do |resource = user.current_workspace|
      user.has_cached_role?("#{role}".to_sym, resource)
    end
  end

  def record_belongs_to_user?
    user.id == record.user_id
  end

  def user_under_sales_department?
    user.having_department?(17)
  end

  def user_under_hr_department?
    user.having_department?(4)
  end

  def user_under_information_department?
    user.having_department?(5)
  end

  def user_team_lead?
    user.team_lead?
  end
end
