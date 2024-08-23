import React from "react";
import { APP_PREFIX_PATH } from "constants/route.constant";
import { ADMIN, USER } from "constants/roles.constant";
import hasPermisson, { ACCESS, MODULE } from "utils/hasPermission";

const appsRoute = [
  {
    key: "appsProject.dashboard",
    path: `${APP_PREFIX_PATH}/project/dashboard`,
    component: React.lazy(() => import("views/project/ProjectDashboard")),
    authority: [ADMIN, USER],
  },
  {
    key: "appsProject.projectList",
    path: `${APP_PREFIX_PATH}/project/project-list`,
    component: React.lazy(() => import("views/project/ProjectList")),
    authority: [ADMIN, USER],
  },

  
  {
    key: "appsAccount.addEdPaitent",
    path: `${APP_PREFIX_PATH}/patient/add`,
    component: React.lazy(() =>
      import("views/userManagement/patient/addEditPatient")
    ),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.PATIENT, ACCESS.WRITE),

  },
  {
    key: "apps.addSubUser",
    path: `${APP_PREFIX_PATH}/sub-user/add`,
    component: React.lazy(() => import("views/subUsers/addEdit")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.SUBUSERS, ACCESS.WRITE),
    meta: {
      header: "Add Sub Users",
    },
  },
  {
    key: "apps.editSubUser",
    path: `${APP_PREFIX_PATH}/sub-user/edit/:id`,
    component: React.lazy(() => import("views/subUsers/addEdit")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.SUBUSERS, ACCESS.WRITE),
    meta: {
      header: "Edit Sub Users",
    },
  },
  {
    key: "appsAccount.addEdPaitent",
    path: `${APP_PREFIX_PATH}/patient/edit/:id`,
    component: React.lazy(() =>
      import("views/userManagement/patient/addEditPatient")
    ),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.PATIENT, ACCESS.WRITE),
  },
  {
    key: "appsAccount.addProvider",
    path: `${APP_PREFIX_PATH}/provider/add`,
    component: React.lazy(() =>
      import("views/userManagement/provider/addEditProvider")
    ),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.PROVIDER, ACCESS.WRITE),
    // meta: {
    //   header: `Add Provider`,
    //   extraHeader: React.lazy(() => import('views/userManagement/provider/addEditProvider/HeaderPanel')),
    //   headerContainer: true,
    // },
  },
  {
    key: "appsAccount.EditProvider",
    path: `${APP_PREFIX_PATH}/provider/edit/:id`,
    component: React.lazy(() =>
      import("views/userManagement/provider/addEditProvider")
    ),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.PROVIDER, ACCESS.WRITE),
  },
  {
    key: "appsAccount.addStaff",
    path: `${APP_PREFIX_PATH}/staff/add`,
    component: React.lazy(() =>
      import("views/userManagement/staff/addEditStaff")
    ),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.STAFF, ACCESS.WRITE),
    // meta: {
    //   header: `Add Staff`,
    //   extraHeader: React.lazy(() => import('views/userManagement/staff/addEditStaff/HeaderPanel')),
    //   headerContainer: true,
    // },
  },
  {
    key: "appsAccount.EditStaff",
    path: `${APP_PREFIX_PATH}/staff/edit/:id`,
    component: React.lazy(() =>
      import("views/userManagement/staff/addEditStaff")
    ),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.STAFF, ACCESS.WRITE),
    // meta: {
    //   header: `Edit Staff`,
    //   extraHeader: React.lazy(() => import('views/userManagement/staff/addEditStaff/HeaderPanel')),
    //   headerContainer: true,
    // },
  },

  {
    key: "appsAccount.service",
    path: `${APP_PREFIX_PATH}/service-order/add`,
    component: React.lazy(() =>
      import("views/orderManagement/serviceOrder/addEditOrder")
    ),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.SERVICEORDER, ACCESS.READ),
  },

  {
    key: "appsAccount.service",
    path: `${APP_PREFIX_PATH}/service-order/edit/:id`,
    component: React.lazy(() =>
      import("views/orderManagement/serviceOrder/addEditOrder")
    ),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.SERVICEORDER, ACCESS.READ),
  },

 
  {
    key: "apps.orderManagement.serviceOrder",
    path: `${APP_PREFIX_PATH}/orderManagement/service-order/:id`,
    component: React.lazy(() => import("views/orderManagement/serviceOrder")),
    authority: [ADMIN, USER],
    show: () => hasPermisson(MODULE.SERVICEORDER, ACCESS.WRITE),
    meta: {
      header: "Patient Prescriptions",
    },
  },
  
];

export default appsRoute;
