import React from "react";
import { Select, FormItem } from "components/ui";
import { Field } from "formik";
import { StickyFooter } from "components/shared";
import { Button, FormContainer } from "components/ui";
import { AiOutlineSave } from "react-icons/ai";
import { Formik, Form } from "formik";
import { SERVICE_ORDER_STATUS } from "../../serviceConstant";

///// INITIAL VALUES //////

const StatusChange = ({ onSubmit, selectedData }) => {
  return (
    <>
      <Formik
        initialValues={{
          orderStatus: selectedData?.orderStatus,
          id: selectedData?.id,
        }}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ errors, touched, values, isSubmitting, setFieldValue }) => (
          <Form className="p-5">
            <FormContainer>
              <FormItem label="Order Status">
                <Field
                  component={Select}
                  autoComplete="off"
                  name="orderStatus"
                  value={SERVICE_ORDER_STATUS.find(
                    (obj, i) => obj.value === values?.orderStatus
                  )}
                  placeholder="Select Status"
                  options={SERVICE_ORDER_STATUS}
                  defaultOptions
                  onChange={(selectedValue) =>
                    setFieldValue("orderStatus", selectedValue)
                  }
                  cacheOptions
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
    </>
  );
};

export default StatusChange;
