import React from "react";
import { Button } from "components/ui";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

const HeaderPanel = () => {
  const navigate = useNavigate();
  const onBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center">
      <Button
        onClick={onBackClick}
        size="sm"
        variant="solid"
        className="flex items-center	"
      >
        <MdKeyboardBackspace style={{ fontSize: "20px", marginRight: "4px" }} />
        Back
      </Button>
    </div>
  );
};

export default HeaderPanel;
