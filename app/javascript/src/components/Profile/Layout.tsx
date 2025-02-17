import React, { useState } from "react";

import { ToastContainer } from "react-toastify";

import { TOASTER_DURATION } from "constants/index";

import EntryContext from "./context/EntryContext";
import RouteConfig from "./RouteConfig";
import SideNav from "./SubNav";

const Layout = ({ isAdminUser, user, company }) => {
  const [settingsStates, setSettingsStates] = useState({
    profileSettings: {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    },
    organizationSettings: {},
    bankAccDetails: {},
    paymentSettings: {},
    billing: {},
  });

  const setUserState = (key, value) => {
    setSettingsStates({
      ...settingsStates,
      ...{ [key]: { ...settingsStates[key], ...value } },
    });
  };

  return (
    <EntryContext.Provider
      value={{
        ...settingsStates,
        setUserState,
      }}
    >
      <div className="mt-6 mb-3 sm:flex sm:items-center sm:justify-between">
        <h2 className="header__title">Settings</h2>
      </div>
      <div className="mt-5 mb-10 flex">
        <SideNav
          company={company}
          email={settingsStates.profileSettings?.email}
          firstName={settingsStates.profileSettings?.firstName}
          isAdmin={isAdminUser}
          isTeamLead={!!user.team_lead}
          lastName={settingsStates.profileSettings?.lastName}
        />
        <RouteConfig isAdmin={isAdminUser} isTeamLead={!!user.team_lead} userDetails={user} />
      </div>
      <ToastContainer autoClose={TOASTER_DURATION} />
    </EntryContext.Provider>
  );
};

export default Layout;
