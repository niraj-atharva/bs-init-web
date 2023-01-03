import dayjs from "dayjs";

import { customDateFilter } from "../../../Reports/revenueByClient/Filters/filterOptions";

const isValuePresent = (filterValue) => filterValue.value && filterValue.value !== "";
const isNotEmptyArray = (value) => value && value.length > 0;

const apiKeys = {
  dateRange: "date_range",
};

export const getQueryParams = (selectedFilter) => {
  const filterParams = {};
  for (const filterKey in selectedFilter) {
    const filterValue = selectedFilter[filterKey];

    if (filterKey === customDateFilter && filterValue.from !== "" && filterValue.to !== "") {
      filterParams["from"] = `${dayjs(filterValue.from).format("DD/MM/YYYY")}`;
      filterParams["to"] = `${dayjs(filterValue.to).format("DD/MM/YYYY")}`;
    }
    if (Array.isArray(filterValue) && isNotEmptyArray(filterValue)) {
      filterValue.forEach(item => {
        filterParams[`${apiKeys[filterKey]}`]=`[${item.value}]`;
      });
    }
    if (!Array.isArray(filterValue) && isValuePresent(filterValue)) {
      filterParams[`${apiKeys[filterKey]}`]=`${filterValue.value}`;
    }
  }
  return filterParams;
};

const applyFilter = async (selectedFilter, params, setParams, setFilterVisibilty) => {
  const queryParams = getQueryParams(selectedFilter);
  setParams({ ...params, ...queryParams })
  // setNavFilters(true);
  setFilterVisibilty(false);
};

export default applyFilter;
