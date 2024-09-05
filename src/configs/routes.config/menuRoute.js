import React from "react";
import { APP_PREFIX_PATH } from "constants/route.constant";
import { ADMIN, USER } from "constants/roles.constant";
import hasPermisson, { ACCESS, MODULE } from "utils/hasPermission";

const menuRoute = [
  {
    key: "apps.dashboard",
    path: `${APP_PREFIX_PATH}/dashboard`,
    component: React.lazy(() => import("views/project/ProjectDashboard")),
    authority: [ADMIN, USER],
    show: () => true,
  },

  {
    key: "apps.subUser",
    path: `${APP_PREFIX_PATH}/sub-user`,
    component: React.lazy(() => import("views/subUsers")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.SUBUSERS, ACCESS.READ),
    meta: {
      header: "Sub Admins",
    },
  },
  {
    key: "apps.addSubUser",
    path: `${APP_PREFIX_PATH}/sub-user/add`,
    component: React.lazy(() => import("views/subUsers/addEdit")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.SUBUSERS, ACCESS.WRITE),
    meta: {
      header: "Add Sub Admin",
    },
  },
  {
    key: "apps.editSubUser",
    path: `${APP_PREFIX_PATH}/sub-user/edit/:id`,
    component: React.lazy(() => import("views/subUsers/addEdit")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.SUBUSERS, ACCESS.WRITE),
    meta: {
      header: "Edit Sub Admin",
    },
  },

  {
    key: "apps.masters.codes",
    path: `${APP_PREFIX_PATH}/masters/codes`,
    component: React.lazy(() => import("views/masters/codes")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.CODES, ACCESS.READ),
    meta: {
      header: "Codes",
    },
  },
  {
    key: "apps.masters.typesOfDevices",
    path: `${APP_PREFIX_PATH}/masters/types-of-devices`,
    component: React.lazy(() => import("views/masters/typesOfDevices")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.TYPESOFDEVICES, ACCESS.READ),
    meta: {
      header: "Types Of Devices",
    },
  },

  {
    key: "apps.masters.locations",
    path: `${APP_PREFIX_PATH}/masters/locations`,
    component: React.lazy(() => import("views/masters/locations")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.LOCATIONS, ACCESS.READ),
    meta: {
      header: "Locations",
    },
  },

  {
    key: "apps.masters.insurances",
    path: `${APP_PREFIX_PATH}/masters/insurances`,
    component: React.lazy(() => import("views/masters/insurances")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.LOCATIONS, ACCESS.READ),
    meta: {
      header: "Insurance Companies",
    },
  },

  {
    key: "apps.masters.physicians",
    path: `${APP_PREFIX_PATH}/masters/physicians`,
    component: React.lazy(() => import("views/masters/physicians")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.PHYSICIAN, ACCESS.READ),
    meta: {
      header: "Physicians",
    },
  },

  {
    key: "apps.orderManagement.serviceOrder",
    path: `${APP_PREFIX_PATH}/orderManagement/service-order`,
    component: React.lazy(() => import("views/orderManagement/serviceOrder")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.SERVICEORDER, ACCESS.READ),
    meta: {
      header: "All Patient Prescriptions",
    },
  },
  {
    key: "apps.orderManagement.deliveryReceipt",
    path: `${APP_PREFIX_PATH}/orderManagement/delivery-receipt/:id`,
    component: React.lazy(() =>
      import("views/orderManagement/serviceOrder/deliveryReceipt")
    ),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.DElIVERYRECEIPT, ACCESS.READ),
    meta: {
      header: "Delivery Receipts",
    },
  },
  {
    key: "apps.orderManagement.medicalNecessity",
    path: `${APP_PREFIX_PATH}/orderManagement/medical-necessity/:id`,
    component: React.lazy(() =>
      import("views/orderManagement/serviceOrder/medicalNecessity")
    ),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.MEDICALNECESSITY, ACCESS.READ),
    meta: {
      header: "Letter of Medical Necessity",
    },
  },

  {
    key: "appsMenu.userManagement.patient",
    path: `${APP_PREFIX_PATH}/userManagement/patient`,
    component: React.lazy(() => import("views/userManagement/patient")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.PATIENT, ACCESS.READ),
    meta: {
      header: "Patient Management",
    },
  },
  {
    key: "apps.inventory.items",
    path: `${APP_PREFIX_PATH}/inventory/items`,
    component: React.lazy(() => import("views/inventory/items")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.LOCATIONS, ACCESS.READ),
    meta: {
      header: "Add Material",
    },
  },
  {
    key: "apps.inventory.location",
    path: `${APP_PREFIX_PATH}/inventory/location`,
    component: React.lazy(() => import("views/inventory/location")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.LOCATIONS, ACCESS.READ),
    meta: {
      header: "Location Companies",
    },
  },
  {
    key: "apps.inventory.inventoryDetail",
    path: `${APP_PREFIX_PATH}/inventory/inventoryDetail/:id`,
    component: React.lazy(() => import("views/inventory/inventoryDetail")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.INVENTORY, ACCESS.READ),
    meta: {
      header: "Inventory Details",
    },
  },
  // {
  //   key: "appsMenu.userManagement.staff",
  //   path: `${APP_PREFIX_PATH}/userManagement/staff`,
  //   component: React.lazy(() => import("views/userManagement/staff")),
  //   authority: [ADMIN, USER],
  //   show: () => hasPermisson(MODULE.STAFF, ACCESS.READ),
  //   meta: {
  //     header: "Staff Management",
  //   },
  // },
  // {
  //   key: "appsMenu.userManagement.provider",
  //   path: `${APP_PREFIX_PATH}/userManagement/provider`,
  //   component: React.lazy(() => import("views/userManagement/provider")),
  //   authority: [ADMIN, USER],
  //   show: () => hasPermisson(MODULE.PROVIDER, ACCESS.READ),
  //   meta: {
  //     header: "Provider Management",
  //   },
  // },
];

export default menuRoute;
