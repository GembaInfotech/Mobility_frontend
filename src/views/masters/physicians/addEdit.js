import React, { useState } from "react";
import { AdaptableCard } from "components/shared";
import {
  Button,
  FormContainer,
  toast,
  Notification,
  Card,
  FormItem,
  Input
} from "components/ui";
import { AiOutlineSave, AiOutlineCloseCircle } from "react-icons/ai";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { getApi, postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";


const FORM_FIELDS = [
  {
    label: "Name",
    type: "text",
    name: "name",
    placeholder: "Enter physician name",
    component: Input,
    isBasic: true,
  },
  {
    name: "phoneNumber",
    countryCode: "countryCode",
    label: "Mobile No.",
    component: "phoneNumber",
    placeholder: "Enter mobile no.",
  },
  {
    label: "Fax",
    name: "fax",
    placeholder: "Enter Fax",
    component: Input,
    isBasic: true,
  },
  {
    label: "NPI No.",
    name: "npiNo",
    placeholder: "Enter NPI No.",
    component: Input,
    isBasic: true,
  },
  {
    label: "Address",
    name: "address",
    placeholder: "Enter Address",
    component: Input,
    isBasic: true,
    textArea : true 
  },
  
];

////// YUP VALIDATION //////

const Schema = Yup.object().shape({
  name: Yup.string().required("Required"),
  phoneNumber: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  fax: Yup.string().required("Required"),
  npiNo: Yup.string().required("Required"),
});


///// INITIAL VALUES //////

const initialValues = {
  name: "",
  fax: "",
  npiNo: "",
  phoneNumber: "",
  countryCode: "+1",
  address: "",
};

const AddEditPhysician = ({ closeAddEdit, selectedRow }) => {

  //// HANDLER FOR SUBMIT FORM /////
  const onSubmit = (payload, { setSubmitting }) => {

    const dataToSend = {}
    // Remove Country code from phone number
    dataToSend.phoneNumber = payload?.phoneNumber?.replace(
      payload?.countryCode,
      ""
    );

    if (!payload?.countryCode?.includes("+")) {
      dataToSend.countryCode = `+${payload.countryCode}`;
    }

    //Check for Empty Phone number
    if (payload.phoneNumber === "") {
      delete dataToSend.phoneNumber;
    }

    if(selectedRow){
      dataToSend.id = selectedRow._id
    }

    dataToSend.name = payload?.name
    dataToSend.email = payload?.email
    dataToSend.address = payload?.address
    dataToSend.fax = payload?.fax
    dataToSend.npiNo = payload?.npiNo

    postApi(APIS.ADD_EDIT_PHYSICIANS, dataToSend)
      .then((res) => {
        toast.push(
          <Notification type="success">Saved successfully</Notification>
        );
      })
      .finally(() => {
        closeAddEdit();
        setSubmitting(false);
      });
  };

  return (
    <AdaptableCard>
      <Formik
        initialValues={selectedRow ? selectedRow : initialValues}
        validationSchema={Schema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ errors, touched, values, isSubmitting, setFieldValue }) => (
          <Form className="p-5">
            <div className="flex mb-3 justify-between w-3/4">
              <h3>{selectedRow ? "Edit Physician" : "Add Physician"}</h3>
              <div className="flex">
                <Button
                  size="sm"
                  className="ltr:mr-3 rtl:ml-3"
                  onClick={closeAddEdit}
                  icon={<AiOutlineCloseCircle />}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  loading={isSubmitting}
                  icon={<AiOutlineSave />}
                  type="submit"
                >
                  {selectedRow ? "Update" : "Save"}
                </Button>
              </div>
            </div>
            <div>
              <Card className="mt-2.5 w-3/4 ">
                <FormContainer className=" md:w-full lg:w-1/2">
                  {FORM_FIELDS.map((field, index) => {
                    return (
                      <FormItem
                        key={index}
                        label={field?.label}
                        invalid={errors?.[field.name] && touched?.[field.name]}
                        errorMessage={errors?.[field.name]}
                      >
                        {field?.isBasic ? (
                          <Field
                            textArea={field?.textArea ? true : false}
                            type={field.type}
                            autoComplete="off"
                            onWheel={(e) =>
                              field?.isWheel ? e.target.blur() : ""
                            }
                            value={values?.[field.name]}
                            name={field.name}
                            placeholder={field.placeholder}
                            component={field?.component}
                          />
                        ) : (
                          <>
                           {field?.component === "phoneNumber" && (
                              <PhoneInput
                                inputStyle={{ width: "369px", padding: "11px 14px 11px 60px" }}
                                enableSearch={true}
                                country={"us"}
                                countryCodeEditable
                                value={`${values?.[field.name]}`}
                                onChange={(phone, country) => {
                                  setFieldValue(field.name, phone);
                                  setFieldValue(field.countryCode, country?.dialCode);
                                }}
                              />
                           )}
                          </>
                        )}
                      </FormItem>
                    );
                  })}
                </FormContainer>
              </Card>
            </div>
          </Form>
        )}
      </Formik>
    </AdaptableCard>
  );
};

export default AddEditPhysician;
