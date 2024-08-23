import React from "react";
import { ACTIVE_INACTIVE_STATUS } from "constants/app.constant";
import { Checkbox } from "components/ui";

const ActiveInActiveCheckbox = ({
  dataObj,
  setSelectedData,
  setActiveConfirm,
  setOpenModal,
}) => {
  const onStatusChange = (e, value, id) => {
    let actionValue = "";
  
    if (value === 1) {
      actionValue = 2;
    }
    if (value === 2) {
      actionValue = 1;
    }
    setSelectedData({ id, action: actionValue });
    setActiveConfirm(true);
    setOpenModal(true);
  };
  const id = dataObj?.row?.original?._id;
  const dataObj1 = ACTIVE_INACTIVE_STATUS.find(
    (item, i) => item.identifier === dataObj?.row?.original?.status
  );
  return (
    <Checkbox
      checked={dataObj1?.value}
      onChange={(e) => onStatusChange(e, dataObj1?.identifier, id)}
    />
  );
};
export default ActiveInActiveCheckbox;
