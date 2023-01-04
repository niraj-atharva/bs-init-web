import React from "react";

import { SettingIcon, SignOutIcon } from "miruIcons";
import { NavLink } from "react-router-dom";

import { activeClassName } from "./utils";

const UserActions = () => (
  <ul className="mt-auto lg:mt-32">
    <li className="items-center justify-center hover:bg-miru-gray-100 lg:justify-start">
      <NavLink
        to="/profile/edit"
        className={({ isActive }) =>
          isActive
            ? activeClassName
            : "flex items-center justify-center py-3 px-2 hover:bg-miru-gray-100 lg:justify-start lg:px-6"
        }
      >
        <SettingIcon size={26} />
        <span className="hide-on-sidebar ml-0 md:ml-4">Settings</span>
      </NavLink>
    </li>
    <a data-method="delete" href="/users/sign_out" rel="nofollow">
      <li className="flex items-center justify-center py-3 px-2 hover:bg-miru-gray-100 lg:justify-start lg:px-6">
        <SignOutIcon size={26} />
        <span className="hide-on-sidebar ml-0 md:ml-4">Logout</span>
      </li>
    </a>
  </ul>
);

export default UserActions;
