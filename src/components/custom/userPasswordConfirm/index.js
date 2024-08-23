import React from "react";
import {
  Button,
  Dialog,
  FormContainer,
  FormItem,
  toast,
  Notification,
} from "components/ui";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { PasswordInput } from "components/shared";
import { postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { UPDATE_TOAST } from "constants/app.constant";

const FORM_FIELD = [
  { label: "Password", identifier: "password" },
  { label: "Confirm Password", identifier: "confirmPassword" },
];

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Please enter a password")
    .min(8, "Password must have at least 8 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Your passwords do not match")
    .required("Please enter confirm password"),
});

const initialValues = {
  password: "",
  confirmPassword: "",
};

const UserPasswordConfirm = ({
  selectedId,
  onDialogClose,
  isOpen,
  setRefresh,
}) => {
  const onSubmit = (payload) => {
    postApi(APIS.USER_PASSWORD_RESET, {
      id: selectedId,
      password: payload?.password,
    }).then((res) => {
      toast.push(<Notification type="success">{UPDATE_TOAST}</Notification>);
      setRefresh((s) => !s);
      onDialogClose();
    });
  };
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onDialogClose}
      onRequestClose={onDialogClose}
      contentClassName="pb-0 px-0 mt-36 min-w-36"
    >
      <div className="px-5 pb-5">
        <h5 className="mb-4">Reset Password</h5>
        {/* <p>{des}</p> */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form>
              <FormContainer>
                <>
                  {FORM_FIELD.map((field, index) => {
                    return (
                      <FormItem
                        key={`${field.identifier}-${index}`}
                        label={field.label}
                        invalid={
                          errors?.[field.identifier] &&
                          touched?.[field.identifier]
                        }
                        errorMessage={errors?.[field.identifier]}
                      >
                        <Field
                          autoComplete="off"
                          name={field.identifier}
                          placeholder={field.label}
                          component={PasswordInput}
                        />
                      </FormItem>
                    );
                  })}
                  <div className="text-right mt-6">
                    <Button
                      className="ltr:mr-2 rtl:ml-2"
                      variant="plain"
                      onClick={onDialogClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="ltr:mr-2 rtl:ml-2"
                      loading={isSubmitting}
                      variant="solid"
                      type="submit"
                    >
                      {isSubmitting ? "Reseting..." : "Reset"}
                    </Button>
                  </div>
                </>
              </FormContainer>
            </Form>
          )}
        </Formik>
      </div>
    </Dialog>
  );
};

export default UserPasswordConfirm;
