import React from "react";
import { Button, DatePicker, Select } from "components/ui";
import { GrPowerReset } from "react-icons/gr";
import { getApi } from "services/CommonService";
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";
import { debounce } from "lodash";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";

const FilterSection = ({
  setFilterLocationId,
  filterLocationId
}) => {

  const loadLocationOption = (inputValue, resolve) => {
    getApi(APIS.LIST_DATA, {
      type: LIST_DATA_API_TYPE.LOCATIONS,
      search: inputValue,
    }).then((res) => {
      // console.log(res); // Log the response to see available NAL options
      resolve(res?.data?.data);
    });
  };


  const loadLocation = debounce(loadLocationOption, 300);
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-4 mb-5">
     
      <Select
        autoComplete="off"
        placeholder="Filter by Location"
        defaultOptions
        cacheOptions
        size="sm"
        className="mb-4"
        value={filterLocationId}
        loadOptions={loadLocation}
        componentAs={AsyncSelect}
        getOptionLabel={(v) => `${v?.name || ""}`}
        getOptionValue={(v) => v?._id}
        onChange={(selectedLocation) => {
            console.log("selectedLocation", selectedLocation);
          setFilterLocationId(selectedLocation?._id);
        }}
      />
      <Button
        size="sm"
        onClick={() => {
          setFilterLocationId("");
          navigate("/app/inventory/stockEntry");
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
  setFilterLocationId,
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
          setFilterLocationId={setFilterLocationId}
          filterLocationId={filterLocationId}
        />
      </div>
    </>
  );
};

export default Header;
