import React, { useState } from "react";

import Header from "./Header";
import Options from "./Options";
import UserActions from "./UserActions";
import UserInfo from "./UserInfo";

const Navbar = ({ isAdminUser, user, permissions }) => {
  const [collapsedSidebar, setCollapsedSidebar] = useState<boolean>(true);

  return (
    <div className={`sidebar fixed top-0 bottom-0 left-0 flex h-full w-1/6 flex-col justify-between shadow-2xl ${collapsedSidebar ? 'collapse-sidebar' : null}`}>
      <Header collapsedSidebar={collapsedSidebar} setCollapsedSidebar={setCollapsedSidebar} />
      <div className="ac-calendar-container overflow-y-auto">
        <Options isAdminUser={isAdminUser} permissions={permissions} />
      </div>
      <UserActions />
      <UserInfo user={user} />
    </div>
  )
};

export default Navbar;
