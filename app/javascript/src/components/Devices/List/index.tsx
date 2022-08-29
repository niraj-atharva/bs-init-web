import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { setAuthHeaders, registerIntercepts } from "apis/axios";
import devices from "apis/devices";
import Pagination from "common/Pagination";
import Table from "common/Table";
import FilterSideBar from "./FilterSideBar";
import Header from "./Header";

import { TOASTER_DURATION } from "../../../constants/index";

const Devices = ({ isAdminUser }) => {
  const [isFilterVisible, setFilterVisibilty] = React.useState<boolean>(false);
  const [rememberFilter, setRememberFilter] = useCookies();
  const [deviceData, setDeviceData] = useState<any>([{}]);
  const [pagy, setPagy] = React.useState<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = React.useState<any>({
    page: searchParams.get("page") || 1,
    ...(searchParams.get("q[first_name_or_last_name_or_email_cont]") && { ["q[first_name_or_last_name_or_email_cont]"]: searchParams.get("q[first_name_or_last_name_or_email_cont]") }),
    ...(searchParams.get("engagements") && { engagements: searchParams.get("engagements") }),
    ...(searchParams.get("departments") && { departments: searchParams.get("departments") })
  });
  const queryParams = () => new URLSearchParams(params).toString();

  const fetchDevices = () => {
    devices.get(queryParams())
      .then((res) => {
        setDeviceData(res.data.devices);
        setPagy(res.data.pagy);
      });
  };

  useEffect(() => {
    fetchDevices();
    setSearchParams(params);
  }, [params.page]);

  useEffect(() => {
    setSearchParams(params);
  }, [params])

  useEffect(() => {
    setAuthHeaders();
    registerIntercepts();
    fetchDevices();
  }, []);

  const tableHeader = [
    {
      Header: "Employee",
      accessor: "col1", // accessor is the "key" in the data
      cssClass: ""
    },
    {
      Header: "Name",
      accessor: "col2", // accessor is the "key" in the data
      cssClass: ""
    },
    {
      Header: "Type",
      accessor: "col3",
      cssClass: "text-center"
    },
    {
      Header: "Serial Number",
      accessor: "col4",
      cssClass: "text-left"
    },
    {
      Header: "Specifications",
      accessor: "col5",
      cssClass: "text-left"
    },
    {
      Header: "Brand",
      accessor: "col6",
      cssClass: ""
    },
    {
      Header: "Manufacturer",
      accessor: "col7",
      cssClass: ""
    },
    {
      Header: "OS",
      accessor: "col8",
      cssClass: ""
    },
    {
      Header: "Version",
      accessor: "col9",
      cssClass: ""
    },
    {
      Header: "Available",
      accessor: "col10",
      cssClass: ""
    },
    {
      Header: "Assignee",
      accessor: "col11",
      cssClass: ""
    },
  ];

  const getTableData = (devices: any) => {
    if (!devices) return [{}];
    return devices.map((device: any) =>
      ({
        col1: <div className="text-xs tracking-widest">{device.userName}</div>,
        col2: <div className="text-xs tracking-widest">{device.name}</div>,
        col3: <div className="text-xs tracking-widest">{device.deviceType?.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</div>,
        col4: <div className="text-xs tracking-widest">{device.serialNumber}</div>,
        col5: <div className="text-xs tracking-widest">{device.specifications && Object.entries(device.specifications)?.map(([key, val]: any) => <div key={key + val}><span>{key.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}:</span><span>{val}</span></div>)}</div>,
        col6: <div className="text-xs tracking-widest">{device.brand}</div>,
        col7: <div className="text-xs tracking-widest">{device.manufacturer}</div>,
        col8: <div className="text-xs tracking-widest">{device.baseOs}</div>,
        col9: <div className="text-xs tracking-widest">{device.version}</div>,
        col10: <div className="text-xs tracking-widest">{device.available}</div>,
        col11: <div className="text-xs tracking-widest">{device.assigneeName}</div>,
        rowId: device.id
      })
    );
  };

  return (
    <>
      <ToastContainer autoClose={TOASTER_DURATION} />
      <Header
        setFilterVisibilty={setFilterVisibilty}
        setDeviceData={setDeviceData}
        setPagy={setPagy}
        params={params}
        setParams={setParams}
      />
      <div>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                {deviceData && <Table
                  hasRowIcons={isAdminUser}
                  tableHeader={tableHeader}
                  tableRowArray={getTableData(deviceData)}
                  hasDeleteAction={false}
                  hasEditAction={false}
                />}
                {deviceData && deviceData.length && (
                  <Pagination pagy={pagy} params={params} setParams={setParams} forPage="devices" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isFilterVisible && (
        <FilterSideBar setDeviceData={setDeviceData} setFilterVisibilty={setFilterVisibilty} rememberFilter={rememberFilter} setRememberFilter={setRememberFilter} setPagy={setPagy} params={params} setParams={setParams} />
      )}
    </>
  );
};

export default Devices;