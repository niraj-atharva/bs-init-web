# frozen_string_literal: true

class CreateIndustryCodes < ActiveRecord::Migration[7.0]
  def change
    create_table :industry_codes do |t|
      t.string :name

      t.timestamps
    end
    rename_column :leads, :industry_code, :industry_code_id
    Lead::INDUSTRY_CODE_OPTIONS.each do |code|
      industry_code = IndustryCode.find_or_create_by(name: code[:name])
      Lead.where(industry_code_id: code[:id]).update_all(industry_code_id: industry_code.id)
    end
  end
end
