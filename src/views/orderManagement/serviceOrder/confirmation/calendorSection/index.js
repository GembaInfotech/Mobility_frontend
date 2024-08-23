import React from "react";
import { DatePicker } from "components/ui";
import { FormItem, Input, TimeInput } from "components/ui";
import { Field } from "formik";
import { StickyFooter } from "components/shared";
import { Button, FormContainer } from "components/ui";
import { AiOutlineSave } from "react-icons/ai";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { DATE_FORMAT } from "constants/app.constant";

////// YUP VALIDATION //////

const AppoinmentSchema = Yup.object().shape({
  appointmentDate: Yup.string().required("Required"),
  appointmentTime: Yup.string().required("Required"),
  appointmentAddress: Yup.string().required("Required"),
});

///// INITIAL VALUES //////

const CalendorSection = ({ onSubmit, selectedData }) => {
  return (
    <Formik
      initialValues={{
        appointmentDate:
          selectedData?.appointmentDate !== null
            ? new Date(selectedData?.appointmentDate)
            : "",
        appointmentTime:
          selectedData?.appointmentTime !== null
            ? new Date(selectedData?.appointmentTime)
            : "",
        appointmentAddress:
          selectedData?.appointmentAddress !== null
            ? selectedData?.appointmentAddress
            : "",
      }}
      validationSchema={AppoinmentSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ errors, touched, values, isSubmitting, setFieldValue }) => (
        <Form className="p-5">
          <FormContainer>
            <FormItem
              label="Appointment Date"
              invalid={errors?.appointmentDate && touched?.appointmentDate}
              errorMessage={errors?.appointmentDate}
            >
              <DatePicker
                value={values?.appointmentDate}
                inputFormat={DATE_FORMAT}
                name="appointmentDate"
                placeholder="Select appointment date"
                onChange={(date) => {
                  setFieldValue("appointmentDate", date);
                }}
              />
            </FormItem>
            <FormItem
              label="Appointment Time"
              invalid={errors?.appointmentTime && touched?.appointmentTime}
              errorMessage={errors?.appointmentTime}
            >
              <Datetime
                onChange={(currentDate) => {
                  if (!currentDate._isValid) {
                  } else {
                    setFieldValue("appointmentTime", currentDate);
                  }
                }}
                value={new Date(values?.appointmentTime)}
                dateFormat={false}
                timeFormat={"hh:mm  A"}
                inputProps={{
                  placeholder: "Enter time",
                  style: {
                    width: "100%",
                    borderWidth: "1px",
                    height: "2.75rem",
                    borderRadius: "0.375rem",
                    padding: "0.5rem 0.75rem",
                  },
                }}
              />
            </FormItem>
            <FormItem
              label="Appointment Address"
              invalid={
                errors?.appointmentAddress && touched?.appointmentAddress
              }
              errorMessage={errors?.appointmentAddress}
            >
              <Field
                textArea={true}
                type="text"
                autoComplete="off"
                name="appointmentAddress"
                placeholder="Enter appointment address"
                component={Input}
              />
            </FormItem>

            <StickyFooter
              className="-mx-8 px-8 flex items-center justify-between py-4"
              stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <div></div>
              <div className="md:flex items-center">
                <Button
                  size="sm"
                  variant="solid"
                  loading={isSubmitting}
                  type="submit"
                  icon={<AiOutlineSave />}
                >
                  Set Appoinment
                </Button>
              </div>
            </StickyFooter>
          </FormContainer>
        </Form>
      )}
    </Formik>
  );
};

export default CalendorSection;
