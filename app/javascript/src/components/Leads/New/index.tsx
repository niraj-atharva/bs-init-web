import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Header from "./Header";

import { TOASTER_DURATION } from "../../../constants/index";
import Summary from "../Details/Summary";

const NewLead = () => {
  const [leadDetails, setLeadDetails] = useState<any>({});
  const [formRef, setFormRef]  = useState<any>(React.createRef());

  const navigate = useNavigate();

  const submitLeadForm = () => {
    formRef.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    )
  };

  const resetLeadForm = () => {
    if (confirm("Are you sure you want to cancel? all inserted data will be lost."))
      navigate("/leads");
  };
  const activeClassName = "mr-10 text-base tracking-widest font-bold text-miru-han-purple-1000 border-b-2 border-miru-han-purple-1000";

  return (
    <React.Fragment>
      <ToastContainer autoClose={TOASTER_DURATION} />
      <Header submitLeadForm={submitLeadForm} resetLeadForm={resetLeadForm} />
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          <li className="mr-3">
            <button className={activeClassName} >
              SUMMARY
            </button>
          </li>
        </ul>
      </div>
      <Summary
        leadDetails={leadDetails}
        setLeadDetails={setLeadDetails}
        isEdit={true}
        setFormRef={setFormRef}
      />
    </React.Fragment>
  );
};

export default NewLead;
