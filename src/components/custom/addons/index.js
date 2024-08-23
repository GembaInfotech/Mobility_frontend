import React, { useState, useEffect, useRef } from "react";
import { Select, FormItem, Button, Input } from "components/ui";
import { Field, FieldArray } from "formik";
import { getApi, postApi } from "services/CommonService";
import { APIS, LIST_DATA_TYPE } from "constants/api.constant";
import { HiOutlinePlus } from "react-icons/hi";
import { AiOutlineDelete, AiOutlineCode } from "react-icons/ai";
import { gstOptions } from "views/addons/addEdit";
const defaultValue = {
  id: "",
  name: "",
  price: "",
  gst: "",
};

const AddonFields = ({ values, name, index, setFieldValue }) => {
  const arrayHelpersRef = useRef(null);
  const [listAddons, setListAddons] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    getApi(APIS.LIST_DATA, { type: LIST_DATA_TYPE.ADD_ONS })
      .then((res) => {
        setListAddons(res?.data?.data);
      })
      .finally(() => setLoading(false));
  }, []);

  let addonsOptions = listAddons?.map((addonName, index) => {
    return {
      value: addonName.name,
      label: addonName.name,
      _id: addonName._id,
      price: addonName.price,
      gst: addonName.gst,
    };
  });

  return (
    <>
      <div className="my-3" name={name}>
        <div className="flex justify-between items-center mb-5">
          <p className="font-semibold">Addons</p>
          <Button
            size="md"
            variant="twoTone"
            icon={<HiOutlinePlus />}
            type="button"
            onClick={() => arrayHelpersRef.current.push(defaultValue)}
          />
        </div>

        <FieldArray
          name={name}
          key={index}
          render={(arrayHelpers) => {
            arrayHelpersRef.current = arrayHelpers;
            return (
              <div className="mb-5">
                {values?.rooms[index]?.addons?.map((addonAct, i) => (
                  <div className="w-full flex justify-between items-center mb-5">
                    <FormItem className="mr-2 w-1/3" label={`Addon ${i + 1}`}>
                      <Field
                        name={`values.rooms.${index}.addons.${i}.name`}
                        component={Select}
                        placeholder="Search"
                        options={addonsOptions}
                        value={addonsOptions?.filter(
                          (addon) =>
                            addon?.value ===
                            values?.rooms?.[index]?.addons?.[i]?.name
                        )}
                        onChange={(e) => {
                          setFieldValue(
                            `rooms.${index}.addons.${i}.name`,
                            e.value
                          );
                          setFieldValue(
                            `rooms.${index}.addons.${i}.price`,
                            e.price
                          );
                          setFieldValue(
                            `rooms.${index}.addons.${i}.gst`,
                            e.gst
                          );
                          setFieldValue(
                            `rooms.${index}.addons.${i}._id`,
                            e._id
                          );
                        }}
                      />
                    </FormItem>

                    {values?.rooms[index]?.addons[i]?.name && (
                      <>
                        <FormItem label="Price" className="mr-2 w-1/4 ">
                          <Field
                            type="number"
                            autoComplete="off"
                            placeholder="price"
                            component={Input}
                            defaultValue={
                              values?.rooms[index]?.addons[i]?.price
                            }
                            name={`rooms.${index}.addons.${i}.price`}
                          />
                        </FormItem>
                        <FormItem label="Gst" className="mr-2 w-1/5">
                          {" "}
                          <Field
                            autoComplete="off"
                            placeholder="gst"
                            component={Select}
                            options={gstOptions}
                            value={gstOptions.filter(
                              (gst) =>
                                gst.value ===
                                values?.rooms[index]?.addons[i]?.gst
                            )}
                            onChange={(e) =>
                              setFieldValue(
                                `rooms.${index}.addons.${i}.gst`,
                                e.value
                              )
                            }
                            name={`values.rooms.${index}.addons.${i}.gst`}
                          />
                        </FormItem>
                      </>
                    )}

                    <Button
                      size="md"
                      variant="twoTone"
                      color="red-600"
                      icon={<AiOutlineDelete />}
                      type="button"
                      onClick={() => arrayHelpersRef.current.remove(i)}
                    />
                  </div>
                ))}
              </div>
            );
          }}
        />
      </div>
    </>
  );
};

export default AddonFields;
