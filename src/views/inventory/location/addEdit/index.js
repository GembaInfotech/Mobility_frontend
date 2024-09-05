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
    <div className="w-full text-right">
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
  address: Yup.string().required("Required"), // Validation for address
  storeManager: Yup.string().required("Required"), // Validation for store manager
});

const initialValues = {
  name: "",
  address: "", // Initial value for address
  storeManager: "", // Initial value for store manager
};

const AddEditDeviceType = ({ editData, show, onClose, refreshPage }) => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const onSubmit = ({ name, address, storeManager, id }) => {
    setLoading(true);
    const payload = {
      name,
      address, 
      storeManager,
      modelType: LIST_DATA_API_TYPE.INVENTORY
    };

    if (id) {
      payload.id = id;
    }

    postApi(APIS.ADD_EDIT_DATA, payload)
      .then(() => {
        onClose();
        refreshPage();
        toast.push(
          <Notification type="success">Inventory saved!</Notification>
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
          {({ errors, touched }) => (
            <Form className="p-5">
              <FormContainer>
                <FormItem
                  label="Inventory Name"
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
                <FormItem
                  label="Address"
                  invalid={errors?.address && touched?.address}
                  errorMessage={errors?.address}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="address"
                    placeholder="Enter Address"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  label="Store Manager"
                  invalid={errors?.storeManager && touched?.storeManager}
                  errorMessage={errors?.storeManager}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="storeManager"
                    placeholder="Enter Store Manager"
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
