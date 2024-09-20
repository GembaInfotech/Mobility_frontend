import { APP_PREFIX_PATH } from 'constants/route.constant';
import {
  NAV_ITEM_TYPE_TITLE,
  // NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
} from 'constants/navigation.constant';
import { ADMIN, USER } from 'constants/roles.constant';
import hasPermisson, { ACCESS, MODULE } from 'utils/hasPermission';

const appsNavigationConfig = [
  {
    key: 'menu',
    path: '',
    // title: "MENU",
    // translateKey: "nav.apps",
    icon: 'apps',
    type: NAV_ITEM_TYPE_TITLE,
    authority: [ADMIN, USER],
    subMenu: [
      {
        key: 'appsMenu.dashboard',
        path: `${APP_PREFIX_PATH}/dashboard`,
        title: 'Dashboard',
        icon: 'homeSvg',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, USER],
        isVisible: () => true,
        subMenu: [],
      },

      {
        key: 'appsMenu.subUser',
        path: `${APP_PREFIX_PATH}/sub-user`,
        title: 'Sub Admins',
        icon: 'account',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, USER],
        isVisible: () => hasPermisson(MODULE.SUBUSERS, ACCESS.READ),
        subMenu: [],
      },
      {
        key: 'appsMenu.userManagement',
        title: 'Users Management',
        icon: 'account',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, USER],
        isVisible: () =>
          hasPermisson(MODULE.PATIENT, ACCESS.READ) ||
          hasPermisson(MODULE.STAFF, ACCESS.READ) ||
          hasPermisson(MODULE.PROVIDER, ACCESS.READ),
        subMenu: [
          {
            key: 'appsMenu.userManagement.patient',
            path: `${APP_PREFIX_PATH}/userManagement/patient`,
            title: 'Patient Management',
            icon: 'account',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            isVisible: () => hasPermisson(MODULE.PATIENT, ACCESS.READ),
            subMenu: [],
          },
        ],
      },
      {
        key: 'appsMenu.orderManagement',
        title: 'Order Management',
        icon: 'documentation',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, USER],
        isVisible: () =>
          hasPermisson(MODULE.SERVICEORDER, ACCESS.READ) ||
          hasPermisson(MODULE.ECOMORDER, ACCESS.READ) ||
          hasPermisson(MODULE.CANCELREQUEST, ACCESS.READ),
        subMenu: [
          {
            key: 'appsMenu.orderManagement.serviceOrder',
            path: `${APP_PREFIX_PATH}/orderManagement/service-order`,
            title: 'Patient Prescription',
            icon: 'crm',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            isVisible: () => hasPermisson(MODULE.SERVICEORDER, ACCESS.READ),
            subMenu: [],
          },
        ], 
      },
      {
        key: 'appsMenu.masters',
        title: 'Masters',
        icon: 'knowledgeBase',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, USER],
        isVisible: () =>
          hasPermisson(MODULE.CODES, ACCESS.READ) ||
          hasPermisson(MODULE.COUPONS, ACCESS.READ) ||
          hasPermisson(MODULE.TYPESOFDEVICES, ACCESS.READ),
        subMenu: [
          {
            key: 'appsMenu.masters.insurances',
            path: `${APP_PREFIX_PATH}/masters/insurances`,
            title: 'Insurance Companies',
            icon: 'crm',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            isVisible: () => hasPermisson(MODULE.INSURANCES, ACCESS.READ),
            subMenu: [],
          },
          {
            key: 'appsMenu.masters.codes',
            path: `${APP_PREFIX_PATH}/masters/codes`,
            title: 'Codes (LCode / ICD)',
            icon: 'crm',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            isVisible: () => hasPermisson(MODULE.CODES, ACCESS.READ),
            subMenu: [],
          },
          {
            key: 'appsMenu.masters.physicians',
            path: `${APP_PREFIX_PATH}/masters/physicians`,
            title: 'Physician',
            icon: 'crm',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            isVisible: () => hasPermisson(MODULE.PHYSICIAN, ACCESS.READ),
            subMenu: [],
          },

          {
            key: 'appsMenu.masters.typesOfDevices',
            path: `${APP_PREFIX_PATH}/masters/types-of-devices`,
            title: 'Devices Types',
            icon: 'crm',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            subMenu: [],
            isVisible: () => hasPermisson(MODULE.TYPESOFDEVICES, ACCESS.READ),
          },
          {
            key: 'appsMenu.masters.locations',
            path: `${APP_PREFIX_PATH}/masters/locations`,
            title: 'Locations',
            icon: 'crm',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN, USER],
            subMenu: [],
            isVisible: () => hasPermisson(MODULE.LOCATIONS, ACCESS.READ),
          },
        ],
      },
      // {
      //   key: 'appsMenu.inventory',
      //   title: 'Inventory',
      //   icon: 'inventory',
      //   type: NAV_ITEM_TYPE_ITEM,
      //   authority: [ADMIN, USER],
      //   isVisible: () =>
      //     hasPermisson(MODULE.CODES, ACCESS.READ) ||
      //     hasPermisson(MODULE.COUPONS, ACCESS.READ) ||
      //     hasPermisson(MODULE.TYPESOFDEVICES, ACCESS.READ),
      //   subMenu: [
      //     {
      //       key: 'appsMenu.inventory',
      //       path: `${APP_PREFIX_PATH}/inventory/location`,
      //       title: 'Add Location',
      //       icon: 'crm',
      //       type: NAV_ITEM_TYPE_ITEM,
      //       authority: [ADMIN, USER],
      //       isVisible: () => hasPermisson(MODULE.LOCATIONS, ACCESS.READ),
      //       subMenu: [],
      //     },
      //     {
      //       key: 'appsMenu.inventory.',
      //       path: `${APP_PREFIX_PATH}/inventory/items`,
      //       title: 'Add New Materials',
      //       icon: 'crm',
      //       type: NAV_ITEM_TYPE_ITEM,
      //       authority: [ADMIN, USER],
      //       isVisible: () => hasPermisson(MODULE.CODES, ACCESS.READ),
      //       subMenu: [],
      //     },
      //     {
      //       key: 'appsMenu.inventory.',
      //       path: `${APP_PREFIX_PATH}/inventory/stockEntry`,
      //       title: 'Stock Entry',
      //       icon: 'crm',
      //       type: NAV_ITEM_TYPE_ITEM,
      //       authority: [ADMIN, USER],
      //       isVisible: () => hasPermisson(MODULE.STOCKENTRY, ACCESS.READ),
      //       subMenu: [],
      //     },
      //   ],
      // },
    ],
  },
];

export default appsNavigationConfig;
