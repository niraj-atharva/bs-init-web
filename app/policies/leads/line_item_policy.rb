# frozen_string_literal: true

class Leads::LineItemPolicy < ApplicationPolicy
  attr_reader :error_message_key

  def index?
    true
  end

  def items?
    true
  end

  def show?
    can_access?
  end

  def create?
    can_access?
  end

  def new_invoice_line_items?
    can_access?
  end

  def update?
    can_access?
  end

  def destroy?
    can_access?
  end

  def can_access?
    user_owner_role? || user_admin_role? || (user_employee_role? && user_under_sales_department?)
  end

  def permitted_attributes
    [
      :name, :kind, :description, :price,
      :number_of_resource, :resource_expertise_level
    ]
  end
end
