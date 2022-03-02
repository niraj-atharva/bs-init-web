# frozen_string_literal: true

class InternalApi::V1::ReportsController < InternalApi::V1::ApplicationController
  include Timesheet
  skip_after_action :verify_authorized

  def index
    render json: {
      success: true,
      entries: current_company.timesheet_entries.map do |e|
        e.formatted_entry.transform_keys { |k| k.to_s.camelize(:lower) }
      end
    }
  end
end