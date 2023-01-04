class CreateTechStacks < ActiveRecord::Migration[7.0]
  def change
    create_table :tech_stacks do |t|
      t.string :name

      t.timestamps
    end
    create_table :lead_tech_stacks do |t|
      t.belongs_to :lead, index: true
      t.belongs_to :tech_stack, index: true

      t.timestamps
    end
    Lead::TECH_STACK_OPTIONS.each do |tech|
      tech_stack = TechStack.find_or_create_by(name: tech[:name])
    end
    Lead.where.not(tech_stack_ids: []).all.each do |lead|
      lead.tech_stack_ids.each do |stack_id|
        tech_stack = TechStack.find_by(name: Lead::TECH_STACK_OPTIONS[stack_id.to_i].name)
        LeadTechStack.create(lead_id: lead.id, tech_stack_id: tech_stack.id)
      end
    end
    remove_column :leads, :tech_stack_ids
  end
end
