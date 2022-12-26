# frozen_string_literal: true

require "rails_helper"
RSpec.describe Project, type: :model do
  let(:project) { build(:project) }

  describe "Associations" do
    it { is_expected.to belong_to(:client) }
    it { is_expected.to have_many(:timesheet_entries) }
    it { is_expected.to have_many(:project_members).dependent(:destroy) }
  end

  describe "Validations" do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_inclusion_of(:billable).in_array([true, false]) }
  end

  describe "Callbacks" do
    it { is_expected.to callback(:discard_project_members).after(:discard) }
  end

  describe "#project_team_member_details" do
    subject { project.project_team_member_details time_frame }

    let(:company) { create(:company) }
    let(:user) { create(:user) }
    let(:client) { create(:client, company:) }
    let(:project) { create(:project, client:) }
    let!(:member) { create(:project_member, project:, user:, hourly_rate: 5000) }
    let(:hourly_rate) { member.hourly_rate }
    let(:result) do
      [{
        id: user.id,
        name: user.full_name,
        minutes_logged: 480.0,
        hourly_rate:
      }]
    end

    context "when entries are missing" do
      let(:time_frame) { "last_week" }

      it "returns data with 0 values" do
        expect(subject).to eq(
          [{
            id: member.user_id,
            name: user.full_name,
            hourly_rate:,
            minutes_logged: 0,
            cost: 0
          }])
      end
    end

    context "when time_frame is last_week" do
      let(:time_frame) { "last_week" }

      it "returns the project_team_member_details for a project in the last week" do
        timesheet_entry = create(:timesheet_entry, user:, project:, work_date: Date.today.last_week)
        result.first[:hourly_rate] = hourly_rate
        cost = (timesheet_entry.duration / 60) * member.hourly_rate
        result.first[:cost] = cost
        expect(subject).to eq(result)
      end
    end

    context "when time_frame is week" do
      let(:time_frame) { "week" }

      it "returns the project_team_member_details for a project in a week" do
        timesheet_entry = create(:timesheet_entry, user:, project:, work_date: Date.today.at_beginning_of_week)
        result.first[:hourly_rate] = hourly_rate
        cost = (timesheet_entry.duration / 60) * member.hourly_rate
        result.first[:cost] = cost
        expect(subject).to eq(result)
      end
    end

    context "when time_frame is month" do
      let(:time_frame) { "month" }

      it "returns the project_team_member_details for a project in a month" do
        timesheet_entry = create(:timesheet_entry, user:, project:, work_date: Date.today.at_beginning_of_month)
        result.first[:hourly_rate] = hourly_rate
        cost = (timesheet_entry.duration / 60) * member.hourly_rate
        result.first[:cost] = cost
        expect(subject).to eq(result)
      end
    end

    context "when time_frame is year" do
      let(:time_frame) { "year" }

      it "returns the project_team_member_details for a project in a year" do
        timesheet_entry = create(:timesheet_entry, user:, project:, work_date: Date.today.beginning_of_year)
        result.first[:hourly_rate] = hourly_rate
        cost = (timesheet_entry.duration / 60) * member.hourly_rate
        result.first[:cost] = cost
        expect(subject).to eq(result)
      end
    end
  end

  describe "#discard_project_members" do
    let(:company) { create(:company) }
    let(:user) { create(:user) }
    let(:client) { create(:client, company:) }
    let(:project) { create(:project, client:) }
    let!(:project_member1) { create(:project_member, project:, user:, hourly_rate: 5000) }
    let!(:project_member2) { create(:project_member, project:, user:, hourly_rate: 1000) }

    it "returns empty list of project members when project is discarded" do
      expect(project.project_members.kept.pluck(:id)).to match_array([project_member1.id, project_member2.id])
      project.discard!
      expect(project.reload.project_members.kept.pluck(:id)).to eq([])
    end
  end

  describe "#overdue_and_outstanding_amounts" do
    let(:company) { create(:company) }
    let(:user) { create(:user) }
    let(:client) { create(:client, company:) }
    let(:project) { create(:project, client:) }
    let(:sent_invoice1) { create(:invoice, client:, status: "sent") }
    let(:viewed_invoice1) { create(:invoice, client:, status: "sent") }
    let(:overdue_invoice1) { create(:invoice, client:, status: "overdue") }
    let(:overdue_invoice2) { create(:invoice, client:, status: "overdue") }

    before do
      create(:project_member, user:, project:)
      create_list(:timesheet_entry, 20, user:, project:)
      project.timesheet_entries.each_with_index do |timesheet_entry, index|
        invoice = if (index % 2) == 0
          index > 10 ? sent_invoice1 : overdue_invoice1
        else
          index > 10 ? viewed_invoice1 : overdue_invoice2
        end
        create(:invoice_line_item, invoice:, timesheet_entry:)
      end
    end

    it "return outstanding_amount overdue_amount amounts" do
      outstanding_amount = sent_invoice1.amount +
        viewed_invoice1.amount +
        overdue_invoice1.amount +
        overdue_invoice2.amount
      overdue_amount = overdue_invoice1.amount + overdue_invoice2.amount
      overdue_and_outstanding_amounts = project.overdue_and_outstanding_amounts

      expect(overdue_and_outstanding_amounts[:overdue_amount]).to eq(overdue_amount)
      expect(overdue_and_outstanding_amounts[:outstanding_amount]).to eq(outstanding_amount)
    end
  end
end
