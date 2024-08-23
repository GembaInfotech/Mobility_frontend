import React, { useState } from "react";
import { Button, Dialog, Notification, toast } from "components/ui";
import { HiOutlineTrash } from "react-icons/hi";
import { postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { CONFIRMATION_OBJ } from "constants/app.constant";

const DeleteDialogBox = ({ row, num, name, setRefresh }) => {
  const [dialogIsOpen, setIsOpen] = useState(false);
  //// HANDLER FOR OPEN DIALOG BOX /////

  const openDialog = () => {
    setIsOpen(true);
  };

  ///// HANDLER FOR CLOSE DIALOG BOX //////

  const onDialogClose = (e) => {
    console.log("onDialogClose", e);
    setIsOpen(false);
  };

  //// HANDLER FOR DELETE DATA FROM  LIST ////

  const onDelete = (e) => {
    postApi(APIS.DELETE_DATA, {
      type: num,
      id: row?._id,
    }).then(() => {
      toast.push(<Notification type="danger">{name} deleted!</Notification>);
      setRefresh((s) => !s);
    });
    setIsOpen(false);
  };

  ///// RETURN ///////
  return (
    <div>
      <HiOutlineTrash onClick={() => openDialog()} />
      <Dialog
        isOpen={dialogIsOpen}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
      >
        <h5 className="mb-4">Delete {name}</h5>
        <p>{`${CONFIRMATION_OBJ.DELETE} ${name?.toLowerCase()} ?`}</p>
        <div className="text-right mt-6">
          <Button
            size="sm"
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={onDialogClose}
          >
            Cancel
          </Button>
          <Button
            variant="twoTone"
            size="sm"
            color="red-600"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default DeleteDialogBox;
