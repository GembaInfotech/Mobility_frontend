import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Notification, toast } from "components/ui";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { makeSlug } from "utils/helpers";

const AddMoreTags = ({ setRefresh }) => {
  const [showInput, setShowInput] = useState(false);
  const [tagName, setTagName] = useState();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  //// CHECK TO SHOW THE INPUT FILED FOR MORE AMENITIES////

  useEffect(() => {
    if (showInput) {
      inputRef.current.focus();
    }
  }, [showInput]);

  //SHOW INPUT ADD NEW TAG HANDLER///

  const handlerShowAddAmenities = () => {
    setShowInput(true);
  };

  // ADD NEW TAGS HANDLER (API)/////

  const handlerAddTags = () => {
    setLoading(true);
    postApi(APIS.ADD_EDIT_TAGS, { name: tagName })
      .then(() => {
        toast.push(<Notification type="success">Tag saved!</Notification>);
        setRefresh((s) => !s);
        setShowInput(false);
      })
      .finally(() => setLoading(false));
  };

  /// RETURN /////

  return (
    <div className="mb-7">
      {showInput ? (
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            placeholder="Add more Tags"
            onChange={(event) => setTagName(event?.target?.value)}
          />
          <Button
            type="button"
            variant="solid"
            onClick={handlerAddTags}
            isLoading={loading}
          >
            Add
          </Button>
        </div>
      ) : (
        <Button
          block
          size="sm"
          variant="twoTone"
          icon={<HiOutlinePlusCircle />}
          onClick={handlerShowAddAmenities}
        >
          Add more tags
        </Button>
      )}
    </div>
  );
};

export default AddMoreTags;
