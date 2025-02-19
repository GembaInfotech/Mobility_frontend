import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import { ScrollBar } from "components/ui";
import PropTypes from "prop-types";
import {
  SIDE_NAV_WIDTH,
  SIDE_NAV_COLLAPSED_WIDTH,
  NAV_MODE_DARK,
  NAV_MODE_THEMED,
  NAV_MODE_TRANSPARENT,
  SIDE_NAV_CONTENT_GUTTER,
  LOGO_X_GUTTER,
} from "constants/theme.constant";
import Logo from "components/template/Logo";
import navigationConfig from "configs/navigation.config";
import VerticalMenuContent from "components/template/VerticalMenuContent";
import useResponsive from "utils/hooks/useResponsive";
import { useSelector } from "react-redux";
import { APP_NAME } from "constants/app.constant";
import { LOGO_SRC_PATH } from "components/template/Logo";
import { getApi } from "services/CommonService";
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";

const sideNavStyle = {
  width: SIDE_NAV_WIDTH,
  minWidth: SIDE_NAV_WIDTH,
};

const sideNavCollapseStyle = {
  width: SIDE_NAV_COLLAPSED_WIDTH,
  minWidth: SIDE_NAV_COLLAPSED_WIDTH,
};

const SideNav = () => {
  const user = useSelector((state) => state.auth.user);

  console.log("user roles", user);
  
  const themeColor = useSelector((state) => state.theme.themeColor);
  const primaryColorLevel = useSelector((state) => state.theme.primaryColorLevel);
  const navMode = useSelector((state) => state.theme.navMode);
  const mode = useSelector((state) => state.theme.mode);
  const direction = useSelector((state) => state.theme.direction);
  const currentRouteKey = useSelector((state) => state.base.common.currentRouteKey);
  const sideNavCollapse = useSelector((state) => state.theme.layout.sideNavCollapse);
  const userAuthority = useSelector((state) => state.auth.user.authority);
  const { larger } = useResponsive();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [hospitalList, setHospitalList] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const savedHospitalId = localStorage.getItem("selectedHospitalId");

    if (user?.companyId) {
      // Call your additional API here
      console.log("hello user user user");

      getApi(APIS.LIST_DATA, {
        companyId: user.companyId,
        type: LIST_DATA_API_TYPE.COMPANY,
      })
        .then((res) => {
          const response = res?.data?.data;

          if (Array.isArray(response)) {
            setHospitalList(response);

            if (savedHospitalId && response.some(hospital => hospital._id === savedHospitalId)) {
              setSelectedHospital(savedHospitalId);
            } else if (response.length > 0) {
              setSelectedHospital(response[0]._id);
              localStorage.setItem("selectedHospitalId", response[0]._id);
            }
          }
        })
        .catch((error) => {
          // Handle any errors from the additional API call
          console.error("Error calling additional API:", error);
        });
    }
    else {
      getApi(APIS.LIST_DATA, {
        type: LIST_DATA_API_TYPE.COMPANY,
        limit,
        search,
        skip: limit * (page - 1),
      }).then((res) => {
        const response = res?.data?.data;

        if (Array.isArray(response)) {
          setHospitalList(response);

          if (savedHospitalId && response.some(hospital => hospital._id === savedHospitalId)) {
            setSelectedHospital(savedHospitalId);
          } else if (response.length > 0) {
            setSelectedHospital(response[0]._id);
            localStorage.setItem("selectedHospitalId", response[0]._id);
          }
        }
      });
    }
  }, [id, page, search, user?.companyId]);

  const handleHospitalChange = (event) => {
    const selectedId = event.target.value;
    setSelectedHospital(selectedId);
    localStorage.setItem("selectedHospitalId", selectedId);
    window.location.reload();
  };

  const sideNavColor = () => {
    if (navMode === NAV_MODE_THEMED) {
      return `bg-${themeColor}-${primaryColorLevel} side-nav-${navMode}`;
    }
    return `side-nav-${navMode}`;
  };

  const logoMode = () => {
    if (navMode === NAV_MODE_THEMED) {
      return NAV_MODE_DARK;
    }
    if (navMode === NAV_MODE_TRANSPARENT) {
      return mode;
    }
    return navMode;
  };

  const menuContent = (
    <VerticalMenuContent
      navMode={navMode}
      collapsed={sideNavCollapse}
      navigationTree={navigationConfig}
      routeKey={currentRouteKey}
      userAuthority={userAuthority}
      direction={direction}
    />
  );

  return (
    <>
      {larger.md && (
        <div
          style={sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
          className={classNames("side-nav", sideNavColor(), !sideNavCollapse && "side-nav-expand")}
        >
          <div className="side-nav-header">
            <div className="flex flex-col items-center bg-blue-900 p-4">
              {!sideNavCollapse && (
                <img
                  className="my-2"
                  src={`${LOGO_SRC_PATH}Admin-logo-white.png`}
                  alt={`${APP_NAME} logo`}
                />
              )}
              {sideNavCollapse && (
                <Logo
                  imgClass="my-2"
                  mode={logoMode()}
                  type={sideNavCollapse ? "streamline" : "full"}
                  gutter={sideNavCollapse ? SIDE_NAV_CONTENT_GUTTER : LOGO_X_GUTTER}
                  imgHeight={45}
                  imgWidth={50}
                />
              )}

              {!sideNavCollapse && (
                <select
                  className="mt-3 p-2 w-full bg-white text-black rounded-md"
                  value={selectedHospital}
                  onChange={handleHospitalChange}
                >
                  <option value="">Select Hospital</option>
                  {hospitalList.map((hospital) => (
                    <option key={hospital._id} value={hospital._id}>
                      {hospital.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          {sideNavCollapse ? (
            menuContent
          ) : (
            <div className="side-nav-content bg-blue-900">
              <ScrollBar autoHide direction={direction}>{menuContent}</ScrollBar>
            </div>
          )}
        </div>
      )}
    </>
  );
};

SideNav.propTypes = {
  themed: PropTypes.bool,
  darkMode: PropTypes.bool,
  themeColor: PropTypes.string,
};

SideNav.defaultProps = {
  themed: false,
  darkMode: false,
  themeColor: "",
};

export default SideNav;
