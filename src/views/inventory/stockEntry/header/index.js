import React, { useEffect, useState } from "react";
import { Button, Select } from "components/ui";
import { GrPowerReset } from "react-icons/gr";
import { getApi } from "services/CommonService";
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";
import { debounce } from "lodash";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";

const FilterSection = ({ setFilterLocationId, filterLocationId, filterCompanyId, setFilterCompanyId, setFilterLCodes, filterLCodes }) => {
  const [locations, setLocations] = useState([]); // Store locations fetched from API
  const [companies, setCompanies] = useState([]);
  const [selectedLCodes, setSelectedLCodes] = useState(null); 
  const [LCodes, setLCodes] = useState([]);
  // Fetch location options
  const savedHospitalId = localStorage.getItem("selectedHospitalId");

  const loadLocationOption = (inputValue, resolve) => {
    console.log("savedHospitalId", savedHospitalId);
    
    getApi(APIS.LIST_DATA, {
      type: LIST_DATA_API_TYPE.LOCATIONS,
      companyId: savedHospitalId,
      search: inputValue,
    }).then((res) => {
      resolve(res?.data?.data);
      setLocations(res?.data?.data); // Save the fetched locations to state
    });
  };

  const loadCompanyOption = (inputValue, resolve) => {
    getApi(APIS.LIST_DATA, {
      type: LIST_DATA_API_TYPE.COMPANY,
      search: inputValue,
    }).then((res) => {
      resolve(res?.data?.data);
      setCompanies(res?.data?.data); // Save the fetched locations to state
    });
  };

  const loadLCodesOption = (inputValue, resolve) => {
    
    getApi(APIS.LIST_DATA, {
      type: LIST_DATA_API_TYPE.CODES,
      companyId: savedHospitalId,
      search: inputValue,
    }).then((res) => {
      resolve(res?.data?.data);
      setLCodes(res?.data?.data); // Save the fetched locations to state
    });
  };
  console.log("Locations",locations);
  console.log("codes",LCodes);

  const loadLocation = debounce(loadLocationOption, 300);
  const loadCompany = debounce(loadCompanyOption, 300);
  const loadLCodes = debounce(loadLCodesOption,300);
  const navigate = useNavigate();

  console.log("Codes",loadLCodes);
  
  // Find the selected location based on the filterLocationId
  const selectedLocation = locations.find(
    (location) => location._id === filterLocationId
  );

  const selectedCompany = companies.find(
    (company) => company._id === filterCompanyId
  );

  useEffect(() => {
    const selected = LCodes.find((LCodes) => LCodes.id === filterLCodes);
    setSelectedLCodes(selected || null); // If not found, set to null
  }, [filterLCodes]);

  console.log("LCodes",selectedLCodes);
  return (
    <div className="grid grid-cols-3 gap-4 mb-5">
      {/* AsyncSelect to display filtered location */}
      <AsyncSelect
        autoComplete="off"
        placeholder="Filter by Location"
        defaultOptions
        cacheOptions
        size="sm"
        className="mb-4"
        value={selectedLocation || null} // Set selected location as value
        loadOptions={loadLocation}
        getOptionLabel={(v) => `${v?.name || ""}`}
        getOptionValue={(v) => v?._id}
        onChange={(selectedOption) => {
          console.log("Selected Location: ", selectedOption);
          setFilterLocationId(selectedOption?._id); // Update the parent state with selected location ID
        }}
      />

<AsyncSelect
        autoComplete="off"
        placeholder="Filter by Company"
        defaultOptions
        cacheOptions
        size="sm"
        className="mb-4"
        value={selectedCompany || null} // Set selected location as value
        loadOptions={loadCompany}
        getOptionLabel={(v) => `${v?.name || ""}`}
        getOptionValue={(v) => v?._id}
        onChange={(selectedOption) => {
          console.log("Selected Location: ", selectedOption);
          setFilterCompanyId(selectedOption?._id); // Update the parent state with selected location ID
        }}
      />
 <AsyncSelect
        autoComplete="off"
        placeholder="Filter by LCodes"
        defaultOptions
        cacheOptions
        size="sm"
        className="mb-4"
        value={selectedLCodes || null} // Set selected LCodes as value
        loadOptions={loadLCodes}
        getOptionLabel={(v) => `${v?.code || ""}`}
        getOptionValue={(v) => v?._id}
        onChange={(selectedOption) => {
          console.log("Selected Location: ", selectedOption);
          setFilterLCodes(selectedOption?._id); // Update the parent state with selected location ID
        }}
      />
      {/* Reset button */}
      <Button
        size="sm"
        onClick={() => {
          setFilterLocationId(""); // Reset the filter location ID
          setFilterCompanyId("");
          navigate("/app/inventory/stockEntry"); // Navigate to the stock entry page
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
  filterLocationId,
  filterCompanyId,
  setFilterLocationId,
  setFilterCompanyId,
  filterLCodes,
  setFilterLCodes,
}) => {
  const ButtonSection = ({ buttonClick, buttonMenu }) => {
    return (
      <div className="mb-4">
        {buttonMenu?.map((btn, i) => (
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
          setSearch={setSearch}
          setFilterValue={setFilterValue}
          filtervalue={filtervalue}
          filterCompanyId = {filterCompanyId}
          setFilterLocationId={setFilterLocationId}
          setFilterCompanyId = {setFilterCompanyId}
          filterLocationId={filterLocationId} // Passing the filter location ID to the FilterSection
          filterLCodes={filterLCodes}
          setFilterLCodes={setFilterLCodes}
        />
      </div>
    </>
  );
};

export default Header;
