import React, { Fragment } from "react";

import { EditIcon, ArchiveIcon } from "miruIcons";
import { useNavigate } from "react-router-dom";

import { TeamModalType } from "constants/index";
import { useList } from "context/TeamContext";
import { useUserContext } from "context/UserContext";

const TableRow = ({ item }) => {
  const { isAdminUser, user } = useUserContext();
  const { setModalState } = useList();
  const navigate = useNavigate();

  const isAllowUser = isAdminUser || (item.status && !!user['team_lead'])
  const actionIconVisible = isAllowUser && item.role !== "owner";

  const handleAction = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    setModalState(action, item);
  };

  return (
    <tr
      className="hoverIcon border-b border-miru-gray-200 last:border-0"
      data-cy="team-table-row"
      onClick={() => {
        navigate("1");
      }}
    >
      <td className="table__data p-6 capitalize">{item.name}</td>
      <td className="table__data table__text p-6">{item.email}</td>
      <td className="table__data table__text p-6 capitalize">{item.role}</td>
      <td className="table__data table__text p-6 capitalize">{item.department && item.department.name}</td>
      <td className="table__data table__text text-center">
        {item.teamLead && <span style={{ fontSize: "150%", fontWeight: "bold", color: "green" }}>&#10004;</span>}
      </td>
      {isAllowUser && (
        <Fragment>
          <td className="w-48 py-6 pr-6 text-right">
            {item.status && (
              <span className="table__pending">Pending Invitation</span>
            )}
          </td>
          <td className="w-44 py-6 pr-6 text-right">
            {actionIconVisible && (
              <div className="iconWrapper invisible">
                <button
                  className="ml-12"
                  data-cy="edit-team-member-button"
                  onClick={e => handleAction(e, TeamModalType.ADD_EDIT)}
                >
                  <EditIcon className="text-col-han-app-1000" size={16} weight="bold" />
                </button>
                <button
                  className="ml-12"
                  data-cy="delete-team-member-button"
                  onClick={e => handleAction(e, TeamModalType.DELETE)}
                >
                  <ArchiveIcon className="text-col-han-app-1000" size={16} weight="bold" />
                </button>
              </div>
            )}
          </td>
        </Fragment>
      )}
    </tr>
  );
};

export default TableRow;
