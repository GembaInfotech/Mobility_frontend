import React, { useRef } from 'react';
import {
  DatePicker,
  Radio,
  Upload,
  InputGroup,
  Input,
  Select,
  Button,
  Switcher,
} from 'components/ui';
import { Field, FieldArray } from 'formik';
import AsyncSelect from 'react-select/async';
import { HiOutlinePlus } from 'react-icons/hi';
import { AiOutlineDelete } from 'react-icons/ai';
import { FORM_FIELD_ARRAY,SEGMENT_CONSTANT } from 'views/orderManagement/serviceOrder/serviceConstant';
import { AiOutlineFilePdf } from 'react-icons/ai';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

const defaultFieldValue = {
  deviceType: '',
  icdCode: '',
  lCode: '',
  quantity: '',
  segment: 1
};

const MixComponent = ({ field, setFieldValue, values, errors, touched,onChange }) => {
  const arrayHelpersRef = useRef(defaultFieldValue);

  return (
    <>
      {field.component === 'datepicker' && (
        <>
          <DatePicker
            inputtable          
            name={field.name}
            // inputFormat={DATE_FORMAT}
            defaultValue={new Date(values?.[field.name]) || ""}
            value={values?.[field.name] ? new Date(values?.[field.name]) : ""}
            onChange={(date) => setFieldValue(field.name, date)}
            style={{
              display: field?.isDisable ? 'none' : 'block',
            }}
            placeholder={'MM/DD/YYYY'}
            // minDate={field.minDate || null}
            // defaultMonth={field.minDate || null}
          />
        </>
      )}
      {field.component === 'upload' && (
        <InputGroup className="mb-4">
          <Input value={values[field.name]?.[0]?.name} />
          <Upload
            className="cursor-pointer"
            onChange={(date) => setFieldValue(field.name, date)}
            showList={false}
            uploadLimit={1}
          />
        </InputGroup>
      )}

      {field.component === 'asyncSelect' && (
        <>
          <Field
            key={field.label}
            component={Select}
            autoComplete="off"
            isMulti={field.isMulti}
            placeholder={field.placeholder}
            defaultOptions
            cacheOptions
            loadOptions={field?.option}
            componentAs={AsyncSelect}
            onChange={(event) => {
              setFieldValue(field.name, event);
              onChange?.(field.name,event);
            }}
            name={field.name}
            value={values?.[field.name]}
          />
        </>
      )}
      {field.component === 'select' && (
        <>
          <Field
            component={Select}
            autoComplete="off"
            placeholder={field.placeholder}
            options={field.option}
            onChange={(event) => {
              setFieldValue(field.name, event);
            }}
            name={field.name}
            value={field?.option?.find((item) => item?.value === values?.[field.name])}
          />
        </>
      )}
      {field.component === 'fieldArray' && (
        <>
          <FieldArray
            name={field.name}
            render={(arrayHelpers) => {
              arrayHelpersRef.current = arrayHelpers;
              return (
                <div className="p-4 border border-blue-900 mb-4">
                  {values?.[field.name]?.map((fields, i) => (
                    <>
                    <div key={i} className="w-full flex justify-between items-center mb-5">
                      <div className='flex flex-col'>
                        <div className='flex'>
                          {FORM_FIELD_ARRAY?.map((item, index) => {
                            return (
                              <div key={index}>
                                <p>{item?.label}</p>
                                <Field
                                  isMulti={item?.isMulti}
                                  key={`${i}-${item?.key}-${index}`}
                                  className="mr-3 w-40"
                                  autoComplete="off"
                                  loadOptions={item?.option}
                                  // defaultValue={values?.[field.name]?.[i]?.[item?.key]}
                                  value ={values?.[field.name]?.[i]?.[item?.key]}
                                  name={`${field.name}.${i}.${item?.key}`}
                                  onChange={(e) => {
                                    setFieldValue(`${field.name}.${i}.${item?.key}`, 
                                      item?.type === 'select' ? e : e?.target?.value);
                                  }}
                                  placeholder={item.placeholder}
                                  component={item?.component}
                                  defaultOptions
                                  cacheOptions
                                />
                                <div className="text-xs text-red-500	">
                                  {errors?.[field.name]?.[i]?.[item?.key] ? (
                                    errors?.[field.name]?.[i]?.[item?.key]
                                  ) : (
                                    <div className="invisible">Error</div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div>
                        <p>Select Segment</p>
                        </div>
                        <div className='flex mt-3'>
                          {SEGMENT_CONSTANT.map((g, radioIndex) => {
                            return (
                              <Radio
                                key={radioIndex}
                                className="mr-4"
                                name={`${field.name}.${i}.segment`}
                                defaultValue={values?.[field.name]?.[i]?.segment}
                                onChange={(date) => {
                                  setFieldValue(`${field.name}.${i}.segment`, g.value);}
                                }
                                checked={g.value === values?.[field.name]?.[i]?.segment ? true : false}
                              >
                                {g.label}
                              </Radio>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex mt-2">
                        <div className="invisible text-xs text-red-500">Error</div>
                        <Button
                          size="sm"
                          variant="twoTone"
                          icon={<HiOutlinePlus />}
                          type="button"
                          onClick={() => arrayHelpersRef.current.push(defaultFieldValue)}
                        />
                        <Button
                          className="ml-3"
                          size="sm"
                          variant="twoTone"
                          color="red-600"
                          icon={<AiOutlineDelete />}
                          type="button"
                          onClick={() => arrayHelpersRef.current.remove(i)}
                        />
                      </div>
                     
                    </div>
                     {i !== values?.['prescriptions']?.length-1 && <hr className='my-5' />}
                     </>
                  ))}
                </div>
              );
            }}
          />
        </>
      )}
      {field?.component === 'PdfUpload' && (
        <Upload
          uploadLimit={1}
          draggable
          accept=".pdf,.jpeg,.jpg,.png"
          name={field.name}
          fileList= {values?.[field.name]}
          onChange={(imgs) => {
            setFieldValue(field.name, imgs[0]);
            // let payload = new FormData();

            // for (let i = 0; i < imgs?.length; i++) {
            //   payload.append('image', imgs[i]);
            // }

            // postApi(APIS.UPLOAD_IMAGE, payload).then((res) => {
            //   let files = [];

            //   if (res?.data?.length) {
            //     files = [...files, ...res?.data];
            //   } else {
            //     files = [...files, res?.data];
            //   }

            //   setFieldValue(field.name, files[0]?.original);
            // });
          }}
        >
          <div className="my-5 text-center">
            <div className="text-6xl mb-4 flex justify-center">
              <AiOutlineFilePdf />
            </div>
            <p className="font-semibold">
              <span className="text-gray-800 dark:text-white">Drop your doc here, or </span>
              <span className="text-blue-500">browse</span>
            </p>
            <p className="mt-1 opacity-60 dark:text-white">Support: Jpeg, Png, Pdf Only</p>
          </div>
        </Upload>
      )}
      {field.component === 'phoneNumber' && (
        <PhoneInput
          inputStyle={{ width: '369px', padding: '11px 14px 11px 60px' }}
          enableSearch={true}
          value={values?.[field.name]}
          country={'us'}
          countryCodeEditable
          onChange={(phone, country) => {
            setFieldValue(field.name, phone);
            setFieldValue(field.countryCode, country?.dialCode);
          }}
        />
      )}

      {field.component === 'timeInput' && (
        <Datetime
          onChange={(currentDate) => {
            if (!currentDate._isValid) {
            } else {
              setFieldValue(field.name, currentDate);
            }
          }}
          value={new Date(values?.[field.name])}
          dateFormat={false}
          timeFormat={'hh:mm  A'}
          inputProps={{
            placeholder: 'Enter time',
            style: {
              width: '100%',
              borderWidth: '1px',
              height: '2.75rem',
              borderRadius: '0.375rem',
              padding: '0.5rem 0.75rem',
            },
          }}
        />
      )}
      {field.component === 'switch' && (
        <Switcher
          name={field.name}
          checked={values?.[field.name]}
          onChange={(val, e) => {
            setFieldValue(field.name, !values?.[field.name]);
          }}
        />
      )}
    </>
  );
};
export default MixComponent;
