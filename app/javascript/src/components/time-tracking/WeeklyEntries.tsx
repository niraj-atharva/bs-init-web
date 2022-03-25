import * as React from "react";
import timesheetEntryApi from "apis/timesheet-entry";
import Toastr from "common/Toastr";
import Logger from "js-logger";
import SelectProject from "./SelectProject";
import WeeklyEntriesCard from "./WeeklyEntriesCard";

const { useState, useEffect } = React;

const WeeklyEntries: React.FC<Props> = ({
  clients,
  projects,
  newRowView,
  setNewRowView,
  projectId,
  clientName,
  projectName,
  entries,
  setEntryList,
  dayInfo,
  isWeeklyEditing,
  setIsWeeklyEditing
}) => {
  const [client, setClient] = useState("");
  const [project, setProject] = useState("");
  const [projectSelected, setProjectSelected] = useState(false);
  const [currentEntries, setCurrentEntries] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(-1);

  const setProjectId = () => {
    const pid = projects[client].find(p => p.name === project).id;
    setCurrentProjectId(pid);
    return pid;
  };

  const getIds = () => {
    const ids = [];
    currentEntries.forEach(entry => {
      if (entry) ids.push(entry["id"]);
    });
    return ids;
  };

  const handleEditEntries = async () => {
    try {
      const ids = getIds();
      const res = await timesheetEntryApi.updateBulk({
        project_id: setProjectId(),
        ids: ids
      });
      if (res.status === 200) {
        setEntryList(prevState => {
          const newState = { ...prevState, ...res.data.entries };
          return newState;
        });
      }
    } catch (error) {
      Toastr.error(error.message);
    }
  };

  const handleDeleteEntries = async () => {
    try {
      const ids = getIds();
      const res = await timesheetEntryApi.destroyBulk({ ids: ids });
      if (res.status === 200) {
        setEntryList(prevState => {
          const newState : any = { ...prevState };
          dayInfo.forEach(({ fullDate }, index) => {
            if ((! newState[fullDate]) || (! currentEntries[index])) return;
            newState[fullDate] = newState[fullDate].filter(entry => entry.id !== currentEntries[index]["id"]);
          });
          return newState;
        });
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  const handleSetData = () => {
    if (projectId) {
      setCurrentProjectId(projectId);
      setProject(projectName);
      setClient(clientName);
      setProjectSelected(true);
      setCurrentEntries(entries);
    }
  };

  useEffect(() => {
    handleSetData();
  }, []);

  return projectSelected ?
    <WeeklyEntriesCard
      client={client}
      project={project}
      currentEntries={currentEntries}
      setCurrentEntries={setCurrentEntries}
      currentProjectId={currentProjectId}
      setProjectSelected={setProjectSelected}
      projectSelected={projectSelected}
      newRowView={newRowView}
      setNewRowView={setNewRowView}
      setEntryList={setEntryList}
      handleDeleteEntries={handleDeleteEntries}
      handleEditEntries={handleEditEntries}
      dayInfo={dayInfo}
      isWeeklyEditing={isWeeklyEditing}
      setIsWeeklyEditing={setIsWeeklyEditing}
    />
    : <SelectProject
      clients={clients}
      client={client}
      setClient={setClient}
      clientName={clientName}
      projects={projects}
      project={project}
      setProject={setProject}
      projectName={projectName}
      projectId={projectId}
      setProjectId={setProjectId}
      projectSelected={projectSelected}
      setProjectSelected={setProjectSelected}
      newRowView={newRowView}
      setNewRowView={setNewRowView}
      handleEditEntries={handleEditEntries}
      isWeeklyEditing={isWeeklyEditing}
      setIsWeeklyEditing={setIsWeeklyEditing}
    />;
};

interface Props {
  clients: [];
  projects: object;
  newRowView: boolean;
  setNewRowView: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: number;
  clientName: string;
  projectName: string;
  entries: [];
  setEntryList: React.Dispatch<React.SetStateAction<[]>>;
  dayInfo: Array<any>;
  isWeeklyEditing: boolean;
  setIsWeeklyEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default WeeklyEntries;
