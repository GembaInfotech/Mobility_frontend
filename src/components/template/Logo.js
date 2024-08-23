import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { APP_NAME } from "constants/app.constant";

export const LOGO_SRC_PATH = "/img/logo/";

const Logo = (props) => {
  const {
    type,
    mode,
    gutter,
    className,
    imgClass,
    style,
    logoWidth,
    imgHeight = 100,
    imgWidth = 100,
  } = props;

  return (
    <div
      className={classNames("logo", className, gutter)}
      style={{
        ...style,
        ...{ width: logoWidth },
      }}
    >
      <img
        className={imgClass}
        src={`${LOGO_SRC_PATH}app-logo2.png`}
        alt={`${APP_NAME} logo`}
        style={{ width: imgWidth, height: imgHeight}}
      />
    </div>
  );
};

Logo.defaultProps = {
  mode: "light",
  type: "full",
  logoWidth: "auto",
};

Logo.propTypes = {
  mode: PropTypes.oneOf(["light", "dark"]),
  type: PropTypes.oneOf(["full", "streamline"]),
  gutter: PropTypes.string,
  imgClass: PropTypes.string,
  logoWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Logo;
