import React from 'react';
import { Input } from 'components/ui';
import { HiOutlineSearch } from 'react-icons/hi';
import debounce from 'lodash/debounce';

const TableSearchBar = ({ onChange, placeholder }) => {
  const debounceFn = debounce(handleDebounceFn, 500);

  function handleDebounceFn(val) {
    onChange?.(val);
  }

  const handleInputChange = (e) => {
    debounceFn(e.target.value);
  };

  return (
    <Input
      className="max-w-md md:w-96 mb-4"
      size="sm"
      placeholder={placeholder ? `${placeholder}` : 'Filter by NAL, LCode, Referring Physician'}
      prefix={<HiOutlineSearch className="text-lg" />}
      onChange={handleInputChange}
    />
  );
};

export default TableSearchBar;
