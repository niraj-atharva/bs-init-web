/* eslint-disable @typescript-eslint/no-var-requires */
import React from "react";

import { Link } from "react-router-dom";

import { Paths } from "constants/index";

const brandLogo = require("../../../../../assets/images/brand/ac-logo.svg");

const Header = ({ selectedTab }) => (
  <div className="fixed top-0 left-0 right-0 z-50 flex h-12 items-center bg-white px-4 shadow-lg">
    <Link className="flex items-center justify-center" to={Paths.SPACES}>
      <img alt="ac-logo" className="h-10 w-12" src={brandLogo} />
    </Link>
    <span className="w-full pr-12 text-center text-base font-bold leading-5 text-miru-han-purple-1000">
      {selectedTab}
    </span>
  </div>
);

export default Header;
