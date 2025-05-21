import React, { useState } from "react";
import {
  Input,
  Button,
  FormItem,
  FormContainer,
  Notification,
  Alert,
  toast,
} from "components/ui";
import { ActionLink } from "components/shared";
import useTimeOutMessage from "utils/hooks/useTimeOutMessage";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { postApi,getApi } from "services/CommonService";
import { APIS } from "constants/api.constant";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Please enter your email"),
});

const initialValues = {
  email: "",
};

const ForgotPasswordForm = (props) => {
  const { disableSubmit = false, className, signInUrl = "/sign-in" } = props;
  const [emailSent, setEmailSent] = useState(false);
  const [message, setMessage] = useTimeOutMessage();

  const onSendMail = async (values, setSubmitting) => {
    setSubmitting(true);
    postApi(APIS.FORGET_PASSWORD, { userType: 0, ...values })
      .then((res) => {
        toast.push(
          <Notification type="success">Link Sent Successfully</Notification>
        );
        setEmailSent(true);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const onVerifyOTP = () =>{
    getApi(APIS.FORGET_PASSWORD)
     .then((res) => {
        toast.push(
          <Notification type="success">OTP Verified Successfully</Notification>
        )
     })
  }

  return (
    <div className={className}>
      <div className="mb-6">
        {emailSent ? (
          <>
            <h3 className="mb-1">OTP Verification</h3>
            <Input/>
            <button onsubmit={onVerifyOTP}>Verify OTP</button>
          </>
        ) : (
          <>
            <h3 className="mb-1">Forgot Password</h3>
            <p>Please enter your email address to receive a reset link</p>
          </>
        )}
      </div>

      {message && (
        <Alert className="mb-4" type="danger" showIcon>
          {message}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSendMail(values, setSubmitting);
          } else {
            setSubmitting(false);
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <div className={emailSent ? "hidden" : ""}>
                <FormItem
                  label="Email Address"
                  invalid={errors.email && touched.email}
                  errorMessage={errors.email}
                >
                  <Field
                    type="email"
                    autoComplete="off"
                    name="email"
                    placeholder="Email"
                    component={Input}
                  />
                </FormItem>
              </div>
              <Button
                block
                loading={isSubmitting}
                variant="solid"
                type="submit"
              >
                {emailSent ? "Resend Email" : "Send Email"}
              </Button>
              <div className="mt-4 text-center">
                <span>Back to </span>
                <ActionLink to={signInUrl}>Sign in</ActionLink>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPasswordForm;
