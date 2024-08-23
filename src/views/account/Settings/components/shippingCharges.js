import React, { useRef, useEffect, useState } from "react";
import {
  FormItem,
  Button,
  Notification,
  toast,
  FormContainer,
  Input,
  Spinner,
} from "components/ui";
import FormDesription from "./FormDesription";
import { Field, Form, Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { postApi, getApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { HiOutlinePlus } from "react-icons/hi";
import { AiOutlineDelete } from "react-icons/ai";
import { UPDATE_TOAST } from "constants/app.constant";

const defaultFieldValue = { max: "", min: "", percentage: "" };

export const FORM_FIELD_ARRAY = [
  {
    type: "number",
    key: "min",
    label: "Order min value",
    placeholder: "Enter order min value",
    component: Input,
    width: "100%",
  },
  {
    type: "number",
    key: "max",
    label: "Order max value",
    placeholder: "Enter order max value",
    component: Input,
    width: "100%",
  },
  {
    type: "number",
    key: "percentage",
    label: "Shipping charge (%)",
    placeholder: "Enter shipping charge (%)",
    component: Input,
    width: "112%",
  },
];

const validationSchema = Yup.object().shape({
  shippingRules: Yup.array().of(
    Yup.object().shape({
      max: Yup.string().required("Required"),
      min: Yup.string().required("Required"),
      percentage: Yup.string().required("Required"),
    })
  ),
});

const ShippingCharges = () => {
  const arrayHelpersRef = useRef(null);
  const [editData, setEditData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const onFormSubmit = (values, setSubmitting) => {
    postApi(APIS.ADD_EDIT_POLICIES, { ...values }).then(() => {
      toast.push(<Notification type="success">{UPDATE_TOAST}</Notification>);
      setSubmitting(false);
      setRefresh(!refresh);
    });
  };

  useEffect(() => {
    getApi(APIS.GET_ADMIN_DEFAULT)
      .then((res) => {
        setEditData({ shippingRules: res?.data?.shippingRules });
      })
      .finally(() => setLoading(false));
  }, [refresh]);

  return (
    <>
      {loading ? (
        <div className="flex h-[70vh] justify-center items-center	">
          <Spinner />
        </div>
      ) : (
        <Formik
          initialValues={editData}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            setTimeout(() => {
              onFormSubmit(values, setSubmitting);
            }, 1000);
          }}
        >
          {({
            values,
            touched,
            errors,
            isSubmitting,
            resetForm,
            setFieldValue,
          }) => {
            const validatorProps = { touched, errors };

            return (
              <Form>
                <FormContainer>
                  <FormDesription title="Shipping Chargres Policies" />
                  <div className="mt-4 ltr:text-right">
                    <Button
                      className="ltr:mr-2 rtl:ml-2"
                      type="button"
                      onClick={resetForm}
                    >
                      Reset
                    </Button>

                    <Button
                      variant="solid"
                      type="submit"
                      loading={isSubmitting}
                    >
                      {isSubmitting ? "Updating" : "Update"}
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="twoTone"
                    icon={<HiOutlinePlus />}
                    type="button"
                    onClick={() =>
                      arrayHelpersRef.current.push(defaultFieldValue)
                    }
                  />
                  <FieldArray
                    name="shippingRules"
                    render={(arrayHelpers) => {
                      arrayHelpersRef.current = arrayHelpers;
                      return (
                        <div className="my-5 w-[75%] ">
                          {values?.shippingRules?.map((fields, i) => (
                            <div className="w-full flex justify-between items-center mb-5">
                              {FORM_FIELD_ARRAY?.map((item, index) => {
                                return (
                                  <div>
                                    <FormItem
                                      key={index}
                                      label={
                                        i === 0 ? (
                                          item.label
                                        ) : (
                                          <div className="invisible text-xs text-red-500">
                                            Error
                                          </div>
                                        )
                                      }
                                      className="ml-3"
                                      invalid={
                                        errors?.shippingRules?.[i]?.[
                                          item?.key
                                        ] &&
                                        touched?.shippingRules?.[i]?.[item?.key]
                                      }
                                      errorMessage={
                                        errors?.shippingRules?.[i]?.[item?.key]
                                      }
                                    >
                                      <Field
                                        key={`${i}-${item?.key}-${index}`}
                                        type={item.type}
                                        style={{ width: item?.width }}
                                        autoComplete="off"
                                        defaultValue={
                                          values?.shippingRules?.[i]?.[
                                            item?.key
                                          ]
                                        }
                                        name={`shippingRules.${i}.${item?.key}`}
                                        onChange={(e) => {
                                          setFieldValue(
                                            `shippingRules.${i}.${item?.key}`,
                                            e?.target?.value
                                          );
                                        }}
                                        placeholder={item.placeholder}
                                        component={item?.component}
                                      />
                                    </FormItem>
                                  </div>
                                );
                              })}
                              <div className="flex-col flex-col	">
                                <Button
                                  className="ml-3"
                                  size="sm"
                                  variant="twoTone"
                                  color="red-600"
                                  icon={<AiOutlineDelete />}
                                  type="button"
                                  onClick={() =>
                                    arrayHelpersRef.current.remove(i)
                                  }
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                </FormContainer>
              </Form>
            );
          }}
        </Formik>
      )}
    </>
  );
};

export default ShippingCharges;
