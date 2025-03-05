import React, { useEffect, useRef, useState } from 'react';
import { AdaptableCard } from 'components/shared';
import {
  Button,
  Input,
  FormItem,
  FormContainer,
  toast,
  Notification,
  Card,
  Spinner,
  Switcher,
  Select,
} from 'components/ui';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { getApi, postApi } from 'services/CommonService';
import { APIS, LIST_DATA_API_TYPE } from 'constants/api.constant';
import { useNavigate, useParams } from 'react-router-dom';
import AccessControl, { PERMISSIONS } from './accessControl';
import { useSelector } from 'react-redux';
const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email().required('Required'),
});

const initialValues = {
  name: '',
  email: '',
  superAdmin: false,
  roles: PERMISSIONS,
};

const AddEditAdmins = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState();
  const [companyOptions, setCompanyOptionos] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { superAdmin } = useSelector((state) => state?.auth?.user);

  useEffect(() => {

    getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.COMPANY })
      .then((res) => {
        if (res && res.data && Array.isArray(res.data.data)) {
          const locations = res.data.data.map((location) => ({
            label: location.name,
            value: location._id,
          }));
          setCompanyOptionos(locations);
        } else {
          toast.push(<Notification type="error">No Companies found!</Notification>);
        }
      })
      .catch((error) => {
        console.error("Error fetching Companies:", error);
        toast.push(<Notification type="error">Failed to load Companies</Notification>);
      });

    if (id) {
      getApi(APIS.LIST_DATA, {
        type: LIST_DATA_API_TYPE.ADMINS,
        id,
      }).then((res) => {
        const response = res?.data?.data;
        response.superAdmin = response.superAdmin ? true : false;
        response.roles = response.roles ? response.roles : PERMISSIONS;
        setEditData(response);
      });
    }
  }, [id]);
  //// SUBMIT TAGS HANDLER///////



  const onSubmit = ({ name, email, roles, superAdmin, company }) => {
    const mergedRoles = PERMISSIONS.map((permission) => {
      const existingRole = roles?.find((role) => role.name === permission.name);
      return existingRole || permission;
    });
  
    setLoading(true);
    const payload = new FormData();
    payload.append('name', name);
    payload.append('email', email);
    payload.append('superAdmin', superAdmin);
    
    if (!superAdmin) {
      if (company.length === 1) {
        payload.companyId = company
      } else {
        company.forEach((compId) => payload.append('companyId', compId));
      }
    }
    
    payload.append('roles', JSON.stringify(mergedRoles));
    if (id) {
      payload.append('adminId', id);
    }
  
    postApi(APIS.ADD_EDIT_ADMINS, payload)
      .then(() => {
        navigate(-1);
        toast.push(<Notification type="success">Sub admin saved!</Notification>);
      })
      .finally(() => setLoading(false));
  };
  
  return (
    <AdaptableCard>
      <Formik
        innerRef={formRef}
        initialValues={editData || initialValues}
        validationSchema={SignupSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ errors, touched, setFieldValue, isSubmitting, values }) => (
          <Form className="p-5">
            <div className="flex mb-3 justify-end w-3/4">
              <Button size="sm" variant="solid" onClick={() => navigate(-1)} type="button">
                Cancel
              </Button>
              <Button
                size="sm"
                variant="solid"
                style={{ marginLeft: '5px' }}
                loading={isSubmitting}
                type="submit"
              >
                {id ? 'Update' : 'Save'}
              </Button>
            </div>
            {loading && (
              <div className="flex justify-center">
                <Spinner size="3.25rem" />
              </div>
            )}
            {!loading && (
              <Card className="mt-2.5 w-3/4 ">
                <FormContainer>
                  <FormItem
                    label="Name"
                    invalid={errors?.name && touched?.name}
                    errorMessage={errors?.name}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="name"
                      placeholder="Enter name "
                      component={Input}
                    />
                  </FormItem>

                  <FormItem
                    label="Email"
                    invalid={errors?.email && touched?.email}
                    errorMessage={errors?.email}
                  >
                    <Field
                      type="email"
                      autoComplete="off"
                      name="email"
                      placeholder="Enter Email"
                      component={Input}
                    />
                  </FormItem>

                  {superAdmin && (
                    <>
                      <div className="flex justify-between">
                        <p className="font-semibold">Is Super Admin?</p>
                        <Switcher
                          name="superAdmin"
                          checked={values?.superAdmin}
                          onChange={(val,) => {
                            console.log("checked", val);

                            setFieldValue('superAdmin', !val);
                          }}
                        />
                      </div>
                      {!values?.superAdmin && <>
                        <FormItem label="Company" invalid={errors.company && touched.company} errorMessage={errors.company}>
                          <Select
                            name="Company"
                            options={companyOptions}
                            placeholder="Select Company"
                            isMulti // Enables multi-select
                            value={companyOptions.filter((option) => values.company?.includes(option.value))} // Handles multiple selected values
                            onChange={(selectedOptions) => setFieldValue("company", selectedOptions.map(option => option.value))} // Stores an array of selected values
                          />
                        </FormItem>
                        <AccessControl setFieldValue={setFieldValue} values={values} /></>}
                    </>
                  )}
                </FormContainer>
              </Card>
            )}
          </Form>
        )}
      </Formik>
    </AdaptableCard>
    // </Drawer>
  );
};

export default AddEditAdmins;
