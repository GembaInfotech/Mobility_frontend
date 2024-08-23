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
} from "components/ui";
import { Form, Field, useFormik, FormikProvider } from "formik";
import MixComponent from "./mixComponent";
import { useParams, useNavigate } from "react-router-dom";
import { postApi, getApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { UPDATE_TOAST, ADDED_TOAST } from "constants/app.constant";
import * as Yup from "yup";
import ImageField from "./imageField";
import { PROVIDER_FIELD_CONSTANT } from "../providerConstant";

const providerSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  dob: Yup.string().required("Required"),
  gender: Yup.string().required("Required"),
  email: Yup.string().email().required("Required"),
  phoneNumber: Yup.string().required(),
  companyName: Yup.string().required("Required"),
});

const providerSchema2 = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  dob: Yup.string().required("Required"),
  gender: Yup.string().required("Required"),
  email: Yup.string().email().required("Required"),
  phoneNumber: Yup.string().required(),
});

const initialValues = {
  userSubType: 1,
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  gender: 1,
  dob: new Date(),
  address: "",
  state: "",
  phoneNumber: "",
  pincode: "",
  city: "",
  countryCode: "+1",
  alternateCountryCode: "+1",
  alternatePhoneNumber: "",
  companyName: "",
};

const AddEditProvider = () => {
  const { id } = useParams();
  const [editdata, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getApi(APIS.GET_USERS, {
        userType: 1,
        userId: id,
      })
        .then((res) => {
          const data = res?.data?.data;
          setEditData({
            userSubType: data?.userSubType,
            firstName: data?.firstName,
            lastName: data?.lastName,
            email: data?.email,
            gender: data?.gender,
            dob: data?.dob,
            image: data?.imageUrlOriginal
              ? [
                  {
                    original: data?.imageUrlOriginal,
                    thumbnail: data?.imageUrlThumbnail,
                  },
                ]
              : [],
            countryCode: data?.countryCode !== null ? data?.countryCode : "+1",
            country: data?.country,
            companyName: data?.companyName,
            pincode: data?.pincode,
            city: data?.city,
            state: { label: data?.state, value: data?.state },
            alternateCountryCode:
              data?.alternateCountryCode !== null
                ? data?.alternateCountryCode
                : "+1",
            address: data?.address,
            phoneNumber:
              data?.countryCode !== null && data?.phoneNumber !== null
                ? `${data?.countryCode}${data?.phoneNumber}`
                : "",
            alternatePhoneNumber:
              data?.alternateCountryCode !== null &&
              data?.alternatePhoneNumber !== null
                ? `${data?.alternateCountryCode}${data?.alternatePhoneNumber}`
                : "",
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

    payload.alternatePhoneNumber = payload?.alternatePhoneNumber?.replace(
      payload?.alternateCountryCode,
      ""
    );
    payload.phoneNumber = payload?.phoneNumber?.replace(
      payload?.countryCode,
      ""
    );

    //Check for Empty Phone number

    if (payload.alternatePhoneNumber === "") {
      delete payload.alternatePhoneNumber;
    }
    if (payload.phoneNumber === "") {
      delete payload.phoneNumber;
    }

    ///setup the + sign with country code if it was not there

    if (!payload?.alternateCountryCode?.includes("+")) {
      payload.alternateCountryCode = `+${payload.alternateCountryCode}`;
    }
    if (!payload?.countryCode?.includes("+")) {
      payload.countryCode = `+${payload.countryCode}`;
    }
    if (payload.state) {
      payload.state = payload?.state?.label;
    }
    if (payload?.image && payload?.image?.length > 0) {
      payload.original = payload.image[0].original;
      payload.thumbnail = payload.image[0].thumbnail;
    }
    delete payload.image;
    postApi(APIS.ADD_EDIT_PROVIDER, { ...payload }).then((res) => {
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
    validationSchema: id ? providerSchema2 : providerSchema,
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
          <h3>{id ? "Edit Provider" : "Add Provider"}</h3>
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
                  <ImageField {...{ touched, errors, values, setFieldValue }} />
                  {PROVIDER_FIELD_CONSTANT.map((field, index, array) => {
                    return (
                      <>
                        {field?.title && (
                          <h6 className="my-3">{field?.title}</h6>
                        )}

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
            </>
          )}
        </div>
      </Form>
    </FormikProvider>
  );
};

export default AddEditProvider;
