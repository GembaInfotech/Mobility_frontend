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
  Select,
} from "components/ui";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { postApi } from "services/CommonService";
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";
import { AiOutlineSave, AiOutlineCloseCircle } from "react-icons/ai";

const TYPE_OPTIONS = [
  { label: "LCodes", value: 1 },
  { label: "ICD", value: 2 },
];

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

const schema = Yup.object().shape({
  code: Yup.string().required("Required"),
  type: Yup.object().required("Required"),
});

const initialValues = {
  code: "",
  description: "",
  type: "",
};

const AddEditCodes = ({ editData, show, onClose, refreshPage }) => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  //// SUBMIT TAGS HANDLER///////

  const onSubmit = ({ code, id, description, type }) => {
    setLoading(true);
    let payload = {
      code,
      description,
      type: type?.value?.toString(),
      modelType: LIST_DATA_API_TYPE.CODES,
    };

    if (id) {
      payload.id = id;
    }

    postApi(APIS.ADD_EDIT_DATA, payload)
      .then(() => {
        onClose();
        refreshPage();
        toast.push(<Notification type="success">Code saved!</Notification>);
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
      title={editData?.id ? "Edit Code" : "Add Code"}
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
          validationSchema={schema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form className="p-5">
              <FormContainer>
              <FormItem
                  label="Type"
                  invalid={errors?.type && touched?.type}
                  errorMessage={errors?.type}
                >
                  <Select
                    autoComplete="off"
                    size="sm"
                    name="type"
                    className="mb-1 w-full"
                    placeholder="Select Type"
                    options={TYPE_OPTIONS}
                    value={values.type}
                    onChange={(selectedValue) => {
                      setFieldValue("type", selectedValue);
                    }}
                  />
                </FormItem>
                <FormItem
                  label="Code"
                  invalid={errors?.code && touched?.code}
                  errorMessage={errors?.code}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="code"
                    placeholder="Enter Code "
                    component={Input}
                  />
                </FormItem>
                <FormItem label="Description">
                  <Field
                    type="text"
                    autoComplete="off"
                    name="description"
                    placeholder="Enter Description "
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

export default AddEditCodes;
