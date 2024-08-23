import React, { useEffect, useState } from "react";
import { AdaptableCard } from "components/shared";
import { Input, Checkbox, FormItem, Skeleton } from "components/ui";
import { HiOutlineCalendar } from "react-icons/hi";
import { Field } from "formik";
import { getApi } from "services/CommonService";
import { APIS, LIST_DATA_TYPE } from "constants/api.constant";
import AddMoreAmenities from "./addAmenities";

const skeltonArray = [1, 2, 3, 4, 5];

const AmenitiesFields = ({ touched, errors, setFieldValue, values }) => {
  const [loading, setLoading] = useState(true);
  const [amenities, setAmenities] = useState([]);
  const [refresh, setRefresh] = useState(false);

  /*GET ALL AMENITES LIST FROM API */

  useEffect(() => {
    getApi(APIS.LIST_DATA, { type: LIST_DATA_TYPE.AMENITIES })
      .then((res) => setAmenities(res?.data?.data))
      .finally(() => setLoading(false));
  }, [refresh]);

  /* HANDLER FOR CHECKBOX CLICK AND UNCLICK CHANGES */

  const handlerChangeCheckbox = (id) => {
    if (values?.amenities?.includes(id)) {
      const prev = values?.amenities?.filter((pres) => pres !== id);
      setFieldValue("amenities", prev);
      console.log("prev", prev);
    } else {
      setFieldValue("amenities", [...values?.amenities, id]);
      console.log("amentiye",[...values?.amenities, id]);
    }
  };

  /*RETURN  */

  return (
    <AdaptableCard className="mb-4" divider>
      <p className="mb-4 font-semibold heading-text">Property-wide Amenities</p>
      {loading ? (
        skeltonArray?.map((x) => (
          <div className="flex flex-auto items-center gap-2 mb-2" key={x}>
            <div>
              <Skeleton variant="circle" height={25} width={25} />
            </div>
            <div className="flex flex-col gap-4 w-full">
              <Skeleton height={10} width="60%" />
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col space-y-4 max-h-48 overflow-y-scroll">
          {amenities?.map((amenity, index) => {
            return (
              <Checkbox
                key={amenity?._id}
                name={amenity?.name}
                onChange={() => handlerChangeCheckbox(amenity?._id)}
                checked={values?.amenities?.includes(amenity?._id)}
              >
                {amenity?.name}
              </Checkbox>
            );
          })}
        </div>
      )}
      <div className="my-4">
        <AddMoreAmenities setRefresh={setRefresh} />
      </div>
      <div>
        <FormItem
          label="Best Period"
          invalid={errors.bestPeriod && touched.bestPeriod}
          errorMessage={errors.bestPeriod}
        >
          <Field
            type="text"
            autoComplete="off"
            name="bestPeriod"
            placeholder="April-May"
            component={Input}
            prefix={<HiOutlineCalendar className="text-lg" />}
          />
        </FormItem>
      </div>
    </AdaptableCard>
  );
};

export default AmenitiesFields;
