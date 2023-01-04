/* eslint-disable no-unused-vars */
import React from "react";

const SelectProject = ({
  setClient,
  clientName,
  projects,
  project,
  setProject,
  projectName,
  projectId,
  setProjectId,
  setProjectSelected,
  newRowView,
  setNewRowView,
  handleEditEntries,
  isWeeklyEditing, // eslint-disable-line
  setIsWeeklyEditing,
}: Iprops) => {
  const handleCancelButton = () => {
    if (newRowView) {
      setNewRowView(false);
    } else {
      setProjectSelected(true);
      setClient(clientName);
      setProject(projectName);
    }
    setIsWeeklyEditing(false);
  };

  const handleSaveButton = () => {
    if (project) {
      setProjectSelected(true);
      setProjectId();
      if (!newRowView) handleEditEntries();
    }
  };

  return (
    <div className="flex content-center justify-between rounded-md p-4 shadow-2xl">
      {/* Clients */}
      {/* <select
        onChange={handleClientChange}
        value={client || "Client"}
        name="client"
        id="client"
        name="client"
        value={client || "Client"}
        onChange={handleClientChange}
      >
        {!client && (
          <option disabled selected className="text-miru-gray-100">
            Client
          </option>
        )}
        {clients.map((c, i) => (
          <option key={i.toString()}>{c["name"]}</option>
        ))}
      </select> */}
      {/* Projects */}
      <select
        className="h-8 w-80 rounded-sm bg-miru-gray-100"
        id="project"
        name="project"
        value={projectId}
        onChange={e => {
          setProject(projects.find((i) => parseInt(e.target.value) === i.id).name);
          setProjectId();
        }}
      >
        <option value={null} key={"none"} className="text-miru-gray-100">
          Select Project
        </option>
        {projects.map((project) => (
          <option value={project.id} key={project.id}>
            {project.name} ({project.clientName})
          </option>
        ))}
      </select>
      <button
        className="h-8 w-38 rounded border border-miru-han-purple-1000 bg-transparent py-1 px-6 text-xs font-bold tracking-widest text-miru-han-purple-600 hover:border-transparent hover:bg-miru-han-purple-1000 hover:text-white"
        onClick={handleCancelButton}
      >
        CANCEL
      </button>
      <button
        className={`h-8 w-38 rounded border py-1 px-6 text-xs font-bold tracking-widest text-white ${
          project
            ? "bg-miru-han-purple-1000 hover:border-transparent"
            : "bg-miru-gray-1000"
        }`}
        onClick={handleSaveButton}
      >
        SAVE
      </button>
    </div>
  );
};

interface Iprops {
  setClient: (client: string) => void;
  clientName: string;
  projects: any[];
  project: string;
  setProject: (project: string) => void;
  projectName: string;
  projectId: number;
  setProjectId: () => void;
  setProjectSelected: (projectSelected: boolean) => void;
  newRowView: boolean;
  setNewRowView: (newRowView: boolean) => void;
  handleEditEntries: () => void;
  isWeeklyEditing: boolean;
  setIsWeeklyEditing: (isWeeklyEditing: boolean) => void;
}

export default SelectProject;
