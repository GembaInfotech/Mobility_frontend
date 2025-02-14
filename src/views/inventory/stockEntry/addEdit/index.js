import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Card, FormContainer, FormItem, Input, Select, toast, Notification } from "components/ui";
import { AiOutlineSave, AiOutlineCloseCircle } from "react-icons/ai";
import { getApi, postApi } from "services/CommonService";
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";
import { UPDATE_TOAST, ADDED_TOAST } from "constants/app.constant";

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
  stockType: { label: "Material Receipt", value: 1 },
  quantity: "",
  location: "",
  uom: "",
  uomId: "",
  transferLocation: "",
  transferQuantity: ""
};

const AddEditStock = ({ onClose, refreshPage }) => {
  const savedHospitalId = localStorage.getItem("selectedHospitalId");
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [materialOptions, setMaterialOptions] = useState([]); // To store materials
  const [warehouseOptions, setWarehouseOptions] = useState([]); // To store locations
  const [editData, setEditData] = useState(initialValues);
  const [loadingMaterialOptions, setLoadingMaterialOptions] = useState(true); // To handle loading state for materials

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch data for materials and locations
  useEffect(() => {
    // Fetch LCode materials (Stock types)
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
          setLoadingMaterialOptions(false); // Set loading to false once data is fetched
        } else {
          toast.push(<Notification type="error">No Materials found!</Notification>);
        }
      })
      .catch((error) => {
        console.error("Error fetching materials:", error);
        toast.push(<Notification type="error">Failed to load Materials</Notification>);
      });

    // Fetch locations (Warehouses)
    getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.LOCATIONS })
      .then((res) => {
        if (res && res.data && Array.isArray(res.data.data)) {
          const locations = res.data.data.map((location) => ({
            label: location.name,
            value: location._id,
          }));
          setWarehouseOptions(locations);
        } else {
          toast.push(<Notification type="error">No Warehouses found!</Notification>);
        }
      })
      .catch((error) => {
        console.error("Error fetching warehouses:", error);
        toast.push(<Notification type="error">Failed to load Warehouses</Notification>);
      });

    if (id) {
      const data = location.state?.editData;

      setEditData({
        code: data?.lcodeId?._id || "",
        description: data.lcodeId?.description || "",
        stockType: { label: "Material Receipt", value: 1 },
        quantity: data.quantity || "",
        location: data.locationId?._id || "",
        modelType: LIST_DATA_API_TYPE.STOCK_ENTRY,

      });
    }
  }, [id, location.state?.editData]);


  const onSubmit = (values, { setSubmitting }) => {
    const payload = {
      lcodeId: values.code,
      stockType: values.stockType?.value,
      quantity: values.quantity,
      locationId: values.location,
      uomId: values.uomId,
      transferLocation: values.transferLocation, // Include transfer location
      transferQuantity: values.transferQuantity, // Include transfer quantity
      modelType: LIST_DATA_API_TYPE.STOCK_ENTRY,
      companyId: savedHospitalId,
    };
    if (id) {
      payload.id = id;
    }
    postApi(APIS.ADD_EDIT_DATA, payload)
      .then((res) => {
        toast.push(<Notification type="success">{id ? UPDATE_TOAST : ADDED_TOAST}</Notification>);
        navigate("/app/inventory/stockEntry");
      })
      .catch((err) => {
        toast.push(<Notification type="error">{err}</Notification>);
      })
      .finally(() => {
        setSubmitting(false);
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
              <Button size="sm" className="ltr:mr-3 rtl:ml-3" onClick={() => navigate(-1)} icon={<AiOutlineCloseCircle />} type="button">
                Cancel
              </Button>
              <Button size="sm" variant="solid" loading={isSubmitting || loading} icon={<AiOutlineSave />} type="submit">
                {editData.code ? "Update" : "Save"}
              </Button>
            </div>
          </div>
          <Card className="mt-2.5 w-3/4">
            <FormContainer className="md:w-full lg:w-1/2">
              <FormItem label="Stock Entry Type" invalid={errors.stockType && touched.stockType} errorMessage={errors.stockType}>
                <Select
                  name="stockType"
                  options={[
                    { label: "Material Receipt", value: 1 },
                    { label: "Material Transfer", value: 2 },
                  ]}
                  placeholder="Select Stock Type"
                  value={values.stockType}
                  onChange={(selectedOption) => setFieldValue("stockType", selectedOption)}
                />
              </FormItem>

              <FormItem label="Location" invalid={errors.location && touched.location} errorMessage={errors.location}>
                <Select
                  name="location"
                  options={warehouseOptions}
                  placeholder="Select Location"
                  value={warehouseOptions.find((option) => option.value === values.location)}
                  onChange={(selectedOption) => setFieldValue("location", selectedOption.value)}
                />
              </FormItem>

              <FormItem label="LCode" invalid={errors.code && touched.code} errorMessage={errors.code}>
                {loadingMaterialOptions ? (
                  <Input size="sm" value="Loading..." readOnly />
                ) : (
                  <Select
                    size="sm"
                    name="code"
                    placeholder="Select LCode"
                    options={materialOptions}
                    value={materialOptions.find((option) => option.value === values.code) || null}
                    onChange={(selectedOption) => {
                      setFieldValue("code", selectedOption.value);
                      setFieldValue("description", selectedOption.description);
                      setFieldValue("uom", selectedOption.uom);
                      setFieldValue("uomId", selectedOption.uomId);
                    }}
                  />
                )}
              </FormItem>

              <FormItem label="Description">
                <Field as={Input} size="sm" name="description" value={values.description} readOnly />
              </FormItem>

              <FormItem label="Quantity" invalid={errors.quantity && touched.quantity} errorMessage={errors.quantity}>
                <Field as={Input} type="number" name="quantity" placeholder="Add Quantity" value={values.quantity} onChange={(e) => setFieldValue("quantity", e.target.value)} />
              </FormItem>

              {values.stockType.value === 2 && (
                <>
                  <FormItem
                    label="Transfer Location"
                    invalid={errors.transferLocation && touched.transferLocation}
                    errorMessage={errors.transferLocation}
                  >
                    <Select
                      name="transferLocation"
                      options={warehouseOptions}
                      placeholder="Select Transfer Location"
                      value={warehouseOptions.find((option) => option.value === values.transferLocation)}
                      onChange={(selectedOption) => setFieldValue("transferLocation", selectedOption.value)}
                    />
                  </FormItem>

                  <FormItem
                    label="Transfer Quantity"
                    invalid={errors.transferQuantity && touched.transferQuantity}
                    errorMessage={errors.transferQuantity}
                  >
                    <Field
                      as={Input}
                      type="number"
                      name="transferQuantity"
                      placeholder="Enter Transfer Quantity"
                      value={values.transferQuantity}
                      onChange={(e) => setFieldValue("transferQuantity", e.target.value)}
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

export default AddEditStock;
