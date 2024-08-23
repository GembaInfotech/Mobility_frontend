import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Notification, toast } from "components/ui";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { makeSlug } from "utils/helpers";

const AddMoreAmenities = ({ setRefresh }) => {
  const [showInput, setShowInput] = useState(false);
  const [amenitieName, setAmenitieName] = useState();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  //// CHECK TO SHOW THE INPUT FILED FOR MORE AMENITIES////

  useEffect(() => {
    if (showInput) {
      inputRef.current.focus();
    }
  }, [showInput]);

  //SHOW INPUT ADD NEW AMENIRIES HANDLER///

  const handlerShowAddAmenities = () => {
    setShowInput(true);
  };

  // ADD NEW AMENITIES HANDLER (API)/////

  const handlerAddAmenities = () => {
    setLoading(true);
    const payload = new FormData();
    payload.append("name", amenitieName);
    payload.append("slug", makeSlug(amenitieName));
    postApi(APIS.ADD_EDIT_AMENITIES, payload)
      .then(() => {
        toast.push(<Notification type="success">Amenity saved!</Notification>);
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
            placeholder="Add more Amenities"
            onChange={(event) => setAmenitieName(event?.target?.value)}
          />
          <Button
            type="button"
            variant="solid"
            onClick={handlerAddAmenities}
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
          Add more Amenities
        </Button>
      )}
    </div>
  );
};

export default AddMoreAmenities;
