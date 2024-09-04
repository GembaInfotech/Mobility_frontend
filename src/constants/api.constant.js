export const TOKEN_TYPE = 'Bearer ';
export const REQUEST_HEADER_AUTH_KEY = 'Authorization';

 
export const LIST_DATA_API_TYPE = {
  DEVICE_TYPES: 1,
  LOCATIONS : 2,
  CODES : 3,
  INSURANCES: 4,
  PHYSICIANS : 5,
  PATIENTS: 6,
  ADMINS: 7,
  PRESCRIPTIONS: 8,
  MATERIALS: 9,
}

export const APIS = {
  ADD_EDIT_ADMINS: 'admin/addEditAdmins',
  ADD_EDIT_PHYSICIANS: 'admin/addEditPhysician',
  ADD_EDIT_INSURANCE: 'admin/addEditInsurance',
  GET_ADMINS: 'admin/listAdmins',
  UPLOAD_IMAGE: 'api/uploadImage',
  DELETE_IMAGE: 'api/deleteImageBucket',
  CHANGE_PASSWORD: 'admin/changePassword',
  LIST_DATA: 'admin/listData',
  ADD_EDIT_DATA: 'admin/addEditData',
  ADD_EDIT_CODE: 'admin/addEditCodes',
  GET_SERVICE_ORDER: 'admin/prescriptions',
  ADD_EDIT_PRESCRIPTION: 'admin/addEditPrescription',
  GENERATE_PDF: 'admin/generatePdf',
  ADD_EDIT_PATIENT: 'admin/addEditPatient',
  LIST_DASHBOARD: 'admin/dashboard',
  ADD_EDIT_DEVICE_TYPE: '/admin/addEditDeviceTypes',
  IMPORT_CODE: 'admin/importCodes',
  BLOCK_DELETE_DATA: 'admin/blockDeleteData',
  FORGET_PASSWORD: 'api/forgotPassword',
  UPDATE_PASSOWRD: 'api/updatePassword',
  USER_PASSWORD_RESET: 'admin/resetPasswordUser',
  EXPORT_DATA: 'admin/exportData',
  GET_NOTIFICATION: 'admin/notifications',
  UNREAD_NOTIFICATION: 'admin/notificationActions',
};
