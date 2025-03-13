import React, { useEffect, useState } from "react";
import {
  FormItem,
  FormContainer,
  Card,
  Button,
  Spinner,
  Notification,
  toast,
  Radio,
  Select,
} from "components/ui";
import { Form, Field, useFormik, FormikProvider } from "formik";
import {
  PERSONAL_INFORMATION,
  INSURANCE_FIELD_CONSTANT,
  INSURANCE_CONSTANT,
} from "../serviceConstant";
import MixComponent from "./mixComponent";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { postApi, getApi } from "services/CommonService";
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";
import { UPDATE_TOAST, ADDED_TOAST } from "constants/app.constant";
import * as Yup from "yup";
import { DATE_FORMAT } from 'constants/app.constant';
import dayjs from "dayjs";
import { MdKeyboardBackspace } from 'react-icons/md';
import { useSelector } from "react-redux";


const schema = Yup.object().shape({
  patientId: Yup.object().required("Required"),
  locationId: Yup.object().required("Required"),
  physicianId: Yup.object().required("Required"),
  prescriptions: Yup.array(),
  prescriptionDocument: Yup.mixed(),
  physicianNotes: Yup.boolean(),
  primaryInsuranceNo: Yup.string(),
  primaryInsurance: Yup.object(),
  secondaryInsurance: Yup.object(),
  secondaryInsuranceNo: Yup.string(),
  insuranceType: Yup.number(),
  insuranceDocument: Yup.mixed(),
  notes: Yup.string(), 
});

const initialValues = {
  companyId:"", 
  patientId: "",
  locationId: "",
  appointmentLocationId: "",
  physicianId: "",
  renderingPhysicianId: "",
  nextAppointmentDate : new Date(),
  prescriptionDocument: "",
  physicianNotes: false,
  primaryInsurance: "",
  primaryInsuranceNo: "",
  secondaryInsurance: "",
  secondaryInsuranceNo: "",
  insuranceDocument: "",
  notes: "",
  insuranceType: INSURANCE_CONSTANT[1]?.value,
  prescriptions: [{
    deviceType: '',
    icdCode: '',
    lCode: '',
    quantity: '',
    segment: 1
  }],
};

const AddEditSeriveOrder = () => {
  const savedHospitalId = localStorage.getItem("selectedHospitalId");

  // const [companyOptions, setCompanyOptionos] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const { id } = useParams();
  const [editdata, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const stateNavigateData = useLocation();

  if (stateNavigateData.state) {
    const { patientData } = stateNavigateData.state;
    initialValues.patientId = {
      label: `${patientData?.firstName} ${patientData?.lastName} - ${dayjs(patientData?.dob).format(DATE_FORMAT)} (${patientData?.patientNo})`,
      value: patientData?._id
    };

    if (patientData?.primaryInsurance) {
      initialValues.primaryInsurance = {
        label: patientData?.primaryInsurance?.name,
        value: patientData?.primaryInsurance?._id
      }
    }

    if (patientData?.primaryInsuranceNo)
      initialValues.primaryInsuranceNo = patientData?.primaryInsuranceNo

    if (patientData?.secondaryInsuranceNo)
      initialValues.secondaryInsuranceNo = patientData?.secondaryInsuranceNo

    if (patientData?.secondaryInsurance) {
      initialValues.secondaryInsurance = {
        label: patientData?.secondaryInsurance?.name,
        value: patientData?.secondaryInsurance?._id
      }
    }
  }

  useEffect(() => {
    // if (user?.companyId) {
    //       getApi(APIS.LIST_DATA, {
    //         companyIds: JSON.stringify(user.companyId),
    //         type: LIST_DATA_API_TYPE.COMPANY,
    //       })
    //         .then((res) => {
    //           const response = res?.data?.data;
    
    //           if (Array.isArray(response)) {
    //             const companyOptions = response.map((company) => ({
    //               label: company.name,
    //               value: company._id,
    //             }));
    //             setCompanyOptionos(companyOptions);
    //           }
    //         })
    //         .catch((error) => {
    //           // Handle any errors from the additional API call
    //           console.error("Error calling additional API:", error);
    //         });
    //     } else {
    //       getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.COMPANY })
    //         .then((res) => {
    //           if (res && res.data && Array.isArray(res.data.data)) {
    //             const locations = res.data.data.map((location) => ({
    //               label: location.name,
    //               value: location._id,
    //             }));
    //             setCompanyOptionos(locations);
    //           } else {
    //             toast.push(<Notification type="error">No Companies found!</Notification>);
    //           }
    //         })
    //         .catch((error) => {
    //           console.error("Error fetching Companies:", error);
    //           toast.push(<Notification type="error">Failed to load Companies</Notification>);
    //         });
    //     }
    if (id) {
      getApi(APIS.GET_SERVICE_ORDER, {
        id, companyId:savedHospitalId
      })
        .then((res) => {
          const data = res?.data?.data;
          const dataToSet = { ...data };

          dataToSet.patientId = {
            label: `${data?.patientId?.firstName} ${data?.patientId?.lastName} - ${dayjs(data?.patientId?.dob).format(DATE_FORMAT)} (${data?.patientId?.patientNo})`,
            value: data?.patientId?._id
          }

          dataToSet.physicianId = {
            label: `${data?.physicianId?.name}`,
            value: data?.physicianId?._id
          }

          if(data?.renderingPhysicianId?._id)
          dataToSet.renderingPhysicianId = {
            label: `${data?.renderingPhysicianId?.name}`,
            value: data?.renderingPhysicianId?._id
          }

          if(data?.appointmentLocationId?._id)
            dataToSet.appointmentLocationId = {
              label: `${data?.appointmentLocationId?.name}`,
              value: data?.appointmentLocationId?._id
            }

          dataToSet.locationId = {
            label: `${data?.locationId?.name}`,
            value: data?.locationId?._id
          }

          if (data.patientId?.primaryInsurance) {
            dataToSet.primaryInsurance = {
              label: `${data?.patientId?.primaryInsurance?.name}`,
              value: data?.patientId?.primaryInsurance?._id
            }
          }

          if (data.patientId?.primaryInsuranceNo)
            dataToSet.primaryInsuranceNo = data?.patientId?.primaryInsuranceNo

          if (data.patientId?.secondaryInsuranceNo)
            dataToSet.secondaryInsuranceNo = data?.patientId?.secondaryInsuranceNo

          if (data.patientId?.secondaryInsurance) {
            dataToSet.secondaryInsurance = {
              label: `${data?.patientId?.secondaryInsurance?.name}`,
              value: data?.patientId?.secondaryInsurance?._id
            }
          }

          if (data?.prescriptionDocument?.original) {
            dataToSet.prescriptionDocument.name = data?.prescriptionDocument?.original
            dataToSet.prescriptionDocument.type = `application/${data?.prescriptionDocument?.ext}`
            dataToSet.prescriptionDocument = [dataToSet.prescriptionDocument];
          }
          if (data?.insuranceDocument?.original) {
            dataToSet.insuranceDocument.name = data?.insuranceDocument?.original
            dataToSet.insuranceDocument.type = `application/${data?.insuranceDocument?.ext}`
            dataToSet.insuranceDocument = [dataToSet.insuranceDocument];
          }

          dataToSet.prescriptions = data?.prescriptions?.map((item) => {
            return {
              deviceType: { label: item?.deviceType?.name, value: item?.deviceType?._id },
              icdCode: item?.icdCode?.map((icd) => ({ label: icd?.code, value: icd?._id })),
              lCode: { label: item?.lCode?.code, value: item?.lCode?._id },
              quantity: item?.quantity,
              segment: item?.segment,
              prescriptionDocument: item?.prescriptionDocument || {},
            }
          })
          setEditData(dataToSet);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  const onSubmit = (payload) => {
    let formData = new FormData();

    if (id) {
      formData.append("id", id);
    }

    const prescriptions = [];
    for (let obj of payload.prescriptions) {
      prescriptions.push({
        deviceType: obj?.deviceType?.value,
        lCode: obj?.lCode?.value || null,
        icdCode: obj?.icdCode?.length ? obj?.icdCode?.map((icd) => icd?.value) : [],
        quantity: parseInt(obj?.quantity),
        segment: parseInt(obj?.segment),
      })
    }

    formData.append('prescriptions', JSON.stringify(prescriptions));

    if (payload?.prescriptionDocument && !Array.isArray(payload?.prescriptionDocument)) {
      formData.append('prescriptionDocument', payload?.prescriptionDocument);
    }

    if (payload.insuranceDocument && !Array.isArray(payload?.insuranceDocument)) {
      formData.append('insuranceDocument', payload?.insuranceDocument);
    }

    if (payload.primaryInsurance) {
      formData.append('primaryInsurance', payload?.primaryInsurance?.value);
    }

    if (payload.secondaryInsurance) {
      formData.append('secondaryInsurance', payload?.secondaryInsurance?.value);
    }

    if (payload?.primaryInsuranceNo) 
      formData.append('primaryInsuranceNo', payload?.primaryInsuranceNo);
    
    if (payload.secondaryInsuranceNo) 
      
      formData.append('secondaryInsuranceNo', payload?.secondaryInsuranceNo);

    if (payload.patientId) {
      formData.append('patientId', payload?.patientId?.value);
    }
    if (payload.locationId) {
      formData.append('locationId', payload?.locationId?.value);
    }
    if (payload.appointmentLocationId) {
      formData.append('appointmentLocationId', payload?.appointmentLocationId?.value);
    }
    if (payload.physicianId) {
      formData.append('physicianId', payload?.physicianId?.value);
    }
    if (payload.renderingPhysicianId) {
      formData.append('renderingPhysicianId', payload?.renderingPhysicianId?.value);
    }
    
    if (payload.nextAppointmentDate) {
      formData.append('nextAppointmentDate', payload?.nextAppointmentDate);
    }

    
    formData.append('notes', payload?.notes || '');
    formData.append('insuranceType', payload?.insuranceType);

    if ('physicianNotes' in payload) {
      formData.append('physicianNotes', payload?.physicianNotes);
    }
    // if ('companyId' in payload) {
    //   formData.append('companyId', payload?.companyId);
    // }    
    formData.append('companyId', savedHospitalId);


    postApi(APIS.ADD_EDIT_PRESCRIPTION, formData).then((res) => {
      console.log("formData asdf", formData)
      toast.push(
        <Notification type="success">
          {id ? UPDATE_TOAST : ADDED_TOAST}
        </Notification>
      );
      navigate(-1)
      // if (!id) {
      //   navigate('/app/service-order/edit/' + res?.data?._id);
      // }
    }).catch((err) => {
      toast.push(
        <Notification type="error">{err}</Notification>
      );
    }).finally(() => {
      setSubmitting(false);
    });
  };

  const onSelectChange = (name, event) => {

    if (name === 'patientId') {
      if (event?.data?.primaryInsurance) {
        setFieldValue('primaryInsurance', { label: event?.data?.primaryInsurance?.name, value: event?.data?.primaryInsurance?._id });
      }
      else setFieldValue('primaryInsurance', '');

      if (event?.data?.primaryInsuranceNo) {
        setFieldValue('primaryInsuranceNo', event?.data?.primaryInsuranceNo);
      }
      else setFieldValue('primaryInsuranceNo', "");

      if (event?.data?.secondaryInsurance) {
        setFieldValue('secondaryInsurance', { label: event?.data?.secondaryInsurance?.name, value: event?.data?.secondaryInsurance?._id });
      }
      else setFieldValue('secondaryInsurance', '');

      if (event?.data?.secondaryInsuranceNo) {
        setFieldValue('secondaryInsuranceNo', event?.data?.secondaryInsuranceNo);
      }
      else setFieldValue('secondaryInsuranceNo', "");
    }
  }

  const formik = useFormik({
    initialValues: id ? editdata : initialValues,
    enableReinitialize: true,
    validationSchema: schema,
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
    setSubmitting
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
          <h3 className="mb-10">{id ? "Edit Prescription" : "Add Prescription"}</h3>
          <div className="flex">
            <Button
              size="sm"
              variant="solid"
              onClick={() => navigate(-1)}
              type="button"
              className="flex items-center"
            >
              <MdKeyboardBackspace style={{ fontSize: '20px' }} />
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
        {values?.patientId && <div>
          <h4>{"Patient: " + values?.patientId?.label || ''}</h4>
        </div>
        }
        <div>
          {loading && (
            <div className="flex justify-center">
              <Spinner size="3.25rem" />
            </div>
          )}
          {!loading && (
            <>
              <Card className="mt-2.5 w-3/4 ">
                <h5 className="mb-4">Prescription Information</h5>
                <FormContainer >

                  <MixComponent
                    id={id}
                    errors={errors}
                    field={{
                      name: 'prescriptions',
                      component: 'fieldArray',
                    }}
                    setFieldValue={setFieldValue}
                    values={values}
                  />

                  <div className=" md:w-full lg:w-1/2">
                                      {/* <FormItem
                                        label="Company"
                                        invalid={errors.companyId && touched.companyId}
                                        errorMessage={errors.companyId}
                                      >
                                        <Field name="companyId">
                                          {({ field, form }) => (
                                            <Select
                                              {...field}
                                              options={companyOptions}
                                              placeholder="Select Company"
                                              value={companyOptions.find(
                                                (option) => option.value === field.value
                                              )}
                                              onChange={(selectedOption) =>
                                                form.setFieldValue("companyId", selectedOption.value)
                                              }
                                              onBlur={field.onBlur}
                                            />
                                          )}
                                        </Field>
                                      </FormItem> */}
                    {PERSONAL_INFORMATION.map((field, index, array) => {
                      return (
                        <>
                          <FormItem
                            key={index}
                            label={field?.label}
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
                                onChange={onSelectChange}
                              />
                            )}
                          </FormItem>
                        </>
                      );
                    })}
                  </div>

                </FormContainer>
              </Card>
              <Card className="mt-4 w-3/4 ">
                <FormContainer className=" md:w-full lg:w-1/2">
                  <h5 className="mb-4">Insurance Information</h5>
                  {INSURANCE_CONSTANT.map((g, i) => {
                    return (
                      <Radio
                        className="mr-4 mb-4"
                        name={`insuranceType`}
                        value={g.value}
                        onChange={(date) => setFieldValue('insuranceType', g.value)}
                        checked={g.value === values?.['insuranceType'] ? true : false}
                      >
                        {g.label}
                      </Radio>
                    );
                  })}
                  {values?.['insuranceType'] === 2 && (
                    <>
                      {INSURANCE_FIELD_CONSTANT.map((field, index, array) => {
                        return (
                          <>
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
                    </>
                  )}

                </FormContainer>
              </Card>
            </>
          )}
        </div>
        <div className="flex mt-3 justify-between w-3/4">
          <h3></h3>
          <div className="flex">
            <Button
              size="sm"
              variant="solid"
              onClick={() => navigate(-1)}
              type="button"
              className="flex items-center"
            >
              <MdKeyboardBackspace style={{ fontSize: '20px' }} />
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
      </Form>
    </FormikProvider>
  );
};

export default AddEditSeriveOrder;
