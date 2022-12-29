import React from "react";

import { X, FloppyDisk, ArrowLeft } from "phosphor-react";
import { useNavigate } from "react-router-dom";

const Header = ({
  submitLeadForm,
  resetLeadForm,
}) => {

  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate("/leads");
  };

  return (
    <div className="my-6">
      <div className="flex min-w-0 items-center justify-between">
        <div className="flex items-center">
          <button className="button-icon__back" onClick={handleBackButtonClick}>
            <ArrowLeft size={20} className="text-col-han-app-1000" weight="bold" />
          </button>
          <h2 className="text-3xl mr-6 font-extrabold text-gray-900 sm:text-4xl sm:truncate py-1">
              New Lead
          </h2>
        </div>
        <div className="flex justify-end w-2/5">
          <button
            type="button"
            className="header__button w-1/3 p-0"
            onClick={() => { resetLeadForm(); } }
          >
            <X size={12} />
            <span className="ml-2 inline-block">CANCEL</span>
          </button>
          <button
            type="button"
            className="header__button bg-col-han-app-1000 text-white w-1/3 p-0 hover:text-white"
            onClick={() => { submitLeadForm(); } }
          >
            <FloppyDisk size={18} color="white" />
            <span className="ml-2 inline-block">SAVE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
