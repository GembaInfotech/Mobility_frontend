import React from "react";
import { Button, Dialog } from "components/ui";

const ConfirmationContent = ({
  header,
  des,
  onDialogClose,
  isWarning,
  onConfirmClick,
  isOpen,
  buttonLabel,
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
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={onDialogClose}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={onConfirmClick}>
            {buttonLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmationContent;
