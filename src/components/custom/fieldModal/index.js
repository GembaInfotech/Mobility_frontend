import React from "react";
import { Button, Dialog } from "components/ui";
import {
  Upload,
  InputGroup,
  Input,
} from "components/ui";

const FieldModal = ({
  uploadLoading,
  header,
  des,
  onDialogClose,
  isWarning,
  onConfirmClick,
  isOpen,
  buttonLabel,
  setUploadFile,
  uploadFile,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onDialogClose}
      onRequestClose={onDialogClose}
      contentClassName="pb-0 px-0 mt-36 min-w-36"
    >
      <div className="px-5 pb-5">
        <h5 className="mb-4">{header}</h5>
        <p>{des}</p>
        {isWarning && <p className="text-red-700">{isWarning}</p>}
        <InputGroup className="mb-4">
          <Input value={uploadFile?.[0]?.name} />
          <Upload
            uploadLimit={1}
            showList={false}
            accept={[".xlsx, .xls, .csv"]}
            name="uploadFile"
            onChange={(file) => {
              setUploadFile(file);
            }}
          ></Upload>
        </InputGroup>
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={onDialogClose}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={onConfirmClick}
            loading={uploadLoading}
            disabled={!uploadFile}
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default FieldModal;
