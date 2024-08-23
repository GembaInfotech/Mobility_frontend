import React from "react";
import { IMAGES } from "../../../../../assets/icon";
import { Tooltip } from "components/ui";

const DOCUMENT_CONSTANT = [
  { label: "Prescription", value: 1 },
  { label: "Letter of Medical Necessity", value: 2 },
  { label: "Insurance verification", value: 3 },
  { label: "Insurance authorization", value: 4 },
  { label: "Delivery Receipt", value: 5 },
];

const DownloadSection = ({ onSubmit, selectedData }) => {
  return (
    <div className="px-5 py-2.5">
      <div className="text-base font-bold mb-4">
        Selected Patient:{" "}
        <span className="text-blue-900">{`${selectedData?.patientId?.firstName} ${selectedData?.patientId?.lastName} (${selectedData?.patientId?.patientNo})`}</span>
      </div>
      {DOCUMENT_CONSTANT.map((item, i) => {
        return (
          <div
            key={i}
            className="my-2.5 w-7/12 flex justify-between font-bold text-blue-900 text-base"
          >
            <div>
              {i + 1}. {"  "}
              {item?.label}
            </div>
            <Tooltip key={i} title={"Download"} visible={true}>
              <img
                src={IMAGES.DOWNLOAD_PDF}
                alt="donwload Icon"
                style={{ maxWidth: "20px" }}
                className="cursor-pointer mx-0.5"
                onClick={() => onSubmit("onDownload")}
              />
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
};

export default DownloadSection;
