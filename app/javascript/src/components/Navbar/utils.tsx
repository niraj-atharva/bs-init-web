import React from "react";

import {
  TimeTrackingIcon,
  ClientsIcon,
  ProjectsIcon,
  ReportsIcon,
  InvoicesIcon,
  PaymentsIcon,
  SpaceIcon,
  TackleIcon,
  LeadIcon,
  EngagementIcon,
  RecruitmentIcon,
  TeamsIcon,
} from "miruIcons";
import { NavLink } from "react-router-dom";

import { Paths } from "constants/index";

export const navEmployeeOptions = [
  {
    logo: <SpaceIcon size={26} />,
    label: "Spaces",
    dataCy: "spaces-tab",
    path: Paths.SPACES,
  },
  {
    logo: <TackleIcon size={26} />,
    label: "TackLe",
    dataCy: "devices-tab",
    path: Paths.DEVICES,
  },
  {
    logo: <LeadIcon size={26} />,
    label: "Leads",
    dataCy: "leads-tab",
    path: Paths.LEADS,
    permissionId: "leads",
  },
  {
    logo: <RecruitmentIcon size={26} />,
    label: "Recruitment",
    dataCy: "recruitment-tab",
    path: Paths.RECRUITMENT,
    permissionId: "recruitment",
  },
  {
    logo: <EngagementIcon size={26} />,
    label: "Engagements",
    dataCy: "engagements-tab",
    path: Paths.ENGAGEMENTS_DASHBOARD,
    permissionId: "engagementsDashboard",
  },
  {
    logo: <EngagementIcon size={26} />,
    label: "Engagements",
    dataCy: "engagements-tab",
    path: Paths.ENGAGEMENTS,
    permissionId: "engagements",
  },
  {
    logo: <TimeTrackingIcon size={26} />,
    label: "Time Tracking",
    dataCy: "time-tracking-tab",
    path: Paths.TIME_TRACKING,
  },
  {
    logo: <TeamsIcon size={26} />,
    label: "Team",
    dataCy: "team-tab",
    path: Paths.TEAM,
  },
  {
    logo: <ProjectsIcon size={26} />,
    label: "Projects",
    dataCy: "projects-tab",
    path: Paths.PROJECTS,
  },
];

export const navAdminOptions = [
  ...navEmployeeOptions,
  {
    logo: <ClientsIcon size={26} />,
    label: "Clients",
    dataCy: "clients-tab",
    path: Paths.CLIENTS,
  },
  {
    logo: <InvoicesIcon size={26} />,
    label: "Invoices",
    dataCy: "invoices-tab",
    path: Paths.INVOICES,
  },
  {
    logo: <ReportsIcon size={26} />,
    label: "Reports",
    dataCy: "reports-tab",
    path: Paths.REPORTS,
  },
  {
    logo: <PaymentsIcon size={26} />,
    label: "Payments",
    dataCy: "payments-tab",
    path: Paths.PAYMENTS,
  },
];

export const activeClassName =
  "py-3 px-2 md:px-4 flex items-center justify-center md:justify-start text-miru-han-purple-1000 bg-miru-gray-100  border-l-0 md:border-l-8 border-miru-han-purple-1000 font-extrabold";
export const mobileActiveClassName =
  "flex flex-col items-center justify-center text-miru-han-purple-1000 font-bold text-xs";

export const ListOption = ({ option }) => (
  <li className="items-center hover:bg-miru-gray-100">
    <NavLink
      data-cy={option.dataCy}
      to={option.path}
      className={({ isActive }) =>
        isActive
          ? activeClassName
          : "flex items-center justify-center py-3 px-2 hover:bg-miru-gray-100 md:justify-start md:px-6"
      }
    >
      {option.logo}
      <span className="hide-on-sidebar ml-0 md:ml-4">{option.label}</span>
    </NavLink>
  </li>
);

export const MobileListOption = ({ option, setSelectedTab }) => (
  <li
    className="flex items-center justify-center p-2 hover:bg-miru-gray-100"
    onClick={() => setSelectedTab(option.label)}
  >
    <NavLink
      data-cy={option.dataCy}
      to={option.path}
      className={({ isActive }) =>
        isActive
          ? mobileActiveClassName
          : "flex flex-col items-center justify-center text-xs hover:bg-miru-gray-100"
      }
    >
      {option.logo} {option.label}
    </NavLink>
  </li>
);

export const getEmployeeOptions = permissions =>
  navEmployeeOptions.map((option, index) => {
    if (option.permissionId && permissions[option.permissionId] === false) {
      return;
    }

    if (option.label === "Engagements" && permissions.engagementsDashboard) {
      return option.permissionId === "engagementsDashboard" ? (
        <ListOption key={index} option={option} />
      ) : null;
    } else if (option.label === "Engagements") {
      return option.permissionId !== "engagementsDashboard" ? (
        <ListOption key={index} option={option} />
      ) : null;
    }

    return <ListOption key={index} option={option} />;
  });

export const getAdminOptions = permissions =>
  navAdminOptions.map((option, index) => {
    if (option.permissionId && permissions[option.permissionId] === false) {
      return;
    }

    if (option.label === "Engagements" && permissions.engagementsDashboard) {
      return option.permissionId === "engagementsDashboard" ? (
        <ListOption key={index} option={option} />
      ) : null;
    } else if (option.label === "Engagements") {
      return option.permissionId !== "engagementsDashboard" ? (
        <ListOption key={index} option={option} />
      ) : null;
    }

    return <ListOption key={index} option={option} />;
  });

export const MobileMenuOptions = ({
  isAdminUser,
  setSelectedTab,
  from,
  to,
}) => {
  if (isAdminUser) {
    return (
      <>
        {navAdminOptions.slice(from, to).map((option, index) => (
          <MobileListOption
            key={index}
            option={option}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </>
    );
  }

  return (
    <>
      {navEmployeeOptions.slice(from, to).map((option, index) => (
        <MobileListOption
          key={index}
          option={option}
          setSelectedTab={setSelectedTab}
        />
      ))}
    </>
  );
};
