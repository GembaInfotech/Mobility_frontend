import React, { useRef, useState, useEffect } from "react";
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
import { postApi, getApi } from "services/CommonService";
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";
import { AiOutlineSave, AiOutlineCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";

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
  companyId: "",
};

const AddEditDeviceType = ({ editData, show, onClose, refreshPage }) => {
  const savedHospitalId = localStorage.getItem("selectedHospitalId");
  // const [companyOptions, setCompanyOptionos] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (user?.companyId) {
  //     getApi(APIS.LIST_DATA, {
  //       companyIds: JSON.stringify(user.companyId),
  //       type: LIST_DATA_API_TYPE.COMPANY,
  //     })
  //       .then((res) => {
  //         const response = res?.data?.data;

  //         if (Array.isArray(response)) {
  //           const companyOptions = response.map((company) => ({
  //             label: company.name,
  //             value: company._id,
  //           }));
  //           setCompanyOptionos(companyOptions);
  //         }
  //       })
  //       .catch((error) => {
  //         // Handle any errors from the additional API call
  //         console.error("Error calling additional API:", error);
  //       });
  //   } else {
  //     getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.COMPANY })
  //       .then((res) => {
  //         if (res && res.data && Array.isArray(res.data.data)) {
  //           const locations = res.data.data.map((location) => ({
  //             label: location.name,
  //             value: location._id,
  //           }));
  //           setCompanyOptionos(locations);
  //         } else {
  //           toast.push(<Notification type="error">No Companies found!</Notification>);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching Companies:", error);
  //         toast.push(<Notification type="error">Failed to load Companies</Notification>);
  //       });
  //   }

  // }, []);

  const onSubmit = ({ name, id, companyId }, {setSubmitting}) => {
    setLoading(true);
    const payload = {
      name,
      modelType: LIST_DATA_API_TYPE.LOCATIONS,
      companyId: savedHospitalId,
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
      }).catch(()=>{
        setSubmitting(false)
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
                  label="Company"
                  invalid={errors.companyId && touched.companyId}
                  errorMessage={errors.companyId}
                >
                  <Field name="companyId">
                    {({ field, form }) => (
                      <Select
                        {...field}
                        options={companyOptions}
                        placeholder="Select Company"
                        value={companyOptions.find(
                          (option) => option.value === field.value
                        )}
                        onChange={(selectedOption) =>
                          form.setFieldValue("companyId", selectedOption.value)
                        }
                        onBlur={field.onBlur}
                      />
                    )}
                  </Field>
                </FormItem> */}
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
