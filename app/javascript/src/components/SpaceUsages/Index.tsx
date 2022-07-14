/* eslint-disable no-unexpected-multiline */
import React from "react";
import { ToastContainer } from "react-toastify";
import { setAuthHeaders, registerIntercepts } from "apis/axios";
import spaceUsagesApi from "apis/space-usages";
import * as dayjs from "dayjs";
import * as updateLocale from "dayjs/plugin/updateLocale";
import * as weekday from "dayjs/plugin/weekday";

// import { minutesToHHMM } from "helpers/hhmm-parser";
import _ from "lodash";
import { TOASTER_DURATION } from "constants/index";

import AddEntry from "./AddEntry";
import DatesInWeek from "./DatesInWeek";
// import EntryCard from "./EntryCard";
import EntryCardDayView from "./EntryCardDayView";
// import MonthCalender from "./MonthCalender";
// import WeeklyEntries from "./WeeklyEntries";

const { useState, useEffect } = React;
dayjs.extend(updateLocale);
dayjs.extend(weekday);

const monthsAbbr = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_");
dayjs.updateLocale("en", { monthShort: monthsAbbr });

// Day start from monday
dayjs.Ls.en.weekStart = 1;

const TimeReserving: React.FC<Iprops> = ({
  entries,
  // isAdmin,
  userId,
  // employees
}) => {
  const [dayInfo, setDayInfo] = useState<any[]>([]);
  // const [view, setView] = useState<string>("day");
  const [newEntryView, setNewEntryView] = useState<boolean>(false);
  // const [newRowView, setNewRowView] = useState<boolean>(false);
  const [selectDate, setSelectDate] = useState<number>(dayjs().weekday());
  const [weekDay, setWeekDay] = useState<number>(0);
  // const [weeklyTotalHours, setWeeklyTotalHours] = useState<string>("00:00");
  // const [dailyTotalHours, setDailyTotalHours] = useState<number[]>([]);
  const [entryList, setEntryList] = useState<object>(entries);
  // const [timeArray, setTimeArray] = useState<any>([]);
  const [selectedFullDate, setSelectedFullDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [groupingEntryList, setGroupingEntryList] = useState<object>({});
  const [editEntryId, setEditEntryId] = useState<number>(0);
  // const [weeklyData, setWeeklyData] = useState<any[]>([]);
  // const [isWeeklyEditing, setIsWeeklyEditing] = useState<boolean>(false);
  // const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(userId);
  const [allEmployeesEntries, setAllEmployeesEntries] = useState<object>({});

  useEffect(() => {
    setAuthHeaders();
    registerIntercepts();
    const currentEmployeeEntries = {};
    currentEmployeeEntries[userId] = entries;
    setAllEmployeesEntries(currentEmployeeEntries);
  }, []);

  useEffect(() => {
    handleWeekInfo();
  }, [weekDay]);

  useEffect(() => {
    parseWeeklyViewData();
    // calculateTotalHours();
  }, [weekDay, entryList]);

  // useEffect(() => {
  //   setIsWeeklyEditing(false);
  // }, [view]);

  useEffect(() => {
    setSelectedFullDate(
      dayjs()
        .weekday(weekDay + selectDate)
        .format("YYYY-MM-DD")
    );
  }, [selectDate, weekDay]);

  // useEffect(() => {
  //   if (dayInfo.length <= 0) return;

  //   fetchEntries(
  //     dayjs(dayInfo[0]["fullDate"]).startOf("month").subtract(1, "month").format("DD-MM-YYYY"),
  //     dayjs(dayInfo[0]["fullDate"]).endOf("month").add(1, "month").format("DD-MM-YYYY"),
  //   );

  //   if (allEmployeesEntries[selectedEmployeeId]) setEntryList(allEmployeesEntries[selectedEmployeeId]);
  // }, [selectedEmployeeId]);

  // const handleWeekTodayButton = () => {
  //   setSelectDate(0);
  //   setWeekDay(dayjs().weekday());
  // };

  const handleWeekInfo = () => {
    const daysInWeek = Array.from(Array(7).keys()).map((weekCounter) => {
      const [day, month, date, year] = dayjs()
        .weekday(weekCounter + weekDay)
        ["$d"].toString()
        .split(" ");
      const fullDate = dayjs()
        .weekday(weekCounter + weekDay)
        .format("YYYY-MM-DD");
      return {
        day: day,
        month: month,
        date: date,
        year: year,
        fullDate: fullDate
      };
    });
    setDayInfo(() => daysInWeek);
  };

  const fetchEntries = async (from: string, to: string) => {
    const res = await spaceUsagesApi.list(from, to, 1);
    if (res.status >= 200 && res.status < 300) {
      const ns = { ...allEmployeesEntries };
      ns[1] = { ...ns[1], ...res.data.entries };
      setAllEmployeesEntries(ns);
      setEntryList(ns[1]);
      return true;
    } else {
      return false;
    }
  };

  // const handleDeleteEntry = async id => {
  //   const res = await spaceUsagesApi.destroy(id);
  //   if (!(res.status === 200)) return;
  //   const newValue = { ...entryList };
  //   newValue[selectedFullDate] = newValue[selectedFullDate].filter(e => e.id !== id);
  //   setAllEmployeesEntries({ ...allEmployeesEntries, [1]: newValue });
  //   setEntryList(newValue);
  // };

  // const calculateTotalHours = () => {
  //   // let total = 0;
  //   // const dailyTotal = [];
  //   // for (let weekCounter = 0; weekCounter < 7; weekCounter++) {
  //   //   const day = dayjs()
  //   //     .weekday(weekCounter + weekDay)
  //   //     .format("YYYY-MM-DD");
  //   //   if (entryList[day]) {
  //   //     let dayTotal = 0;
  //   //     entryList[day].forEach(e => {
  //   //       dayTotal += e.duration;
  //   //     });
  //   //     dailyTotal.push(minutesToHHMM(dayTotal));
  //   //     total += dayTotal;
  //   //   } else {
  //   //     dailyTotal.push("00:00");
  //   //   }
  //   // }
  //   // setDailyTotalHours(dailyTotal);
  //   // setWeeklyTotalHours(minutesToHHMM(total));
  // };

  const handleNextWeek = () => {
    setWeekDay(p => p + 7);
    const from = dayjs()
      .weekday(weekDay + 7)
      .format("YYYY-MM-DD");
    const to = dayjs()
      .weekday(weekDay + 13)
      .format("YYYY-MM-DD");
    fetchEntries(from, to);
  };

  const handlePrevWeek = () => {
    setWeekDay(p => p - 7);
    const from = dayjs()
      .weekday(weekDay - 7)
      .format("YYYY-MM-DD");
    const to = dayjs()
      .weekday(weekDay - 1)
      .format("YYYY-MM-DD");
    fetchEntries(from, to);
  };

  const parseWeeklyViewData = () => {
    const weekArr = [];
    for (let weekCounter = 0; weekCounter < 7; weekCounter++) {
      const date = dayjs()
        .weekday(weekDay + weekCounter)
        .format("YYYY-MM-DD");

      if (!entryList[date]) continue;

      entryList[date].forEach(entry => {
        let entryAdded = false;
        weekArr.forEach(rowInfo => {
          if (
            rowInfo["projectId"] === entry["project_id"] &&
            !rowInfo["entries"][weekCounter] &&
            !entryAdded
          ) {
            rowInfo["entries"][weekCounter] = entry;
            entryAdded = true;
          }
          return rowInfo;
        });

        if (entryAdded) return;
        const newRow = [];
        newRow[weekCounter] = entry;
        weekArr.push({
          projectId: entry["project_id"],
          clientName: entry.client,
          projectName: entry.project,
          entries: newRow
        });
      });
    }

    // setWeeklyData(() => weekArr);
  };

  useEffect(() => {
    if (entryList[selectedFullDate]){
      setGroupingEntryList(_.groupBy(entryList[selectedFullDate], "space_name"))

      // const availableTimeArray = []
      // entryList[selectedFullDate].map((entry) =>{
      //   availableTimeArray.push(entry.start_duration)
      //   availableTimeArray.push(entry.end_duration)
      // });
      // setTimeArray(availableTimeArray.filter((item,
      //   index) => availableTimeArray.indexOf(item) === index).sort())
    }
  }, [entryList, selectedFullDate]);

  return (
    <>
      <ToastContainer autoClose={TOASTER_DURATION} />
      <div className="mx-50 mt-6">
        <div className="bg-miru-alert-yellow-400 text-miru-alert-green-1000 px-1 flex justify-center font-semibold tracking-widest rounded-lg w-auto h-auto text-xs mt-3 mb-3 p-3">
          <b><i>Yes! We need your help. Be a part of the <i className="text-xl">A∝C</i>.</i></b>
        </div>
        <div>
          <div className="mb-6">
            <div className="flex justify-between items-center bg-miru-han-purple-1000 h-10 w-full">
              <button
                onClick={() => {
                  setWeekDay(0);
                  setSelectDate(dayjs().weekday());
                }}
                className="flex items-center justify-center text-white tracking-widest border-2 rounded h-6 w-20 text-xs font-bold ml-4"
              >
              TODAY
              </button>
              <div className="flex">
                <button
                  onClick={handlePrevWeek}
                  className="text-white border-2 h-6 w-6 rounded-xl flex flex-col items-center justify-center"
                >
                  &lt;
                </button>
                {!!dayInfo.length && (
                  <p className="text-white mx-6 w-40">
                    {dayInfo[0]["date"]} {dayInfo[0].month} -{" "}
                    {dayInfo[6]["date"]} {dayInfo[6]["month"]}{" "}
                    {dayInfo[6]["year"]}
                  </p>
                )}
                <button
                  onClick={handleNextWeek}
                  className="text-white border-2 h-6 w-6 rounded-xl flex flex-col items-center justify-center"
                >
                  &gt;
                </button>
              </div>
              <div className="flex mr-12">
                {/* <p className="text-white mr-2">Total</p>
                <p className="text-white font-extrabold">{ view === "week" ? weeklyTotalHours : dailyTotalHours[selectDate] }</p> */}
              </div>
            </div>
            <DatesInWeek
              view={"day"}
              dayInfo={dayInfo}
              selectDate={selectDate}
              setSelectDate={setSelectDate}
            />
          </div>
          {!editEntryId && newEntryView && (
            <AddEntry
              selectedEmployeeId={userId}
              fetchEntries={fetchEntries}
              setNewEntryView={setNewEntryView}
              selectedDateInfo={dayInfo[selectDate]}
              selectedFullDate={selectedFullDate}
              setEntryList={setEntryList}
              entryList={entryList}
              setEditEntryId={setEditEntryId}
              editEntryId={editEntryId}
              dayInfo={dayInfo}
            />
          )}
          {!newEntryView && (
            <button
              onClick={() => {setNewEntryView(true); setEditEntryId(0); }}
              className="h-14 w-full border-2 p-4 border-miru-han-purple-600 text-miru-han-purple-600 font-bold text-lg tracking-widest"
            >
                + NEW
            </button>
          )}
        </div>

        {/* entry cards for day and month */}
        {/* {entryList[selectedFullDate] &&
          entryList[selectedFullDate].map((entry, weekCounter) =>
            editEntryId === entry.id ? (
              <AddEntry
                selectedEmployeeId={userId}
                fetchEntries={fetchEntries}
                setNewEntryView={setNewEntryView}
                selectedDateInfo={dayInfo[selectDate]}
                selectedFullDate={selectedFullDate}
                setEntryList={setEntryList}
                entryList={entryList}
                setEditEntryId={setEditEntryId}
                editEntryId={editEntryId}
                dayInfo={dayInfo}
              />
            ) : (
              <EntryCard
                key={weekCounter}
                handleDeleteEntry={handleDeleteEntry}
                setEditEntryId={setEditEntryId}
                {...entry}
              />
            )
          )} */}
        {Object.entries(groupingEntryList).length > 0 &&
          Object.entries(groupingEntryList).map(([key, value], listIndex) => (<EntryCardDayView
            key={listIndex}
            listIndex={listIndex}
            groupingKey={key}
            groupingValues={value}
          />))}
      </div>
    </>
  );
};

interface Iprops {
  clients: [];
  projects: object;
  entries: object;
  isAdmin: boolean;
  userId: number;
  employees: [];
}

export default TimeReserving;
