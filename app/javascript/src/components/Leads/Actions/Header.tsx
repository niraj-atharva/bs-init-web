import * as React from "react";

import { ArrowLeft, Funnel } from "phosphor-react";
import { useNavigate } from "react-router-dom";

const Header = ({
  setFilterVisibilty,
  isFilterVisible,
  filterCounter
}) => {

  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate("/leads");
  };

  return (
    <>
      <div className="my-6">
        <div className="flex min-w-0 items-center justify-between">
          <div className="flex items-center">
            <button className="button-icon__back" onClick={handleBackButtonClick}>
              <ArrowLeft size={20} className="text-col-han-app-1000" weight="bold" />
            </button>
            <h2 className="text-3xl mr-6 font-extrabold text-gray-900 sm:text-4xl sm:truncate py-1">Actions</h2>
            <button className="ml-7 p-3 rounded hover:bg-miru-gray-1000 relative" onClick={() => { setFilterVisibilty(!isFilterVisible); }}>
              <Funnel size={16} color="#7C5DEE" />
              {filterCounter > 0 && <sup className="filter__counter">{filterCounter}</sup>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
