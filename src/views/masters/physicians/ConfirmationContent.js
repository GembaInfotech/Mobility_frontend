import React from "react";
import { Button, Dialog } from "components/ui";

const ConfirmationContent = ({
  header,
  des,
  onDialogOk,
  openModal,
  onDialogClose,
}) => {
  return (
    <Dialog
      isOpen={openModal}
      onClose={onDialogClose}
      onRequestClose={onDialogClose}
      contentClassName="pb-0 px-0 mt-36 min-w-36"
    >
      <div className="px-5 pb-5">
        <h5 className="mb-4">{header}</h5>
        <p>{des}</p>
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={onDialogClose}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={onDialogOk}>
            Delete
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmationContent;
