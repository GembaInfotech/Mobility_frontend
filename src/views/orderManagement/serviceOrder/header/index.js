import React from "react";
import { Button, DatePicker, Select, Tooltip } from "components/ui";
import { GrPowerReset } from "react-icons/gr";
import TableSearchBar from "components/ui/TableSearchBar";
import { getApi } from "services/CommonService";
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";
import { debounce, filter } from "lodash";
import AsyncSelect from "react-select/async";
import { DATE_FORMAT } from "constants/app.constant";
import moment from "moment";
import { SERVICE_ORDER_STATUS } from "../serviceConstant";
import { useNavigate } from "react-router-dom";

const FilterSection = ({
  setSearch,
  filtervalue,
  setFilterValue,
  setFilterPatientId,
  filterPatientId,
  setFilterNalId,
  filterNAlId,
  selectedDate,
  setSelectedDate,
  filterPatientDob,
  setFilterPatientDob,
  filterNad,
  setFilterNad,
}) => {
  const loadPatientsOption = (inputValue, resolve) => {
    getApi(APIS.LIST_DATA, {
      type: LIST_DATA_API_TYPE.PATIENTS,
      search: inputValue,
    }).then((result) => {
      resolve(result?.data?.data);
    });
  };

  const loadNalOption = (inputValue, resolve) => {
    getApi(APIS.LIST_DATA, {
      type: LIST_DATA_API_TYPE.LOCATIONS,
      search: inputValue,
    }).then((res) => {
      resolve(res?.data?.data);
    });
  };

  const loadNal = debounce(loadNalOption, 300);
  const loadStays = debounce(loadPatientsOption, 300);
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-3 gap-4 mb-5">
      <TableSearchBar onChange={(query) => setSearch(query)} />
      <Select
        autoComplete="off"
        size="sm"
        className="mb-4 w-30"
        placeholder="Filter by Order Status"
        options={SERVICE_ORDER_STATUS}
        value={filtervalue}
        onChange={(selectedValue) => {
          setFilterValue(selectedValue);
        }}
      />

      <Select
        autoComplete="off"
        placeholder="Filter by Patient (Name, Phone, ID)"
        defaultOptions
        cacheOptions
        size="sm"
        className="mb-4"
        value={filterPatientId}
        loadOptions={loadStays}
        componentAs={AsyncSelect}
        getOptionLabel={(v) =>
          `${v?.firstName} ${v?.lastName ? v?.lastName : ""} ${
            v?.patientNo ? `(${v?.patientNo})` : ""
          } ${v?.dob ? `(${moment(v?.dob).format(DATE_FORMAT)})` : ""}`
        }
        getOptionValue={(v) => v?._id}
        onChange={(event) => {
          setFilterPatientId(event);
        }}
      />

      <Select
        autoComplete="off"
        placeholder="Filter by NAL"
        defaultOptions
        cacheOptions
        size="sm"
        className="mb-4"
        value={filterNAlId}
        loadOptions={loadNal}
        componentAs={AsyncSelect}
        getOptionLabel={(v) =>
        `${v?.name ? `${v?.name}` : ""
          }`
        }
        getOptionValue={(v) => v?._id}
        onChange={(event) => {
          setFilterNalId(event);
        }}
      />

      <DatePicker
        inputtable
        clearable={false}
        className=""
        placeholder={`Filter by Patient DOB ${DATE_FORMAT}`}
        size="sm"
        name="patientDob"
        inputFormat={DATE_FORMAT}
        maxDate={new Date()}
        value={filterPatientDob}
        onChange={(date) =>
          setFilterPatientDob(moment(date).format(DATE_FORMAT))
        }
      />

      <DatePicker
        clearable={false}
        className=""
        placeholder="Order Start Date"
        size="sm"
        name="startDate"
        inputFormat={DATE_FORMAT}
        maxDate={
          selectedDate?.endDate ? new Date(selectedDate?.endDate) : new Date()
        }
        value={selectedDate?.startDate}
        onChange={(date) =>
          setSelectedDate({
            ...selectedDate,
            startDate: moment(date).format(DATE_FORMAT),
          })
        }
      />
      <DatePicker
        clearable={false}
        name="endDate"
        className=""
        placeholder="Order End Date"
        size="sm"
        inputFormat={DATE_FORMAT}
        minDate={
          selectedDate?.startDate ? new Date(selectedDate?.startDate) : null
        }
        maxDate={new Date()}
        value={selectedDate?.endDate}
        onChange={(date) =>
          setSelectedDate({
            ...selectedDate,
            endDate: moment(date).format(DATE_FORMAT),
          })
        }
      />
      <DatePicker
        inputtable
        clearable={false}
        className=""
        placeholder="Filter By NAD"
        size="sm"
        name="nad"
        inputFormat={DATE_FORMAT}
        value={filterNad}
        onChange={(date) => setFilterNad(moment(date).format(DATE_FORMAT))}
      />
      <Button
        size="sm"
        onClick={() => {
          setFilterPatientDob(null);
          setFilterValue("");
          setFilterPatientId("");
          setSelectedDate({ startDate: null, endDate: null });
          setFilterNad(null);
          navigate("/app/orderManagement/service-order");
        }}
        icon={<GrPowerReset />}
      >
        Reset
      </Button>
    </div>
  );
};

const Header = ({
  setSearch,
  buttonMenu,
  buttonClick,
  filtervalue,
  setFilterValue,
  setFilterPatientId,
  filterPatientId,
  selectedDate,
  setSelectedDate,
  filterPatientDob,
  setFilterPatientDob,
  filterNad,
  setFilterNad,
}) => {
  const ButtonSection = ({ buttonClick, buttonMenu }) => {
    return (
      <div className="mb-4 ">
        {buttonMenu?.map((btn, i, arr) => {
          return (
            <Button
              key={i}
              size="sm"
              variant="solid"
              onClick={(e) => buttonClick(e, btn.key)}
              style={{ marginLeft: "5px" }}
              icon={btn.icon}
            >
              {btn.label}
            </Button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="md:flex items-center justify-end">
        <ButtonSection buttonMenu={buttonMenu} buttonClick={buttonClick} />
      </div>
      <div className="items-center lg:flex">
        <FilterSection
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setFilterPatientDob={setFilterPatientDob}
          filterPatientDob={filterPatientDob}
          setSearch={setSearch}
          setFilterValue={setFilterValue}
          filtervalue={filtervalue}
          setFilterPatientId={setFilterPatientId}
          filterPatientId={filterPatientId}
          setFilterNad={setFilterNad}
          filterNad={filterNad}
        />
      </div>
    </>
  );
};

export default Header;
