/* eslint-disable @typescript-eslint/no-var-requires */
import React from "react";

import { Link } from "react-router-dom";

import { Paths } from "constants/index";

import "./style.scss";

const brandLogo = require("../../../../assets/images/brand/ac-logo.svg");

const Header = ({setCollapsedSidebar, collapsedSidebar}) => (
  <div className="flex h-20 items-center justify-center bg-miru-gray-100 relative">
    <Link to={Paths.SPACES}>
      <img className="h-4" alt="ac-logo" src={brandLogo} />
    </Link>
    <div className="toggle-menu bg-miru-han-purple-1000" onClick={() => setCollapsedSidebar(!collapsedSidebar) }>
      {collapsedSidebar ? '>' : '<'}
    </div>
  </div>
);

export default Header;
