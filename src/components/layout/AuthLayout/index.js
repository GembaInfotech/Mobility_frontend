import React from "react";
// import Side from './Side'
import Cover from "./Cover";
// import Simple from "./Simple";
import View from "views";
import { useSelector } from "react-redux";
import { LAYOUT_TYPE_BLANK } from "constants/theme.constant";
import { useLocation } from "react-router-dom";

const AuthLayout = (props) => {
  const layoutType = useSelector((state) => state.theme.layout.type);
  const location = useLocation();

  return (
    <div className="app-layout-blank flex flex-auto flex-col h-[100vh]">
      {location?.pathname?.includes("/reset-password/") ||
      layoutType === LAYOUT_TYPE_BLANK ? (
        <View {...props} />
      ) : (
        <Cover>
          <View {...props} />
        </Cover>
      )}
    </div>
  );
};

export default AuthLayout;
