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
    let(:result) do
      [{
        id: user.id,
        name: user.full_name,
        hourly_rate: 5000,
        minutes_logged: 480.0
      }]
    end

    context "when entries are missing" do
      let(:time_frame) { "last_week" }

      it "returns data with 0 values" do
        expect(subject).to eq([{ id: member.user_id, name: user.full_name, hourly_rate: 5000, minutes_logged: 0 }])
      end
    end

    context "when time_frame is last_week" do
      let(:time_frame) { "last_week" }

      it "returns the project_team_member_details for a project in the last week" do
        create(:timesheet_entry, user:, project:, work_date: Date.today.last_week)
        expect(subject).to eq(result)
      end
    end

    context "when time_frame is week" do
      let(:time_frame) { "week" }

      it "returns the project_team_member_details for a project in a week" do
        create(:timesheet_entry, user:, project:, work_date: Date.today)
        expect(subject).to eq(result)
      end
    end

    context "when time_frame is month" do
      let(:time_frame) { "month" }

      it "returns the project_team_member_details for a project in a month" do
        create(:timesheet_entry, user:, project:, work_date: Date.today.next_week)
        expect(subject).to eq(result)
      end
    end

    context "when time_frame is year" do
      let(:time_frame) { "year" }

      it "returns the project_team_member_details for a project in a year" do
        create(:timesheet_entry, user:, project:, work_date: Date.today.last_month)
        expect(subject).to eq(result)
      end
    end
  end

  describe "#total_hours_logged" do
    let(:company) { create(:company) }
    let(:user) { create(:user) }
    let(:client) { create(:client, company:) }
    let(:project) { create(:project, client:) }
    let(:project_member) { create(:project_member, project:, user:, hourly_rate: 5000) }

    context "when time_frame is last week" do
      let(:time_frame) { "last_week" }

      let(:last_week_start_date) { Date.today.last_week.beginning_of_week }
      let(:last_week_end_date) { Date.today.last_week.end_of_week }
      let(:current_week) { Date.today.beginning_of_week }

      it "returns total duration for timesheet entries in last week" do
        timesheet_entry1 = create(:timesheet_entry, user:, project:, duration: 300, work_date: last_week_start_date)
        timesheet_entry2 = create(:timesheet_entry, user:, project:, duration: 200, work_date: last_week_end_date)
        timesheet_entry3 = create(:timesheet_entry, user:, project:, duration: 400, work_date: current_week)

        # timesheet_entry3 is excluded since it belongs to current week
        total_duration = timesheet_entry1.duration + timesheet_entry2.duration
        expect(project.total_hours_logged(time_frame)).to eq(total_duration)
      end
    end

    context "when time_frame is week" do
      let(:time_frame) { "week" }
      let(:beginning_of_week) { Date.today.beginning_of_week + 1.day }
      let(:end_of_week) { Date.today.end_of_week - 1.day }
      let(:last_week) { Date.today.end_of_week - 9.days }

      it "returns total duration for timesheet entries in a week" do
        timesheet_entry1 = create(:timesheet_entry, user:, project:, duration: 100, work_date: beginning_of_week)
        timesheet_entry2 = create(:timesheet_entry, user:, project:, duration: 400, work_date: end_of_week)
        timesheet_entry3 = create(:timesheet_entry, user:, project:, duration: 800, work_date: last_week)

        # timesheet_entry3 is excluded since it belongs to last week
        total_duration = timesheet_entry1.duration + timesheet_entry2.duration
        expect(project.total_hours_logged(time_frame)).to eq(total_duration)
      end
    end

    context "when time_frame is month" do
      let(:time_frame) { "month" }
      let(:beginning_of_month) { Date.today.beginning_of_month + 2.days }
      let(:end_of_month) { Date.today.end_of_month - 1.day }
      let(:previous_month) { Date.today.end_of_month - 2.months }

      it "returns total duration for timesheet entries in a month" do
        timesheet_entry1 = create(:timesheet_entry, user:, project:, duration: 700, work_date: beginning_of_month)
        timesheet_entry2 = create(:timesheet_entry, user:, project:, duration: 800, work_date: end_of_month)
        timesheet_entry3 = create(:timesheet_entry, user:, project:, duration: 900, work_date: previous_month)

        # timesheet_entry3 is excluded since it belongs to a month before
        total_duration = timesheet_entry1.duration + timesheet_entry2.duration
        expect(project.total_hours_logged(time_frame)).to eq(total_duration)
      end
    end

    context "when time_frame is year" do
      let(:time_frame) { "year" }
      let(:beginning_of_year) { Date.today.beginning_of_year + 2.days }
      let(:end_of_year) { Date.today.end_of_year - 1.day }
      let(:two_years_back) { Date.today - 2.years }

      it "returns total duration for timesheet entries in a month" do
        timesheet_entry1 = create(:timesheet_entry, user:, project:, duration: 100, work_date: beginning_of_year)
        timesheet_entry2 = create(:timesheet_entry, user:, project:, duration: 400, work_date: end_of_year)
        timesheet_entry3 = create(:timesheet_entry, user:, project:, duration: 200, work_date: two_years_back)
        # timesheet_entry3 is excluded since it's 2 years old
        total_duration = timesheet_entry1.duration + timesheet_entry2.duration
        expect(project.total_hours_logged(time_frame)).to eq(total_duration)
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
  end
end
