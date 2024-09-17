import React, { useState, useRef, useEffect } from "react";
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
  Dialog,
} from "components/ui";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { postApi, getApi } from "services/CommonService";
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";
import { AiOutlineSave, AiOutlineCloseCircle, AiOutlinePlus } from "react-icons/ai";

// Options for type and group dropdowns
const TYPE_OPTIONS = [
  { label: "LCodes", value: 1 },
  { label: "ICD", value: 2 },
];

const GROUP_OPTIONS = [
  { label: "Consumables", value: 1 },
  { label: "Manufacture", value: 2 },
];

// Footer component for Drawer
const DrawerFooter = ({ editData, onCancel, onSave, isLoading }) => (
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

// Validation schema for Formik
const schema = Yup.object().shape({
  code: Yup.string().required("Required"),
  type: Yup.object().required("Required"),
  group: Yup.object().required("Required"),
  uom: Yup.object().required("Required"),
});

// Initial values for Formik
const initialValues = {
  material: "",
  group: null,   // Set initial values to null or proper structure
  code: "",
  description: "",
  type: null,
  uom: null,  // Ensure initial value is null
};

const AddEditCodes = ({ editData, show, onClose, refreshPage }) => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [uomOptions, setUomOptions] = useState([]);
  const [newUOM, setNewUOM] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch UOM options on component mount
  useEffect(() => {
    getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.UOM })
      .then(response => {
        console.log(response)
        setUomOptions(response?.data?.data.map(uom => ({ label: uom.name, value: uom._id })));
      })
      .catch(error => {
        console.error("Failed to fetch UOM options:", error);
        toast.push(<Notification type="error">Failed to load UOM options.</Notification>);
      });
  }, []);

  // Handle form submission
  const onSubmit = ({ material, code, id, description, type, group, uom }) => {
    setLoading(true);
    const payload = {
      material,
      code,
      description,
      type: type?.value?.toString(),
      group: group?.value?.toString(),
      uomId: uom?.value?.toString(),  // Correctly handle uom value
      modelType: LIST_DATA_API_TYPE.MATERIALS,
    };
    
    console.log("Submitting payload:", payload);  // Log payload to verify

    if (id) {
      payload.id = id;
    }

    postApi(APIS.ADD_EDIT_DATA, payload)
      .then(() => {
        onClose();
        refreshPage();
        toast.push(<Notification type="success">Material saved!</Notification>);
      })
      .catch(error => {
        console.error("Failed to save material:", error);
        toast.push(<Notification type="error">Failed to save material. Please try again.</Notification>);
      })
      .finally(() => setLoading(false));
  };

  // Handle adding new UOM
  const handleAddUOM = () => {
    if (newUOM.trim()) {
      postApi(APIS.ADD_EDIT_DATA, { name: newUOM, modelType: LIST_DATA_API_TYPE.UOM })
        .then(response => {
          const newUOMOption = { label: newUOM, value: response.data.id };
          setUomOptions(prev => [...prev, newUOMOption]);
          setNewUOM("");
          setIsDialogOpen(false);
          toast.push(<Notification type="success">UOM added successfully!</Notification>);
        })
        .catch(error => {
          console.error("Failed to add UOM:", error);
          toast.push(<Notification type="error">Failed to add UOM. Please try again.</Notification>);
        });
    }
  };

  return (
    <>
      <Drawer
        isOpen={show}
        onClose={onClose}
        onRequestClose={onClose}
        closable={false}
        bodyClass="p-0"
        title={editData?.id ? "Edit Items" : "Add Items"}
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
                    label="Material Name"
                    invalid={errors?.material && touched?.material}
                    errorMessage={errors?.material}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="material"
                      placeholder="Enter Material Name"
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label="Group"
                    invalid={errors?.group && touched?.group}
                    errorMessage={errors?.group}
                  >
                    <Select
                      autoComplete="off"
                      size="sm"
                      name="group"
                      className="mb-1 w-full"
                      placeholder="Select Group"
                      options={GROUP_OPTIONS}
                      value={values.group}
                      onChange={selectedValue => {
                        setFieldValue("group", selectedValue);
                      }}
                    />
                  </FormItem>
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
                      onChange={selectedValue => {
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
                      placeholder="Enter Code"
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label="UOM"
                    invalid={errors?.uom && touched?.uom}
                    errorMessage={errors?.uom}
                  >
                    <div className="flex items-center">
                      <Select
                        autoComplete="off"
                        size="sm"
                        name="uom"
                        className="mb-2 w-full"
                        placeholder="Select UOM"
                        options={uomOptions}
                        value={values.uom}
                        onChange={selectedValue => {
                          setFieldValue("uom", selectedValue);
                        }}
                      />
                      <Button
                        icon={<AiOutlinePlus />}
                        onClick={() => setIsDialogOpen(true)}
                        variant="outline"
                        className="ml-2 mb-2"
                        size="sm"
                      >
                        Add New
                      </Button>
                    </div>
                  </FormItem>
                  <FormItem label="Description">
                    <Field
                      type="text"
                      autoComplete="off"
                      name="description"
                      placeholder="Enter Description"
                      component={Input}
                    />
                  </FormItem>
                </FormContainer>
              </Form>
            )}
          </Formik>
        </AdaptableCard>
      </Drawer>

      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="Add New UOM">
        <div className="p-6">
          <Input
            type="text"
            value={newUOM}
            onChange={e => setNewUOM(e.target.value)}
            placeholder="Enter new UOM"
            className="mb-4"
          />
          <Button
            icon={<AiOutlinePlus />}
            onClick={handleAddUOM}
            variant="solid"
          >
            Add
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default AddEditCodes;
