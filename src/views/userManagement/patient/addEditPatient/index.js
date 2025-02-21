import React, { useEffect, useState } from "react";
import {
  FormItem,
  FormContainer,
  Card,
  Button,
  Spinner,
  Notification,
  toast,
  Select,
} from "components/ui";
import { Form, Field, useFormik, FormikProvider } from "formik";
import {
  INSURANCE_FIELD_CONSTANT,
  PATIENT_FIELD_CONSTANT,
} from "../patientConstant";
import MixComponent from "./mixComponent";
import { useParams, useNavigate } from "react-router-dom";
import { postApi, getApi } from "services/CommonService";
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";
import { UPDATE_TOAST, ADDED_TOAST } from "constants/app.constant";
import * as Yup from "yup";
import { useSelector } from "react-redux";
// import ImageField from "./imageField";
import moment from "moment";


const patientSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  dob: Yup.string().required("Required"),
  naspacNo: Yup.string().required("Required"),
  phoneNumber: Yup.string().required("Required"),
  primaryInsuranceNo: Yup.string(),
  primaryInsurance: Yup.object(),
  secondaryInsurance: Yup.object(),
  secondaryInsuranceNo: Yup.string(),
});


const initialValues = {
  firstName: "",
  lastName: "",
  dob: moment().subtract(18, "years").format(),
  naspacNo: "",
  phoneNumber: "",
  countryCode: "+1",
  primaryInsurance: "",
  primaryInsuranceNo: "",
  secondaryInsurance: "",
  secondaryInsuranceNo: "",
};

const AddEditPatient = () => {
  const [companyOptions, setCompanyOptionos] = useState([]);
  const user = useSelector((state) => state.auth.user);

  console.log("companyOptionshdbfhrbf", companyOptions);

  const { id } = useParams();
  const [editdata, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.companyId) {
      getApi(APIS.LIST_DATA, {
        companyIds: JSON.stringify(user.companyId),
        type: LIST_DATA_API_TYPE.COMPANY,
      })
        .then((res) => {
          const response = res?.data?.data;
          
          if (Array.isArray(response)) {
            const companyOptions = response.map((company) => ({
              label: company.name,
              value: company._id,
            }));
            setCompanyOptionos(companyOptions);
          }
        })
        .catch((error) => {
          // Handle any errors from the additional API call
          console.error("Error calling additional API:", error);
        });
    } else {
      getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.COMPANY })
        .then((res) => {
          if (res && res.data && Array.isArray(res.data.data)) {
            const locations = res.data.data.map((location) => ({
              label: location.name,
              value: location._id,
            }));
            setCompanyOptionos(locations);
          } else {
            toast.push(<Notification type="error">No Companies found!</Notification>);
          }
        })
        .catch((error) => {
          console.error("Error fetching Companies:", error);
          toast.push(<Notification type="error">Failed to load Companies</Notification>);
        });
    }
    if (id) {
      getApi(APIS.LIST_DATA, {
        type: LIST_DATA_API_TYPE.PATIENTS,
        id,
      })
        .then((res) => {
          const data = res?.data?.data;
          setEditData({
            firstName: data?.firstName,
            lastName: data?.lastName,
            dob: data?.dob,
            countryCode: data?.countryCode !== null ? data?.countryCode : "+1",
            phoneNumber: data?.countryCode + data?.phoneNumber,
            naspacNo: data?.naspacNo,
            primaryInsurance: { label: data?.primaryInsurance?.name, value: data?.primaryInsurance?._id },
            secondaryInsurance: { label: data?.secondaryInsurance?.name, value: data?.secondaryInsurance?._id },
            primaryInsuranceNo: data?.primaryInsuranceNo,
            secondaryInsuranceNo: data?.secondaryInsuranceNo,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  const onSubmit = (payload) => {
    if (id) {
      payload.id = id;
    }

    // Remove Country code from phone number
    payload.phoneNumber = payload?.phoneNumber?.replace(
      payload?.countryCode,
      ""
    );

    //Check for Empty Phone number
    if (payload.phoneNumber === "") {
      delete payload.phoneNumber;
    }

    if (payload.primaryInsurance) {
      payload.primaryInsurance = payload?.primaryInsurance?.value;
    }
    if (payload.secondaryInsurance) {
      payload.secondaryInsurance = payload?.secondaryInsurance?.value;
    }

    if (payload.primaryInsuranceNo === '') delete payload.primaryInsuranceNo
    if (payload.secondaryInsuranceNo === '') delete payload.secondaryInsuranceNo

    if (payload.primaryInsurance === '') delete payload.primaryInsurance
    if (payload.secondaryInsurance === '') delete payload.secondaryInsurance

    ///setup the + sign with country code if it was not there
    if (!payload?.countryCode?.includes("+")) {
      payload.countryCode = `+${payload.countryCode}`;
    }


    postApi(APIS.ADD_EDIT_PATIENT, { ...payload }).then((res) => {
      toast.push(
        <Notification type="success">
          {id ? UPDATE_TOAST : ADDED_TOAST}
        </Notification>
      );
      navigate(-1);
    });
  };

  const formik = useFormik({
    initialValues: id ? editdata : initialValues,
    enableReinitialize: true,
    validationSchema: patientSchema,
    onSubmit: onSubmit,
  });

  const {
    errors,
    touched,
    values,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    isSubmitting,
  } = formik;
  return (
    <FormikProvider value={formik}>
      <Form
        className="p-1"
        onSubmit={handleSubmit}
        autoComplete="off"
        noValidate
      >
        <div className="flex mb-3 justify-between w-3/4">
          <h3>{id ? "Edit Patient" : "Add Patient"}</h3>
          <div className="flex">
            <Button
              size="sm"
              variant="solid"
              onClick={() => navigate(-1)}
              type="button"
            >
              Back / Cancel
            </Button>
            <Button
              size="sm"
              variant="solid"
              style={{ marginLeft: "5px" }}
              loading={isSubmitting}
              type="submit"
            >
              {id ? "Update" : "Save"}
            </Button>
          </div>
        </div>
        <div>
          {loading && (
            <div className="flex justify-center">
              <Spinner size="3.25rem" />
            </div>
          )}
          {!loading && (
            <>
              <Card className="mt-2.5 w-3/4 ">
                <FormContainer className=" md:w-full lg:w-1/2">
                  <h5 className="mb-4">Personal Information</h5>
                  {/* <ImageField {...{ touched, errors, values, setFieldValue }} /> */}
                  <FormItem label="Company" invalid={errors.company && touched.company} errorMessage={errors.company}>
                    <Select
                      name="companyId"
                      options={companyOptions}
                      placeholder="Select Company"
                      value={companyOptions.find((option) => option.value === values.companyId) || null}
                      onChange={(selectedOption) => setFieldValue("companyId", selectedOption.value)}
                    />
                  </FormItem>
                  {PATIENT_FIELD_CONSTANT.map((field, index, array) => {
                    return (
                      <>
                        {/* {field?.title && (
                          <h6 className="my-3">{field?.title}</h6>
                        )} */}


                        <FormItem
                          key={index}
                          label={
                            field.component === "password" && id
                              ? null
                              : field?.label
                          }
                          className="ml-3 "
                          invalid={
                            errors?.[field?.name] && touched?.[field?.name]
                          }
                          errorMessage={errors?.[field?.name]}
                        >

                          {field.isBasic ? (
                            <Field
                              textArea={field?.textArea ? true : false}
                              type={field?.type}
                              autoComplete="off"
                              name={field?.name}
                              placeholder={field?.placeholder}
                              component={field?.component}
                            />
                          ) : (
                            <MixComponent
                              id={id}
                              errors={errors}
                              field={field}
                              setFieldValue={setFieldValue}
                              values={values}
                            />
                          )}
                        </FormItem>
                      </>
                    );
                  })}

                </FormContainer>
              </Card>
              <Card className="mt-4 w-3/4 ">
                <FormContainer className=" md:w-full lg:w-1/2">
                  <h5 className="mb-4">Insurance Information</h5>
                  {INSURANCE_FIELD_CONSTANT.map((field, index, array) => {
                    return (
                      <>
                        {/* {field?.title && (
                          <h6 className="my-3">{field?.title}</h6>
                        )} */}

                        <FormItem
                          key={index}
                          label={field?.label}
                          className="ml-3"
                          invalid={
                            errors?.[field?.name] && touched?.[field?.name]
                          }
                          errorMessage={errors?.[field?.name]}
                        >
                          {field.isBasic ? (
                            <Field
                              textArea={field?.textArea ? true : false}
                              type={field?.type}
                              autoComplete="off"
                              name={field?.name}
                              placeholder={field?.placeholder}
                              component={field?.component}
                            />
                          ) : (
                            <MixComponent
                              id={id}
                              errors={errors}
                              field={field}
                              setFieldValue={setFieldValue}
                              values={values}
                            />
                          )}
                        </FormItem>
                      </>
                    );
                  })}
                </FormContainer>
              </Card>
            </>
          )}
        </div>
      </Form>
    </FormikProvider>
  );
};

export default AddEditPatient;
