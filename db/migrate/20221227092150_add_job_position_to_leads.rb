class AddJobPositionToLeads < ActiveRecord::Migration[7.0]
  def change
    add_column :leads, :job_position, :string
  end
end
