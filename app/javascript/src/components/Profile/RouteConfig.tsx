import React from "react";

import { Routes, Route } from "react-router-dom";

// import BankAccountDetails from "./BankAccountDetails";
import Billing from "./Organization/Billing";
import OrgEdit from "./Organization/Edit";
import Import from "./Organization/Import";
import PaymentSettings from "./Organization/Payment";
import TeamMemberDetails from "./TeamMemberDetail";
import UserDetails from "./UserDetail";

const RouteConfig = ({ isAdmin, isTeamLead, userDetails }) => (
  <Routes>
    <Route path="/edit">
      {/* <Route path="bank_account_details" element={<BankAccountDetails />} /> TODO: Temporary disabling*/}
      <Route element={<UserDetails />} path="" />
      {
        (isAdmin || isTeamLead) && <Route element={<TeamMemberDetails userId={userDetails.id} />} path="team-members" />
      }
      <Route element={<PaymentSettings />} path="payment" />
      <Route element={<Billing />} path="billing" />
      <Route element={<OrgEdit />} path="organization" />
      <Route element={<Import />} path="import" />
      {/* </Route> */}
    </Route>
  </Routes>
);

export default RouteConfig;
