import React, { useEffect, useState } from "react";
import { AdaptableCard } from "components/shared";
import { Checkbox, Skeleton } from "components/ui";

import { getApi } from "services/CommonService";
import { APIS, LIST_DATA_TYPE } from "constants/api.constant";
import AddMoreTags from "./addTags";
import Imagekit from "../imageKit";
// import AddMoreAmenities from "./addAmenities";

const skeltonArray = [1, 2, 3, 4, 5];

const TagField = ({ setFieldValue, values }) => {
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [refresh, setRefresh] = useState(false);

  /*GET ALL TAGS LIST FROM API */

  useEffect(() => {
    getApi(APIS.LIST_DATA, { type: LIST_DATA_TYPE.TAGS })
      .then((res) => setTags(res?.data?.data))
      .finally(() => setLoading(false));
  }, [refresh]);

  /* HANDLER FOR CHECKBOX CLICK AND UNCLICK CHANGES */

  const handlerChangeCheckbox = (id) => {
    if (values?.tags?.includes(id)) {
      const prev = values?.tags?.filter((pres) => pres !== id);
      setFieldValue("tags", prev);
    } else {
      setFieldValue("tags", [...values?.tags, id]);
    }
  };

  /*RETURN  */

  return (
    <AdaptableCard className="" divider>
      <p className="mb-4 font-semibold heading-text text-lg">Select Tags</p>
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
        <div className="flex flex-col space-y-4 max-h-48 overflow-y-scroll overflow-x-hidden">
          {tags?.map((tag, index) => {
            return (
              <Checkbox
                key={tag?._id}
                name={tag?.name}
                onChange={() => handlerChangeCheckbox(tag?._id)}
                checked={values?.tags?.includes(tag?._id)}
              >
                {tag?.name}
              </Checkbox>
            );
          })}
        </div>
      )}
      <div className="my-4">
        <AddMoreTags setRefresh={setRefresh} />
      </div>
    </AdaptableCard>
  );
};

export default TagField;
