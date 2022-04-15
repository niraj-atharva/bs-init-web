# frozen_string_literal: true

class InternalApi::V1::ProjectsController < InternalApi::V1::ApplicationController
  def index
    authorize Project
    # project_details = current_company.project_list_after_filter((params[:from]), (params[:client_filter]), (params[:user_filter]))
    render :index, locals: { projects: }, status: :ok
  end

  def show
    authorize Project
    render :show, locals: { project: }, status: :ok
  end

  def create
    authorize Project
    render :create, locals: {
      project: Project.create!(project_params)
    }
  end

  def update
    authorize project
    project.update!(project_params)
    render :update, locals: {
      project:
    }
  end

  def destroy
    authorize project
    project.discard!
  end

  private

    def projects
      @_projects ||= current_company.projects.kept
    end

    def project
      @_project ||= Project.includes(:project_members, project_members: [:user]).find(params[:id])
    end

    def project_params
      params.require(:project).permit(
        policy(Project).permitted_attributes
      )
    end
end
