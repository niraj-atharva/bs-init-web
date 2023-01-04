import React from "react";

import { getAdminOptions, getEmployeeOptions } from "./utils";

const Options = ({ isAdminUser, permissions }) => (
  <ul className="mt-8">
    {isAdminUser ? getAdminOptions(permissions) : getEmployeeOptions(permissions)}
  </ul>
);
export default Options;
