# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Team#index", type: :request do
  let(:company) { create(:company) }
  let(:user) { create(:user, current_workspace_id: company.id) }

  context "when user is an admin" do
    before do
      create(:company_user, company:, user:)
      user.add_role :admin, company
      sign_in user
      send_request :get, team_index_path
    end

    it "they should be able to visit team page successfully" do
      expect(response).to be_successful
    end
  end

  context "when user is an employee" do
    before do
      create(:company_user, company:, user:)
      user.add_role :employee, company
      sign_in user
      send_request :get, team_index_path
    end

    it "they should be able to visit team page successfully" do
      expect(response).to be_successful
    end
  end

  context "when the user is an book keeper" do
    before do
      create(:company_user, company:, user:)
      user.add_role :book_keeper, company
      sign_in user
      send_request :get, team_index_path
    end

    it "they should not be permitted to visit index page" do
      expect(response).to have_http_status(:redirect)
      expect(flash["alert"]).to eq("You are not authorized to perform this action.")
    end
  end

  context "when unauthenticated" do
    it "user will be redirects to sign in path" do
      send_request :get, team_index_path
      expect(response).to redirect_to(user_session_path)
      expect(flash[:alert]).to eq("You need to sign in or sign up before continuing.")
    end
  end
end
