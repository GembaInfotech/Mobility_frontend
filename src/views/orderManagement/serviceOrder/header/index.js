import React, { useEffect , useState} from "react";
import { Button, DatePicker, Select } from "components/ui";
import { GrPowerReset } from "react-icons/gr";
import { getApi } from "services/CommonService";
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";
import { DATE_FORMAT } from "constants/app.constant";
import moment from "moment";
import { SERVICE_ORDER_STATUS } from "../serviceConstant";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const FilterSection = ({
  setSearch,
  filtervalue,
  setFilterValue,
  setFilterPatientId,
  filterPatientId,
  setFilterNalId,
  setFilterCompanyId,
  filterNalId,
  filterCompanyId,
  setFilterPhysicianId,
  filterPhysicianId,
  filterLcodeId,
  setFilterLcodeId,
  filterInsuranceId,
  setFilterInsuranceId,
  selectedDate,
  setSelectedDate,
  filterPatientDob,
  setFilterPatientDob,
  filterNad,
  setFilterNad,
}) => {


  const user = useSelector((state) => state.auth.user);
  const savedHospitalId = localStorage.getItem("selectedHospitalId");

  const [companyOptions, setCompanyOptions] = useState([]);
  const [insuranceOptions, setInsuranceOptions] = useState([]);
  const [patientOptions, setPatientOptions] = useState([]);
  const [nalOptions, setNalOptions] = useState([]);
  const [physicianOptions, setPhysicianOptions] = useState([]);
  const [lcodeOptions, setLcodeOptions] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        let response;
       
        if (user?.companyId) {
          response = await getApi(APIS.LIST_DATA, {
            companyIds: JSON.stringify(user.companyId),
            type: LIST_DATA_API_TYPE.COMPANY,
          });
        } else {
          response = await getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.COMPANY});
        }
 
        console.log(response?.data);
        setCompanyOptions(response?.data?.data || []);
       
      } catch (error) {
        console.error("Error loading company list:", error);
      }
    };
 
    fetchCompanies();
  }, [user]);
 
  useEffect(() => {
    const fetchFilters = async () => {
      const companyId = filterCompanyId?._id ?? savedHospitalId;

      try {
        const [insuranceRes, patientRes, nalRes, physicianRes, lcodeRes] = await Promise.all([
          getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.INSURANCES, companyId }),
          getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.PATIENTS, companyId }),
          getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.LOCATIONS, companyId }),
          getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.PHYSICIANS, companyId }),
          getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.CODES, companyId }),
        ]);

        setInsuranceOptions(insuranceRes?.data?.data || []);
        setPatientOptions(patientRes?.data?.data || []);
        setNalOptions(nalRes?.data?.data || []);
        setPhysicianOptions(physicianRes?.data?.data || []);
        setLcodeOptions(lcodeRes?.data?.data || []);
      } catch (error) {
        console.error("Error loading filter options:", error);
      }
    };

    fetchFilters();
  }, [filterCompanyId]);

  const navigate = useNavigate();


  return (
    <div className="grid grid-cols-3 gap-4 mb-5">
      <Select
        autoComplete="off"
        placeholder="Filter by Company"
        defaultOptions
        cacheOptions
        size="sm"
        className="mb-4"
        value={filterCompanyId}
        options={companyOptions}
        getOptionLabel={(v) => `${v?.name || ""}`}
        getOptionValue={(v) => v?._id}
        onChange={(selectedCompany) => {
          setFilterCompanyId(selectedCompany);
          setFilterPatientId(null);
          setFilterInsuranceId(null);
          setFilterNalId(null);
          setFilterPhysicianId(null);
          setFilterLcodeId(null);
          setFilterValue("");
        }}
      />
      <Select
        autoComplete="off"
        placeholder="Filter by Insurance"
        defaultOptions
        cacheOptions
        size="sm"
        className="mb-4"
        value={filterInsuranceId}
        options={insuranceOptions}
        getOptionLabel={(v) => `${v?.name || ""}`}
        getOptionValue={(v) => v?._id}
        onChange={(selectedInsurance) => {
          setFilterInsuranceId(selectedInsurance || "");
        }}
      />

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
        // key={`${filterCompanyId?._id || "default"}`}
        autoComplete="off"
        placeholder="Filter by Patient (Name, Phone, ID)"
        defaultOptions
        cacheOptions
        size="sm"
        className="mb-4"
        value={filterPatientId}
        options={patientOptions}
        getOptionLabel={(v) =>
          `${v?.firstName} ${v?.lastName ? v?.lastName : ""} ${v?.patientNo ? `(${v?.patientNo})` : ""
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
        value={filterNalId}
        options={nalOptions}
        getOptionLabel={(v) => `${v?.name || ""}`}
        getOptionValue={(v) => v?._id}
        onChange={(selectedNal) => {
          setFilterNalId(selectedNal);
        }}
      />

      <Select
        autoComplete="off"
        placeholder="Filter by Referring Physician"
        defaultOptions
        cacheOptions
        size="sm"
        className="mb-4"
        value={filterPhysicianId}
        options={physicianOptions}
        getOptionLabel={(v) => `${v?.name || ""}`}
        getOptionValue={(v) => v?._id}
        onChange={(selectedPhysician) => {
          setFilterPhysicianId(selectedPhysician);
        }}
      />

      <Select
        autoComplete="off"
        placeholder="Filter by LCode"
        defaultOptions
        cacheOptions
        size="sm"
        className="mb-4"
        value={filterLcodeId}
        options={lcodeOptions}
        getOptionLabel={(v) => `${v?.code || ""}`}
        getOptionValue={(v) => v?._id}
        onChange={(selectedLcode) => {
          setFilterLcodeId(selectedLcode || "");
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
          setFilterNalId("");
          setFilterCompanyId("");
          setFilterPhysicianId("");
          setFilterLcodeId("");
          setFilterInsuranceId("");
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
  filterNalId,
  filterCompanyId,
  setFilterNalId,
  setFilterCompanyId,
  setFilterPhysicianId,
  filterPhysicianId,
  filterLcodeId,
  setFilterLcodeId,
  filterInsuranceId,
  setFilterInsuranceId,
}) => {
  const ButtonSection = ({ buttonClick, buttonMenu }) => {
    return (
      <div className="mb-4 ">
        {buttonMenu?.map((btn, i) => (
          <Button
            key={i}
            size="sm"
            variant="solid"
            onClick={(e) => buttonClick(e, btn.key)}
            style={{ marginLeft: "5px" }} z
            icon={btn.icon}
          >
            {btn.label}
          </Button>
        ))}
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
          setFilterNalId={setFilterNalId}
          setFilterCompanyId={setFilterCompanyId}
          filterNalId={filterNalId}
          filterCompanyId={filterCompanyId}
          filterPhysicianId={filterPhysicianId}
          setFilterPhysicianId={setFilterPhysicianId}
          filterLcodeId={filterLcodeId}
          filterInsuranceId={filterInsuranceId}
          setFilterLcodeId={setFilterLcodeId}
          setFilterInsuranceId={setFilterInsuranceId}
        />
      </div>
    </>
  );
};

export default Header;
