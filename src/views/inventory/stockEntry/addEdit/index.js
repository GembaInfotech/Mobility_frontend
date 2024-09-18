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
  materialNo: Yup.string().required("Material Code is required"),
  stockType: Yup.object().required("Stock Entry Type is required"),
  quantity: Yup.number()
    .required("Quantity is required")
    .positive("Quantity must be positive")
    .integer("Quantity must be an integer"),
  sourceWareHouse: Yup.string().required("Source Warehouse is required"),
  targetWareHouse: Yup.string().when("stockType", {
    is: (val) => val.value === 2,
    then: Yup.string().required("Target Warehouse is required"),
  }),
});

const initialValues = {
  materialNo: "",
  materialName: "",
  stockType: "",
  quantity: "",
  sourceWareHouse: "",
  targetWareHouse: "",
  availableQuantity: "",
};

const AddEditStockes = ({ onClose, refreshPage }) => {
  const [loading, setLoading] = useState(false);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [filteredWarehouseOptions, setFilteredWarehouseOptions] = useState([]);
  const [availableQuantities, setAvailableQuantities] = useState({});
  const [editData, setEditData] = useState(initialValues);

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch data on mount
  useEffect(() => {
    if (location.state?.editData) {
      setEditData(location.state.editData);
    }
    
    // Fetch materials
    getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.MATERIALS })
      .then((res) => {
        if (res && res.data && Array.isArray(res.data.data)) {

          // console.log("dataaaaa", res.data);
          
          const materials = res.data.data.map((item) => ({
            label: item.materialNo,
            value: item._id,
            materialName: item.material,
            uom: item?.uomId?.name,
            uomId:item?.uomId?._id
          }));
          console.log(materials)
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
    getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.INVLOCATION })
      .then((res) => {
        if (res && res.data && Array.isArray(res.data.data)) {
          const locations = res.data.data.map((location) => ({
            label: location.name,
            value: location._id,
          }));
          setWarehouseOptions(locations);
          setFilteredWarehouseOptions(locations);
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

  const onSubmit = (values) => {
    setLoading(true);
    const payload = {
      materialId: values.materialNo,
      stockType: values.stockType?.value,
      quantity: values.quantity,
      warehouseId: values.sourceWareHouse,
      targetWareHouse: values.targetWareHouse,
      uomId: values.uomId,
      availableQuantity: values.availableQuantity,
      modelType:LIST_DATA_API_TYPE.STOCK_ENTRY,
    };

    console.log(payload)

    postApi(APIS.ADD_EDIT_DATA, payload)
      .then(() => {
        refreshPage();
        console.log(payload)
        toast.push(
          <Notification type="success" message="Stock saved successfully!" />
        );
        navigate(-1);
        console.log(payload)
      })
      .catch((error) => {
        console.error("Error saving stock:", error);
        toast.push(<Notification type="error" message="Save failed!" />);
      })
      .finally(() => setLoading(false));
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
            <h3>{editData.materialNo ? "Edit Stock" : "Add Stock"}</h3>
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
                loading={isSubmitting}
                icon={<AiOutlineSave />}
                type="submit"
              >
                {editData.materialNo ? "Update" : "Save"}
              </Button>
            </div>
          </div>
          <Card className="mt-2.5 w-3/4">
            <FormContainer className="md:w-full lg:w-1/2">
              {/* Stock Entry Type */}
              <FormItem
                label="Stock Entry Type"
                invalid={errors.stockType && touched.stockType}
                errorMessage={errors.stockType?.label}
              >
                <Select
                  name="stockType"
                  options={[
                    { label: "Material Receipt", value: 1 },
                    { label: "Material Transfer", value: 2 },
                  ]}
                  placeholder="Select Stock Entry Type"
                  value={values.stockType}
                  onChange={(option) => {
                    setFieldValue("stockType", option);
                    setFieldValue("sourceWareHouse", "");
                    setFieldValue("targetWareHouse", "");
                    setFieldValue("availableQuantity", "");
                  }}
                />
              </FormItem>

              {/* Material Code */}
              <FormItem
                label="Material Code"
                invalid={errors?.materialNo && touched?.materialNo}
                errorMessage={errors?.materialNo}
              >
                <Select
                  size="sm"
                  name="materialNo"
                  placeholder="Select Material Code"
                  options={materialOptions}
                  value={materialOptions.find(
                    (option) => option.value === values.materialNo
                  )}
                  onChange={(selectedOption) => {

                    console.log("selectedoption", selectedOption);
                    
                    setFieldValue("materialNo", selectedOption.value);
                    setFieldValue("materialName", selectedOption.materialName); // Set material name
                    setFieldValue("uom", selectedOption.uom); // Set UOM
                    setFieldValue("uomId", selectedOption.uomId); // Set UOM

                  }}
                />
              </FormItem>

              {/* Material Name and UOM */}
              <FormItem label="Material Name">
                <Field
                  as={Input}
                  size="sm"
                  name="materialName"
                  value={values.materialName}
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

              {/* Source Warehouse */}
              <FormItem
                label="Source Warehouse"
                invalid={errors.sourceWareHouse && touched.sourceWareHouse}
                errorMessage={errors.sourceWareHouse}
              >
                <Select
                  name="sourceWareHouse"
                  options={warehouseOptions}
                  placeholder="Select Source Warehouse"
                  value={warehouseOptions.find(
                    (option) => option.value === values.sourceWareHouse
                  )}
                  onChange={(option) => {
                    setFieldValue("sourceWareHouse", option.value);

                    // Fetch available quantity based on selected warehouse
                    const selectedWarehouse = warehouseOptions.find(
                      (wh) => wh.value === option.value
                    );
                    // Replace this mock with actual API call or logic to fetch available quantity
                    const quantity = availableQuantities[option.value] || "";

                    setFieldValue("availableQuantity", quantity);

                    // Update target warehouse options by removing selected source warehouse
                    const updatedTargetOptions = warehouseOptions.filter(
                      (wh) => wh.value !== option.value
                    );
                    setFilteredWarehouseOptions(updatedTargetOptions);
                  }}
                />
              </FormItem>

              {/* Available Quantity */}
              {values.stockType?.value === 2 && (
                <>
                  <FormItem label="Available Quantity">
                    <Field
                      as={Input}
                      name="availableQuantity"
                      value={values.availableQuantity}
                      readOnly
                    />
                  </FormItem>

                  {/* Target Warehouse */}
                  <FormItem
                    label="Target Warehouse"
                    invalid={errors.targetWareHouse && touched.targetWareHouse}
                    errorMessage={errors.targetWareHouse}
                  >
                    <Select
                      name="targetWareHouse"
                      options={filteredWarehouseOptions}
                      placeholder="Select Target Warehouse"
                      value={filteredWarehouseOptions.find(
                        (option) => option.value === values.targetWareHouse
                      )}
                      onChange={(option) => {
                        setFieldValue("targetWareHouse", option.value);
                      }}
                    />
                  </FormItem>
                </>
              )}
            </FormContainer>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default AddEditStockes;
