import React from 'react';
import { DatePicker, Radio, Upload, Select, InputGroup, Input } from 'components/ui';
import { Field } from 'formik';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import { postApi, getApi } from 'services/CommonService';
import { APIS } from 'constants/api.constant';
import debounce from 'lodash/debounce';
import AsyncSelect from 'react-select/async';

import { PasswordInput } from 'components/shared';
import { DATE_FORMAT, FORM_GENDER_CONSANT } from 'constants/app.constant';
import { USER_SUBTYPE_OPTIONS } from '../providerConstant';

const MixComponent = ({ id, field, setFieldValue, values, errors, touched }) => {
  const loadSelectOption = (inputValue, resolve) => {
    if (field.name === 'state') {
      getApi(APIS.GET_CODE, { type: 4, search: inputValue }).then((result) => {
        const filter = result?.data?.data.map((item) => {
          let option = {
            label: item?.name,
            value: item?.id,
          };
          return option;
        });
        resolve(filter);
      });
    }
    if (field.name === 'deviceType') {
      getApi(APIS.GET_CODE, { type: 2, search: inputValue }).then((result) => {
        const filter = result?.data?.data.map((item) => {
          let option = {
            label: item?.name,
            value: item?.id,
          };
          return option;
        });
        resolve(filter);
      });
    }
  };
  const loadoptions = debounce(loadSelectOption, 300);

  return (
    <>
      {field.component === 'datepicker' && (
        <>
          <DatePicker
            name={field.name}
            inputFormat={DATE_FORMAT}
            defaultValue={new Date(values?.[field.name])}
            value={new Date(values?.[field.name])}
            onChange={(date) => setFieldValue(field.name, date)}
          />
        </>
      )}
      {field.component === 'radio' && (
        <>
          {FORM_GENDER_CONSANT.map((g, i) => {
            return (
              <Radio
                className="mr-4"
                name="gender"
                value={g.value}
                onChange={(date) => setFieldValue(field.name, date)}
                checked={g.value === values?.[field.name] ? true : false}
              >
                {g.label}
              </Radio>
            );
          })}
        </>
      )}

      {field.component === 'phoneNumber' && (
        <PhoneInput
          inputStyle={{ width: '369px', padding: '11px 14px 11px 60px' }}
          enableSearch={true}
          country={'us'}
          countryCodeEditable
          value={`${values?.[field.name]}`}
          onChange={(phone, country) => {
            setFieldValue(field.name, phone);
            setFieldValue(field.countryCode, country?.dialCode);
          }}
        />
      )}
      {field.component === 'upload' && (
        <InputGroup className="mb-4">
          <Input value={values[field.name]} />
          <Upload
            uploadLimit={1}
            showList={false}
            accept={['image/jpeg', 'image/png']}
            name={field.name}
            onChange={(imgs) => {
              let payload = new FormData();

              for (let i = 0; i < imgs?.length; i++) {
                payload.append('image', imgs[i]);
              }

              postApi(APIS.UPLOAD_IMAGE, payload).then((res) => {
                let files = [];

                if (res?.data?.length) {
                  files = [...files, ...res?.data];
                } else {
                  files = [...files, res?.data];
                }

                setFieldValue(field.name, files[0]?.original);
              });
            }}
          />
        </InputGroup>
      )}
      {field.component === 'asyncSelect' && (
        <>
          <Field
            component={Select}
            autoComplete="off"
            placeholder={field.placeholder}
            defaultOptions
            cacheOptions
            loadOptions={loadoptions}
            componentAs={AsyncSelect}
            onChange={(event) => {
              setFieldValue(field.name, event);
            }}
            name={field.name}
            value={values?.[field.name]}
          />
        </>
      )}
      {field.component === 'password' && !id && (
        <Field
          autoComplete="off"
          name="password"
          placeholder="Password"
          component={PasswordInput}
        />
      )}
      {field.component === 'select' && (
        <>
          <Field
            component={Select}
            autoComplete="off"
            placeholder={field.placeholder}
            options={field.option}
            onChange={(event) => {
              setFieldValue(field.name, event?.value);
            }}
            name={field.name}
            value={USER_SUBTYPE_OPTIONS.find((item) => item?.value === values?.[field.name])}
          />
        </>
      )}
    </>
  );
};
export default MixComponent;
