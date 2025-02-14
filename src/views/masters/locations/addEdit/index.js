import React, { useRef, useState } from "react";
import { AdaptableCard } from "components/shared";
import {
  Button,
  Drawer,
  Input,
  FormItem,
  FormContainer,
  toast,
  Notification,
} from "components/ui";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { postApi } from "services/CommonService";
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";
import { AiOutlineSave, AiOutlineCloseCircle } from "react-icons/ai";

const DrawerFooter = ({ editData, onCancel, onSave, isLoading }) => {
  return (
    <div className="text-right w-full">
      <Button
        className="mr-2"
        onClick={onCancel}
        disabled={isLoading}
        icon={<AiOutlineCloseCircle />}
      >
        Cancel
      </Button>
      <Button
        variant="solid"
        type="submit"
        onClick={onSave}
        disabled={isLoading}
        icon={<AiOutlineSave />}
      >
        {editData?.id ? "Update" : "Save"}
      </Button>
    </div>
  );
};

const Schema = Yup.object().shape({
  name: Yup.string().required("Required"),
});

const initialValues = {
  name: "",
};

const AddEditDeviceType = ({ editData, show, onClose, refreshPage }) => {
  const savedHospitalId = localStorage.getItem("selectedHospitalId");

  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const onSubmit = ({ name, id }) => {
    setLoading(true);
    const payload = {
      name,
      modelType : LIST_DATA_API_TYPE.LOCATIONS,
      companyId: savedHospitalId
    };

    if (id) {
      payload.id = id;
    }

    postApi(APIS.ADD_EDIT_DATA, payload)
      .then(() => {
        onClose();
        refreshPage();
        toast.push(
          <Notification type="success">Location saved!</Notification>
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <Drawer
      isOpen={show}
      onClose={onClose}
      onRequestClose={onClose}
      closable={false}
      bodyClass="p-0"
      title={editData?.id ? "Edit Location" : "Add Location"}
      footer={
        <DrawerFooter
          onCancel={onClose}
          onSave={() => formRef?.current?.submitForm()}
          isLoading={loading}
          editData={editData}
        />
      }
    >
      <AdaptableCard>
        <Formik
          innerRef={formRef}
          initialValues={editData ? editData : initialValues}
          validationSchema={Schema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form className="p-5">
              <FormContainer>
                <FormItem
                  label="Location"
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
              </FormContainer>
            </Form>
          )}
        </Formik>
      </AdaptableCard>
    </Drawer>
  );
};

export default AddEditDeviceType;
