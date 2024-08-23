import React from "react";
import { DatePicker } from "components/ui";
import AsyncSelect from "react-select/async";
import { Select, FormItem, Input } from "components/ui";
import { Field } from "formik";
import { AdaptableCard, StickyFooter } from "components/shared";
import { Button, FormContainer, toast, Notification } from "components/ui";
import { AiOutlineSave, AiOutlineCloseCircle } from "react-icons/ai";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { STATUS_OPTIONS } from "constants/app.constant";

////// YUP VALIDATION //////

const InsuranceSectionSchema = Yup.object().shape({
  insuranceStatus: Yup.object().required("Required"),
  insuranceAmount: Yup.number().required("Required"),
  insuranceNotes: Yup.string().required("Required"),
});

const InsuranceSection = ({ onSubmit, selectedData }) => {
  return (
    <Formik
      initialValues={{
        insuranceStatus:
          selectedData?.insuranceStatus !== null
            ? STATUS_OPTIONS.find(
                (obj, i) => obj.value === selectedData?.insuranceStatus
              )
            : "",
        insuranceAmount:
          selectedData?.insuranceAmount !== null
            ? selectedData?.insuranceAmount
            : "",
        insuranceNotes:
          selectedData?.insuranceNotes !== null
            ? selectedData?.insuranceNotes
            : "",
      }}
      validationSchema={InsuranceSectionSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ errors, touched, values, isSubmitting, setFieldValue }) => (
        <Form className="p-5">
          <FormContainer>
            <FormItem
              label="Insurance Status"
              invalid={errors?.insuranceStatus && touched?.insuranceStatus}
              errorMessage={errors?.insuranceStatus}
            >
              <Field
                component={Select}
                autoComplete="off"
                placeholder="Select Status"
                defaultOptions
                cacheOptions
                options={STATUS_OPTIONS}
                getOptionLabel={(v) => v?.label}
                getOptionValue={(v) => v?.value}
                onChange={(event) => setFieldValue("insuranceStatus", event)}
                name="insuranceStatus"
                value={values?.insuranceStatus}
              />
            </FormItem>
            <FormItem
              label="Insurance Amount in ($) (If Approved)"
              invalid={errors?.insuranceAmount && touched?.insuranceAmount}
              errorMessage={errors?.insuranceAmount}
            >
              <Field
                textArea={false}
                type="number"
                autoComplete="off"
                name="insuranceAmount"
                placeholder="Enter Amount"
                component={Input}
              />
            </FormItem>
            <FormItem
              label="Remarks"
              invalid={errors?.insuranceNotes && touched?.insuranceNotes}
              errorMessage={errors?.insuranceNotes}
            >
              <Field
                textArea={true}
                type="text"
                autoComplete="off"
                name="insuranceNotes"
                placeholder="Enter Remarks"
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
                  icon={<AiOutlineSave />}
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </StickyFooter>
          </FormContainer>
        </Form>
      )}
    </Formik>
  );
};

export default InsuranceSection;
