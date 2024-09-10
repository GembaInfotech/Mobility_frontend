import {
  Button,
  Dialog,
  Notification,
  toast,
} from 'components/ui';
import appConfig from 'configs/app.config';
import { APIS } from 'constants/api.constant';
import React from 'react';
import { postApi } from 'services/CommonService';

const ExportContent = ({ type, onDialogClose, isOpen, user, Payload }) => {
  const onSubmit = () => {
    const payload = { type, ...Payload };
    
    if (user) {
      payload.userId = user?._id;
    }

    postApi(APIS.EXPORT_DATA, payload).then((res) => {
      toast.push(<Notification type="success">Exported successfully</Notification>);
      const downloadLink = document.createElement('a');
      downloadLink.href = appConfig.imageBaseUrl + res?.data?.fileName; // Replace with the actual URL of your file
      downloadLink.download = 'file_name.xlsx'; // Replace with the desired file name

      // Trigger a click event on the download link
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      onDialogClose();
    }).catch(error => {
      toast.push(<Notification type="error">Export failed: {error.message}</Notification>);
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onDialogClose}
      onRequestClose={onDialogClose}
      contentClassName="pb-0 px-0 mt-36 min-w-36"
    >
      <div className="text-right mt-6">
        <Button
          className="ltr:mr-2 rtl:ml-2"
          variant="plain"
          onClick={onDialogClose}
          type="button"
        >
          Cancel
        </Button>
        <Button 
          variant="solid" 
          type="button" 
          onClick={onSubmit}
        >
          Export/Download File
        </Button>
      </div>
    </Dialog>
  );
};

export default ExportContent;