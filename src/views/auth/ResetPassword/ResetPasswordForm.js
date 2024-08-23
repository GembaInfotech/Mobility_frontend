import React, { useState } from "react";
import {
  Button,
  FormItem,
  FormContainer,
  Alert,
  toast,
  Notification,
} from "components/ui";
import { PasswordInput } from "components/shared";
import useTimeOutMessage from "utils/hooks/useTimeOutMessage";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useParams, useSearchParams } from "react-router-dom";
import { postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Please enter a password")
    .min(8, "Password must have at least 8 characters"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Your passwords do not match"
  ),
});

const initialValues = {
  password: "",
  confirmPassword: "",
};

const ResetPasswordForm = (props) => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const userType = searchParams.get("userType");
  const { disableSubmit = false, className, signInUrl = "/sign-in" } = props;
  const [resetComplete, setResetComplete] = useState(false);
  const [message, setMessage] = useTimeOutMessage();

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    const { password } = values;
    const payload = {
      id: id,
      userType: +userType,
      password: password,
    };

    postApi(APIS.UPDATE_PASSOWRD, { ...payload })
      .then((res) => {
        toast.push(
          <Notification type="success">Changed Successfully</Notification>
        );
        setResetComplete(true);
        resetForm();
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className={className}>
      <div className="mb-6">
        {resetComplete ? (
          <>
            <h3 className="mb-1">Reset done</h3>
            <p>Your password has been successfully reset</p>
          </>
        ) : (
          <>
            <h3 className="mb-1">Set new password</h3>
            <p>Your new password must different to previous password</p>
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
        onSubmit={onSubmit}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <>
                <FormItem
                  label="Password"
                  invalid={errors.password && touched.password}
                  errorMessage={errors.password}
                >
                  <Field
                    autoComplete="off"
                    name="password"
                    placeholder="Password"
                    component={PasswordInput}
                  />
                </FormItem>
                <FormItem
                  label="Confirm Password"
                  invalid={errors.confirmPassword && touched.confirmPassword}
                  errorMessage={errors.confirmPassword}
                >
                  <Field
                    autoComplete="off"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    component={PasswordInput}
                  />
                </FormItem>
                <Button
                  block
                  loading={isSubmitting}
                  variant="solid"
                  type="submit"
                >
                  {isSubmitting ? "Submiting..." : "Submit"}
                </Button>
              </>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;
