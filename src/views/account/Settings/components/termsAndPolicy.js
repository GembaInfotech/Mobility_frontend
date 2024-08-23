import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  FormContainer,
  Notification,
  toast,
  Button,
  FormItem,
} from "components/ui";
import FormDesription from "./FormDesription";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { postApi, getApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { UPDATE_TOAST } from "constants/app.constant";

const editorApiKey = "dxjo213hjt1wshbuab85nevoef38tclcr9gmx69p83f3r7ms";
const editorSettings = {
  plugins: [
    "advlist",
    "autolink",
    "lists",
    "link",
    "image",
    "charmap",
    "preview",
    "anchor",
    "searchreplace",
    "visualblocks",
    "code",
    "fullscreen",
    "insertdatetime",
    "media",
    "table",
    "code",
    "help",
    "wordcount",
  ],
  toolbar:
    "undo redo | blocks | " +
    "bold italic forecolor | alignleft aligncenter " +
    "alignright alignjustify | bullist numlist outdent indent | " +
    "removeformat | help",
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
};

const FORM_FIELDS = [
  { label: "Hippa Agreement", name: "hippaAgreement" },
  { label: "About Mobility", name: "aboutMobility" },
  {
    label: "Cancellation And Refund Policy",
    name: "cancellationAndRefundPolicy",
  },
  {
    label: "Service Terms",
    name: "serviceTerms",
  },
  {
    label: "Privacy Policy",
    name: "privacyPolicy",
  },
];

const validationSchema = Yup.object().shape({
  hippaAgreement: Yup.string().required("Hippa Agreement"),
  aboutMobility: Yup.string().required("About Mobility"),
  cancellationAndRefundPolicy: Yup.string().required(
    "Cancellation And Refund Policy"
  ),
  serviceTerms: Yup.string().required("Service Terms"),
  privacyPolicy: Yup.string().required("Privacy Policy"),
});

const TermsAndPolicy = () => {
  const [refresh, setRefresh] = useState(false);
  const [editData, setEditdata] = useState({
    aboutMobility: "",
    cancellationAndRefundPolicy: "",
    hippaAgreement: "",
    serviceTerms: "",
    privacyPolicy: "",
  });

  useEffect(() => {
    getApi(APIS.GET_ADMIN_DEFAULT).then((res) => {
      setEditdata({
        aboutMobility: res?.data?.aboutMobility,
        cancellationAndRefundPolicy: res?.data?.cancellationAndRefundPolicy,
        hippaAgreement: res?.data?.hippaAgreement,
        serviceTerms: res?.data?.serviceTerms,
        privacyPolicy: res?.data?.privacyPolicy,
      });
    });
  }, [refresh]);

  const onFormSubmit = (values, setSubmitting) => {
    postApi(APIS.ADD_EDIT_POLICIES, { ...values }).then((res) => {
      toast.push(<Notification type="success">{UPDATE_TOAST}</Notification>);
    });
    setRefresh(!refresh);
    setSubmitting(false);
  };

  return (
    <>
      <Formik
        initialValues={editData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          setTimeout(() => {
            onFormSubmit(values, setSubmitting);
          }, 1000);
        }}
        enableReinitialize
      >
        {({
          values,
          touched,
          errors,
          isSubmitting,
          resetForm,
          setFieldValue,
        }) => {
          return (
            <Form>
              <FormContainer>
                <div className="mt-4 ltr:text-right">
                  <Button variant="solid" loading={isSubmitting} type="submit">
                    {isSubmitting ? "Saving" : "Save"}
                  </Button>
                </div>
                {FORM_FIELDS.map((field, index) => {
                  return (
                    <>
                      <FormDesription title={field.label} />
                      <FormItem
                        className="mt-5 mb-7"
                        invalid={errors?.[field.name] && touched?.[field.name]}
                        errorMessage={errors?.[field.name]}
                      >
                        <Editor
                          apiKey={editorApiKey}
                          init={editorSettings}
                          value={values?.[field.name]}
                          onEditorChange={(event) =>
                            setFieldValue(`${[field.name]}`, event)
                          }
                        />
                      </FormItem>
                    </>
                  );
                })}
              </FormContainer>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
export default TermsAndPolicy;
