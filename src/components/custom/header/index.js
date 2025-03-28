import React from "react";
import { Button, Select } from "components/ui";
import TableSearchBar from "components/ui/TableSearchBar";
import { GrPowerReset } from "react-icons/gr";
import { getApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { debounce } from "lodash";
import AsyncSelect from "react-select/async";

const ButtonSection = ({ buttonMenu, buttonClick }) => {
  return (
    <div className="mb-4">
      {buttonMenu?.map((btn, i, arr) => {
        return (
          <Button
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

const FilterSection = ({
  setSearch,
  FilterMenu,
  setFilterValue,
  filterValue,
  asyncApiType,
  searchPlaceholder
}) => {
  const loadStaysOption = (inputValue, resolve) => {
    getApi(asyncApiType === 1 ? APIS.GET_USERS : APIS.GET_CATEGORIES, {
      search: inputValue,
    }).then((result) => {
      resolve(result?.data?.data);
    });
  };
  const loadStays = debounce(loadStaysOption, 300);
  return (
    <div className="md:flex  gap-4 w-full">
      <TableSearchBar placeholder={searchPlaceholder} onChange={(query) => setSearch(query)} />
      {FilterMenu?.map((filter, i) => {
        return (
          <>
            {filter.component === "select" && (
              <Select
                autoComplete="off"
                size="sm"
                className={filter.className}
                placeholder={filter.placeholder}
                options={filter.options}
                value={filterValue[filter?.filterKey]}
                onChange={(selectedValue) => {
                  setFilterValue({
                    ...filterValue,
                    [filter?.filterKey]: selectedValue,
                  });
                }}
              />
            )}
            {filter.component === "resetButton" && (
              <Button
                size="sm"
                className={filter.className}
                onClick={() => {
                  setFilterValue(filter?.filterKey);
                  setSearch("");
                }}
                icon={<GrPowerReset />}
              >
                {filter.label}
              </Button>
            )}
            {filter.component === "asyncSelect" && (
              <Select
                autoComplete="off"
                placeholder={filter.placeholder}
                defaultOptions
                cacheOptions
                size="sm"
                className={filter.className}
                value={filterValue?.[filter?.filterKey]}
                loadOptions={loadStays}
                componentAs={AsyncSelect}
                getOptionLabel={(v) =>
                  `${v?.[filter.label]} ${
                    filter?.label1 ? v?.[filter.label1] : ""
                  }`
                }
                getOptionValue={(v) => v?.id}
                onChange={(event) => {
                  setFilterValue({
                    ...filterValue,
                    [filter?.filterKey]: event,
                  });
                }}
              />
            )}
          </>
        );
      })}
    </div>
  );
};

const Header = ({
  buttonMenu,
  FilterMenu,
  setSearch,
  buttonClick,
  setFilterValue,
  filterValue,
  asyncApiType,
  searchPlaceholder,
}) => {
  return (
    <>
      <div className="md:flex items-center justify-end">
        <ButtonSection buttonMenu={buttonMenu} buttonClick={buttonClick} />
      </div>
      <div className="items-center lg:flex">
        <FilterSection
          searchPlaceholder={searchPlaceholder}
          setSearch={setSearch}
          FilterMenu={FilterMenu}
          setFilterValue={setFilterValue}
          filterValue={filterValue}
          asyncApiType={asyncApiType}
        />
      </div>
    </>
  );
};
export default Header;
