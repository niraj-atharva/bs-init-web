import dayjs from "dayjs";

import { month, getDayWithSuffix } from "../../../../utils/dateUtil";

const getWeek = (isCurrentWeek) => {
  const currentDate = new Date();

  const first = currentDate.getDate() - currentDate.getDay();
  const weekFirstDay = isCurrentWeek ? first : first - 7;
  const last = weekFirstDay + 7;

  const firstday = dayjs(new Date(currentDate.setDate(weekFirstDay)));
  // currentDate wont have current date after the above step
  const lastday = dayjs(new Date(new Date().setDate(last)));
  const completeCurrentDay = `${getDayWithSuffix(firstday.date())} ${month[firstday.month()]}`;
  const completeLastWeekDay = `${getDayWithSuffix(lastday.date())} ${month[lastday.month()]}`;
  return isCurrentWeek ? `This Week (${completeCurrentDay} - ${completeLastWeekDay})` :
    `Last Week (${completeCurrentDay} - ${completeLastWeekDay})`;
};

const getMonth = (isCurrentMonth) => {
  const currentDate = new Date();

  const monthCount = isCurrentMonth ? dayjs(currentDate) : dayjs(currentDate).subtract(1, "month");
  const monthStr = month[monthCount.month()];
  const totalDaysOfCurrentMonth = dayjs(monthCount).daysInMonth();
  const lastdayOfMonth = totalDaysOfCurrentMonth === 30 ? `${totalDaysOfCurrentMonth}th` : `${totalDaysOfCurrentMonth}st`;

  return isCurrentMonth ? `This Month (1st ${monthStr} - ${lastdayOfMonth} ${monthStr})` :
    `Last Month (1st ${monthStr} - ${lastdayOfMonth} ${monthStr})`;
};

const getDate = (isCurrentDay) => {
  const today = new Date();
  const tomorrow =  new Date()
  tomorrow.setDate(today.getDate() + 1)

  return isCurrentDay ? `Today (${today.toLocaleDateString()})` :
    `Tomorrow (${tomorrow.toLocaleDateString()})`;
};

const getDateRangeOptions = () => {
  const today = getDate(true);
  const tomorrow = getDate(false);
  const thisWeek = getWeek(true);
  const thisMonth = getMonth(true);
  const previousMonth = getMonth(false);
  const previousweek = getWeek(false);

  return [
    { value: "today", label: today },
    { value: "tomorrow", label: tomorrow },
    { value: "this_week", label: thisWeek },
    { value: "last_week", label: previousweek },
    { value: "this_month", label: thisMonth },
    { value: "last_month", label: previousMonth },
    { value: "custom", label: "Custom" }
  ];
};

const dateRangeOptions = [
  ...getDateRangeOptions()
];

export {
  dateRangeOptions,
  getMonth,
  getDate
};
