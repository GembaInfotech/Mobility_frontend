import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Button,
  Card,
  FormContainer,
  FormItem,
  Input,
  Select,
  toast,
  Notification,
} from "components/ui";
import { AiOutlineSave, AiOutlineCloseCircle } from "react-icons/ai";
import { getApi, postApi } from "services/CommonService";
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";
import { useNavigate, useLocation } from "react-router-dom";

// Validation schema
const validationSchema = Yup.object().shape({
  code: Yup.string().required("L Code is required"),
  stockType: Yup.object().required("Stock Entry Type is required"),
  quantity: Yup.number()
    .required("Quantity is required")
    .positive("Quantity must be positive")
    .integer("Quantity must be an integer"),
  location: Yup.string().required("Location is required"),
});

const initialValues = {
  code: "",
  description: "",
  stockType: { label: "Material Receipt", value: 1 }, // Default value for stockType
  quantity: "",
  location: "",
};

const AddEditStockes = ({ onClose, refreshPage }) => {
  const [loading, setLoading] = useState(false);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [editData, setEditData] = useState(initialValues);

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch data on mount
  useEffect(() => {
    if (location.state?.editData) {
      setEditData(location.state.editData);
    }

    // Fetch materials
    getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.CODES })
      .then((res) => {
        if (res && res.data && Array.isArray(res.data.data)) {
          const filteredData = res.data.data.filter((item) => item.type === 1);
          const materials = filteredData.map((item) => ({
            label: item.code,
            value: item._id,
            description: item.description,
            uom: item?.uomId?.name,
            uomId: item?.uomId?._id,
          }));
          setMaterialOptions(materials);
        } else {
          toast.push(
            <Notification type="error">No Materials found!</Notification>
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching materials:", error);
        toast.push(
          <Notification type="error">Failed to load Materials</Notification>
        );
      });

    // Fetch warehouses
    getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.LOCATIONS })
      .then((res) => {
        if (res && res.data && Array.isArray(res.data.data)) {
          const locations = res.data.data.map((location) => ({
            label: location.name,
            value: location._id,
          }));
          setWarehouseOptions(locations);
        } else {
          toast.push(
            <Notification type="error">No Warehouses found!</Notification>
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching warehouses:", error);
        toast.push(
          <Notification type="error">Failed to load Warehouses</Notification>
        );
      });
  }, [location.state?.editData]);

  const onSubmit = (values, { setSubmitting }) => {
    setLoading(true);
  
    // Log the values before submitting
    console.log("Form Data being submitted:", values);
  
    const payload = {
      lcodeId: values.code,
      stockType: values.stockType?.value, // Always 1, i.e., Material Receipt
      quantity: values.quantity,
      locationId: values.location,
      uomId: values.uomId,
      modelType: LIST_DATA_API_TYPE.STOCK_ENTRY,
    };
  
    // API call to save the data
    postApi(APIS.ADD_EDIT_DATA, payload)
      .then(() => {
        navigate(-1);
        toast.push(
          <Notification type="success">Stock saved successfully!</Notification>
        );
      })
      .catch((error) => {
        console.error("Error saving stock:", error);
        toast.push(<Notification type="error" message="Save failed!" />);
      })
      .finally(() => {
        setLoading(false);
        setSubmitting(false); // Ensure the button is re-enabled
      });
  };

  return (
    <Formik
      initialValues={editData}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ errors, touched, values, setFieldValue, isSubmitting }) => (
        <Form>
          <div className="flex mb-3 justify-between w-3/4">
            <h3>{editData.code ? "Edit Stock" : "Add Stock"}</h3>
            <div className="flex">
              <Button
                size="sm"
                className="ltr:mr-3 rtl:ml-3"
                onClick={() => navigate(-1)}
                icon={<AiOutlineCloseCircle />}
                type="button"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="solid"
                loading={isSubmitting || loading} // Handle both isSubmitting and loading states
                icon={<AiOutlineSave />}
                type="submit"
              >
                {editData.code ? "Update" : "Save"}
              </Button>
            </div>
          </div>
          <Card className="mt-2.5 w-3/4">
            <FormContainer className="md:w-full lg:w-1/2">
              {/* Stock Entry Type - Removed Select */}
              <FormItem label="Stock Entry Type">
                <Input
                  value="Material Receipt" // Display as text, no need for user interaction
                  readOnly
                  size="sm"
                />
              </FormItem>

              {/* Material Code */}
              <FormItem
                label="LCode"
                invalid={errors?.code && touched?.code}
                errorMessage={errors?.code}
              >
                <Select
                  size="sm"
                  name="lcode"
                  placeholder="Select LCode"
                  options={materialOptions}
                  value={materialOptions.find(
                    (option) => option.value === values.code
                  ) || null}
                  onChange={(selectedOption) => {
                    setFieldValue("code", selectedOption.value); // Update 'lcode' value
                    setFieldValue("description", selectedOption.description); // Set description
                    setFieldValue("uom", selectedOption.uom); // Set UOM
                    setFieldValue("uomId", selectedOption.uomId); // Set UOM ID
                  }}
                />
              </FormItem>

              {/* Material Name and UOM */}
              <FormItem label="Description">
                <Field
                  as={Input}
                  size="sm"
                  name="description"
                  value={values.description}
                  readOnly
                />
              </FormItem>
              <FormItem label="UOM">
                <Field
                  as={Input}
                  size="sm"
                  name="uom"
                  value={values.uom}
                  readOnly
                />
              </FormItem>

              {/* Quantity */}
              <FormItem
                label="Quantity"
                invalid={errors.quantity && touched.quantity}
                errorMessage={errors.quantity}
              >
                <Field
                  as={Input}
                  type="number"
                  name="quantity"
                  placeholder="Add Quantity"
                  value={values.quantity}
                />
              </FormItem>

              {/* Location */}
              <FormItem
                label="Location"
                invalid={errors.location && touched.location}
                errorMessage={errors.location}
              >
                <Select
                  name="Location"
                  options={warehouseOptions}
                  placeholder="Select Location"
                  value={warehouseOptions.find(
                    (option) => option.value === values.location
                  )}
                  onChange={(selectedOption) => {
                    setFieldValue("location", selectedOption.value); // Update location value
                  }}
                />
              </FormItem>
            </FormContainer>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default AddEditStockes;
