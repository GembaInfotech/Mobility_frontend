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
} from 'components/ui';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { getApi, postApi } from 'services/CommonService';
import { APIS, LIST_DATA_API_TYPE } from 'constants/api.constant';
import { useNavigate, useParams } from 'react-router-dom';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
});

const initialValues = {
  name: '',
};

const AddEditAdmins = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getApi(APIS.LIST_DATA, {
        type: LIST_DATA_API_TYPE.COMPANY,
        id,
      }).then((res) => {
        const response = res?.data?.data;
        if (response) {
          setEditData(response);
        }
      });
    }
  }, [id]);

  const onSubmit = ({ name }, { setSubmitting }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    if (id) formData.append('id', id);
    formData.append('modelType', LIST_DATA_API_TYPE.COMPANY);

    if (selectedImage) {
      formData.append('image', selectedImage); // Ensure your backend expects "image"
    }

    postApi(APIS.ADD_EDIT_COMPANY, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(() => {
        navigate(-1);
        toast.push(<Notification type="success">Company saved!</Notification>);
      })
      .catch((error) => {
        setSubmitting(false);
        console.error('Error saving company:', error);
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
        {({ errors, touched, isSubmitting }) => (
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

            {loading ? (
              <div className="flex justify-center">
                <Spinner size="3.25rem" />
              </div>
            ) : (
              <Card className="mt-2.5 w-3/4">
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
                      placeholder="Enter name"
                      component={Input}
                    />
                  </FormItem>

                  <FormItem label="Upload Image">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                  </FormItem>

                  {selectedImage && (
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected"
                      className="w-24 h-24 object-cover rounded border mt-2"
                    />
                  )}
                </FormContainer>
              </Card>
            )}
          </Form>
        )}
      </Formik>
    </AdaptableCard>
  );
};

export default AddEditAdmins;
