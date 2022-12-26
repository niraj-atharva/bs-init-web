class AddWebsitesIntoLeads < ActiveRecord::Migration[7.0]
  def change
    add_column :leads, :websites, :text, default: [], array: true, after: :emails
  end
end
