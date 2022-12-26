# frozen_string_literal: true

class RenameStateToStageIntoLeads < ActiveRecord::Migration[7.0]
  def change
    rename_column :leads, :state_code, :stage_code
    remove_column :leads, :budget_status_code, :integer
    remove_column :leads, :initial_communication, :integer
    remove_column :leads, :need, :integer
  end
end
