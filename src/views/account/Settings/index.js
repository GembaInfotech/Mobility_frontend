import React, { useState, Suspense, lazy } from "react";
import { Tabs } from "components/ui";
import { AdaptableCard, Container } from "components/shared";
import { useNavigate } from "react-router-dom";

const Profile = lazy(() => import("./components/Profile"));
const Password = lazy(() => import("./components/Password"));
const TermsAndPolicy = lazy(() => import("./components/termsAndPolicy"));
const ShippingCharges = lazy(() => import("./components/shippingCharges"));

const { TabNav, TabList } = Tabs;

const settingsMenu = {
  profile: { label: "Profile", path: "profile" },
  password: { label: "Password", path: "password" },
  termsAndPolicy: { label: "Terms and Policy", path: "termsAndPolicy" },
  shippingCharges: {
    label: "Shipping Charges Policy ",
    path: "shippingCharges",
  },
};

const Settings = () => {
  const [currentTab, setCurrentTab] = useState("profile");
  const [data, setData] = useState({});

  const navigate = useNavigate();

  const onTabChange = (val) => {
    setCurrentTab(val);
    navigate(`/app/account/settings/${val}`);
  };

  return (
    <Container>
      <AdaptableCard>
        <Tabs value={currentTab} onChange={(val) => onTabChange(val)}>
          <TabList>
            {Object.keys(settingsMenu).map((key) => (
              <TabNav key={key} value={key}>
                {settingsMenu[key].label}
              </TabNav>
            ))}
          </TabList>
        </Tabs>
        <div className="px-4 py-6">
          <Suspense fallback={<></>}>
            {currentTab === "profile" && <Profile data={data.profile} />}
            {currentTab === "password" && <Password data={data.loginHistory} />}
            {currentTab === "termsAndPolicy" && <TermsAndPolicy />}
            {currentTab === "shippingCharges" && <ShippingCharges />}
          </Suspense>
        </div>
      </AdaptableCard>
    </Container>
  );
};

export default Settings;
