import React from 'react';
import TableSearchBar from 'components/ui/TableSearchBar';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { Button } from 'components/ui';
import hasPermisson, { ACCESS, MODULE } from 'utils/hasPermission';

const Header = ({ setSearch, addButtonClick }) => {
  return (
    <>
      {hasPermisson(MODULE.PHYSICIAN, ACCESS.WRITE) && (
        <div className="md:flex items-center justify-end">
          <Button size="sm" variant="solid" onClick={addButtonClick} icon={<HiOutlinePlusCircle />}>
            Add Physician
          </Button>
        </div>
      )}
      <TableSearchBar onChange={(query) => setSearch(query)} />
    </>
  );
};

export default Header;
