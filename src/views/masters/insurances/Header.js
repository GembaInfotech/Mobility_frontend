import React, { useState, useEffect } from 'react';
import TableSearchBar from 'components/ui/TableSearchBar';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { GrPowerReset } from "react-icons/gr";
import { Button, Select } from 'components/ui';
import hasPermisson, { ACCESS, MODULE } from 'utils/hasPermission';
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";
import { getApi } from 'services/CommonService';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const FilterSection = ({
  setSearch,
  filtervalue,
  setFilterValue,
  setFilterCompanyId,
  filterCompanyId
}) => {

    const navigate = useNavigate();
  
  const user = useSelector((state) => state.auth.user);
  
  const [companyOptions, setCompanyOptions] = useState([]);

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
          response = await getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.COMPANY });
        }

        console.log(response?.data);
        setCompanyOptions(response?.data?.data || []);
        console.log(companyOptions)
      } catch (error) {
        console.error("Error loading company list:", error);
      }
    };

    fetchCompanies();
  }, [user]);

  return (
    <>
      {/* <TableSearchBar onChange={(query) => setSearch(query)} /> */}
      <div className="md:flex gap-4 w-full">

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
            setFilterValue("");
          }}
        />
        <Button
              size="sm"
              onClick={() => {
                setSearch("");
                setFilterCompanyId(null);
                console.log("filterCompanyId", filterCompanyId)
                navigate("/app/masters/insurances");
              }}
              icon={<GrPowerReset />}
            >
              Reset
            </Button>

      </div>

      
    </>

  );
};

const Header = ({
  setSearch,
  filtervalue,
  setFilterValue,
  setFilterCompanyId,
  filterCompanyId,
  addButtonClick }) => {
  return (
    <>
      {hasPermisson(MODULE.INSURANCES, ACCESS.WRITE) && (
        <div className="md:flex items-center justify-end">
          <Button size="sm" variant="solid" onClick={addButtonClick} icon={<HiOutlinePlusCircle />}>
            Add Insurance
          </Button>
        </div>
      )}
      <div className="flex flex-col">
        <FilterSection
          setSearch = {setSearch}
          filtervalue={filtervalue}
          setFilterValue={setFilterValue}
          setFilterCompanyId={setFilterCompanyId}
          filterCompanyId={filterCompanyId}
        />
      </div>

    </>
  );
};

export default Header;
