import {
  Button,
  DatePicker,
  Dialog,
  FormContainer,
  FormItem,
  Notification,
  toast,
} from 'components/ui';
import appConfig from 'configs/app.config';
import { APIS } from 'constants/api.constant';
import { DATE_FORMAT } from 'constants/app.constant';
import { FormikProvider, useFormik, Form } from 'formik';
import moment from 'moment';
import React from 'react';
import { postApi } from 'services/CommonService';

import * as Yup from 'yup';

const exportSchema = Yup.object().shape({
  startDate: Yup.date()
    .required('Start Date is required')
    .max(Yup.ref('endDate'), 'Start Date must be before End Date')
    .test('is-six-month-period', 'The period cannot be more than 6 months', function (startDate) {
      const endDate = this.resolve(Yup.ref('endDate'));
      if (!startDate || !endDate) return true; // If either date is missing, don't perform the check

      const sixMonthsAgo = new Date(endDate);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      return startDate >= sixMonthsAgo;
    }),
  endDate: Yup.date()
    .required('End Date is required')
    .max(new Date(), 'End Date cannot be in the future'), // Optional constraint to prevent selecting future dates
});

const initialValues = {
  startDate: moment().subtract(30, 'days').calendar(),
  endDate: moment().format(DATE_FORMAT),
};
const ExportContent = ({ type, onDialogClose, isOpen, user }) => {
  const onSubmit = (payload) => {
    if (user) {
      payload.userId = user?._id;
    }
    postApi(APIS.EXPORT_DATA, { type, ...payload }).then((res) => {
      toast.push(<Notification type="success">Exported successfully</Notification>);
      const downloadLink = document.createElement('a');
      downloadLink.href = appConfig.imageBaseUrl + res?.data?.fileName; // Replace with the actual URL of your file
      downloadLink.download = 'file_name.xlsx'; // Replace with the desired file name

      // Trigger a click event on the download link
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      onDialogClose();
      setSubmitting(false);
    });
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: exportSchema,
    onSubmit: onSubmit,
  });
  const { errors, touched, values, handleSubmit, isSubmitting, setSubmitting, setFieldValue } =
    formik;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onDialogClose}
      onRequestClose={onDialogClose}
      contentClassName="pb-0 px-0 mt-36 min-w-36"
    >
      <FormikProvider value={formik}>
        <Form className="p-1" onSubmit={handleSubmit} autoComplete="off" noValidate>
          <h5 className="mb-4 ml-4">Export</h5>
          <FormContainer className="p-5">
            <FormItem
              label="Start Date (MM/DD/YYYY)"
              className="ml-3"
              invalid={errors?.startDate && touched?.startDate}
              errorMessage={errors?.startDate}
            >
              <DatePicker
                name="startDate"
                inputFormat={DATE_FORMAT}
                value={new Date(values?.startDate)}
                onChange={(date) => setFieldValue('startDate', moment(date).format(DATE_FORMAT))}
              />
            </FormItem>
            <FormItem
              label="End Date (MM/DD/YYYY)"
              className="ml-3"
              invalid={errors?.endDate && touched?.endDate}
              errorMessage={errors?.endDate}
            >
              <DatePicker
                name="endDate"
                inputFormat={DATE_FORMAT}
                value={new Date(values?.endDate)}
                onChange={(date) => setFieldValue('endDate', moment(date).format(DATE_FORMAT))}
              />
            </FormItem>
            <div className="text-right mt-6">
              <Button
                className="ltr:mr-2 rtl:ml-2"
                variant="plain"
                onClick={onDialogClose}
                type="button"
              >
                Cancel
              </Button>
              <Button variant="solid" type="submit"  loading={isSubmitting}>
                Export/Download File
              </Button>
            </div>
          </FormContainer>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default ExportContent;
