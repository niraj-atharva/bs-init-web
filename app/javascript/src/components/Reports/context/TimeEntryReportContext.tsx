const TimeEntryReportContext = {
  reports: [],
  selectedFilter: {
    dateRange: { label: "All", value: "" },
    clients: [],
    teamMember: [],
    status: [],
    groupBy: { label: "None", value: "" },
    customDateFilter: {
      from: "",
      to: "",
    },
  },
  filterOptions: {
    clients: [],
    teamMembers: [],
  },
  filterCounter: 0,
  handleRemoveSingleFilter: (key, value) => {}, //eslint-disable-line
};

export default TimeEntryReportContext;
