import React, { useRef, useState, useEffect } from "react";
import { AdaptableCard } from "components/shared";
import Select from "components/ui/Select";
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
import { postApi, getApi } from "services/CommonService";
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
  address: Yup.string().required("Required"),
  storeManager: Yup.string().required("Required"),
  location: Yup.string().required("Required"),
  lcode: Yup.string().required("Required"),
  quantity: Yup.number().required("Required").min(0, "Quantity cannot be negative"), // Add quantity validation
});

const initialValues = {
  name: "",
  address: "",
  storeManager: "",
  location: "",
  lcode: "",
  quantity: 1, // Initial value for quantity
};

const AddEditDeviceType = ({ editData, show, onClose, refreshPage }) => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [lcodeOptions, setLcodeOptions] = useState([]);

  // Fetch registered locations and lcodes from the backend
  useEffect(() => {
    if (show) {
      // Fetch locations
      getApi(APIS.LIST_DATA, {
        type: LIST_DATA_API_TYPE.LOCATIONS,
      })
        .then((res) => {
          if (res && res.data && res.data.data) {
            const locations = res.data.data.map((location) => ({
              label: location.name,
              value: location._id,
            }));
            setLocationOptions(locations);
          } else {
            toast.push(
              <Notification type="error">No locations found!</Notification>
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching locations: ", error);
          toast.push(
            <Notification type="error">Failed to load locations</Notification>
          );
        });

      // Fetch lcodes
      getApi(APIS.LIST_DATA, {
        type: LIST_DATA_API_TYPE.CODES,
      })
        .then((res) => {
          if (res && res.data && res.data.data) {
            console.log(res);
            const lcodes = Array.isArray(res.data.data)
              ? res.data.data
                  .filter((item) => item.type === 1) // Filter by type 1
                  .map((item) => ({
                    label: item.code, // Use code for display
                    value: item._id, // Use _id as value
                  }))
              : [];
            setLcodeOptions(lcodes);
          } else {
            toast.push(
              <Notification type="error">No lcodes found!</Notification>
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching lcodes: ", error);
          toast.push(
            <Notification type="error">Failed to load lcodes</Notification>
          );
        });
    }
  }, [show]);

  const onSubmit = ({ name, address, storeManager, location, lcode, quantity, id }) => {
    setLoading(true);
    const payload = {
      name,
      address,
      storeManager,
      location,
      lcode, // Include the selected lcode
      quantity, // Include quantity
      modelType: LIST_DATA_API_TYPE.INVENTORY,
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
          {({ errors, touched, setFieldValue, values }) => (
            <Form className="p-5">
              <FormContainer>
                {/* <FormItem
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
                </FormItem> */}
                <FormItem
                  label="Location"
                  invalid={errors?.location && touched?.location}
                  errorMessage={errors?.location}
                >
                  <Select
                    placeholder="Select Location"
                    options={locationOptions}
                    value={locationOptions.find(
                      (option) => option.value === values.location
                    )}
                    onChange={(selectedOption) =>
                      setFieldValue("location", selectedOption.value)
                    }
                  />
                </FormItem>
                <FormItem
                  label="Lcode"
                  invalid={errors?.lcode && touched?.lcode}
                  errorMessage={errors?.lcode}
                >
                  <Select
                    placeholder="Select Lcode"
                    options={lcodeOptions} // Dynamically load lcode options filtered by type 1
                    value={lcodeOptions.find(
                      (option) => option.value === values.lcode
                    )}
                    onChange={(selectedOption) =>
                      setFieldValue("lcode", selectedOption.value)
                    } // Set lcode value in Formik
                  />
                </FormItem>
                <FormItem
                  label="Quantity"
                  invalid={errors?.quantity && touched?.quantity}
                  errorMessage={errors?.quantity}
                >
                  <div className="flex items-center">
                    <Button
                      type="button"
                      onClick={() => setFieldValue("quantity", Math.max(0, values.quantity - 1))}
                      className="mr-2"
                    >
                      -
                    </Button>
                    <Field
                      type="number"
                      name="quantity"
                      min="0"
                      component={Input}
                      className="text-center"
                    />
                    <Button
                      type="button"
                      onClick={() => setFieldValue("quantity", values.quantity + 1)}
                      className="ml-2"
                    >
                      +
                    </Button>
                  </div>
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