import React, { useState } from "react";
import { Select, FormItem, Input,} from "components/ui";
import { Field } from "formik";
import { StickyFooter } from "components/shared";
import { Button, FormContainer } from "components/ui";
import { AiOutlineSave } from "react-icons/ai";
import { Formik, Form } from "formik";
import { SERVICE_ORDER_STATUS, loadLocations } from "../../serviceConstant";
import AsyncSelect from "react-select/async";

///// INITIAL VALUES //////

const StatusChange = ({ onSubmit, selectedData }) => {
  const [showLocation, setShowLocation] = useState(false);

  return (
    <>
      <Formik
        initialValues={{
          orderStatus: selectedData?.orderStatus,
          id: selectedData?.id,
          name: "",
          location: selectedData?.location || ""
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
                  onChange={(selectedValue) => {
                    setFieldValue("orderStatus", selectedValue);
                    if(selectedValue.value==12){
                      setShowLocation(true);
                    }
                    else{
                      setShowLocation(false);
                    }
                  }}
                  cacheOptions
                />
              </FormItem>
              
              
              <FormItem
                  label="Add Comment"
                  invalid={errors?.name && touched?.name}
                  errorMessage={errors?.name}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="name"
                    placeholder="Enter Name"
                    component={Input}
                  />
              </FormItem>
              
              {showLocation && (
                <FormItem
                  label="Location"
                  invalid={errors?.location && touched?.location}
                  errorMessage={errors?.location}
                >
                  <Field name="location">
                    {({ field, form }) => (
                      <AsyncSelect
                        cacheOptions
                        defaultOptions
                        loadOptions={loadLocations}
                        placeholder="Select Location"
                        value={field.value}
                        onChange={(selectedOption) => form.setFieldValue("location", selectedOption)}
                        getOptionLabel={option => option.label}
                        getOptionValue={option => option.value}
                      />
                    )}
                  </Field>
                </FormItem>
              )}
              
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
