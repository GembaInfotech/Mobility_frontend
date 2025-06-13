import React, { useEffect, useState } from "react";
import CalendorSection from "./calendorSection";
import DownloadSection from "./downloadSection";
import InsuranceSection from "./insuranceSection";
import StatusChange from "./statusChange";
import { PAGE_KEY, MODAL_HEADER } from "../serviceConstant";
import { postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { Notification, toast } from "components/ui";
import { UPDATE_TOAST } from "constants/app.constant";

const Confirmation = ({ selectedKey, selectedData, closeDialog }) => {
  const [dialogHeader, setDialogHeader] = useState();
  const onSubmit = (payload) => {
    if (selectedKey === PAGE_KEY.STATUS_CHANGE) {
      console.log("Payload checkiinggg",payload)
      payload.orderStatus = payload?.orderStatus?.value;

      const formData = new FormData();

      const lcodeQuantities = [];
      const lcodeIds = [];

      selectedData.prescriptions.forEach((prescription) => {
        lcodeQuantities.push(prescription.quantity);
        lcodeIds.push(prescription.lCode._id);
      });

      formData.append("lcodeQuantity", JSON.stringify(lcodeQuantities));
      formData.append("lcodeId", JSON.stringify(lcodeIds));

      formData.append("id", selectedData?._id);
      formData.append("orderStatus", payload?.orderStatus);
      formData.append("NALId", selectedData?.appointmentLocationId?._id)
      formData.append("addComment", payload?.name);
      postApi(APIS.ADD_EDIT_PRESCRIPTION, formData).then((res) => {
        toast.push(<Notification type="success">{UPDATE_TOAST}</Notification>);
        closeDialog();
      });
    }
    if (selectedKey === PAGE_KEY.CALENDOR) {
      postApi(APIS.ADD_EDIT_SERVICE_ORDER, {
        ...payload,
        id: selectedData?._id,
      }).then((res) => {
        toast.push(<Notification type="success">{UPDATE_TOAST}</Notification>);
        closeDialog();
      });
    }
    if (selectedKey === PAGE_KEY.INSURANCE) {
      payload.insuranceStatus = payload?.insuranceStatus?.value;
      postApi(APIS.ADD_EDIT_SERVICE_ORDER, {
        ...payload,
        id: selectedData?.id,
      }).then((res) => {
        toast.push(<Notification type="success">{UPDATE_TOAST}</Notification>);
        closeDialog();
      });
    }
  };

  useEffect(() => {
    setDialogHeader(MODAL_HEADER[selectedKey]);
  }, [selectedKey]);

  

  return (

    <div style={{ minHeight: "250px" }}>
      <div className="text-base font-bold pl-5">{dialogHeader}</div>
      {selectedKey === PAGE_KEY.CALENDOR && (
        <CalendorSection onSubmit={onSubmit} selectedData={selectedData} />
      )}
      {selectedKey === PAGE_KEY.DOWNLOAD && (
        <DownloadSection onSubmit={onSubmit} selectedData={selectedData} />
      )}
      {selectedKey === PAGE_KEY.INSURANCE && (
        <InsuranceSection onSubmit={onSubmit} selectedData={selectedData} />
      )}
      {selectedKey === PAGE_KEY.STATUS_CHANGE && (
        <StatusChange onSubmit={onSubmit} selectedData={selectedData} />
      )}

    </div>


  );
};
export default Confirmation;
