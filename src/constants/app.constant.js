export const APP_NAME = 'North America SPINE & PAIN';
export const PERSIST_STORE_NAME = 'admin';
export const REDIRECT_URL_KEY = 'redirectUrl';

export const TABLE_ACTION_KEYS = {
  EDIT: 'Edit',
  DELETE: 'Delete',
  ADD: 'Add',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  NAVIGATE: 'Navigate',
  DOWNLOAD: 'Download',
  VIEW: 'View',
  IMPORT: 'Import',
  EXPORT: 'Export',
  CHANGE_PASSWORD: 'ChangePassword',
  STATUS: 'Status',
};

export const CODE_TYPE = {
  Lcode: 1,
  Icd: 2,
}

export const DELETE_TOAST = 'Deleted successfully';
export const UPDATE_TOAST = 'Updated successfully';
export const ADDED_TOAST = 'Added successfully';
export const UPLOAD_TOAST = 'Uploaded successfully';
export const SEND_ADDED_TOAST = 'Sent successfully';
export const CONFIRMATION_OBJ = {
  DELETE: 'Are you sure, you want to delete it ?',
  WARNING: 'Please be aware! This action cannot be undone.',
  HEADER: 'Alert',
  APPROVED: 'Are you sure, you want to approve this request ?',
  REJECTED: 'Are you sure, you want to reject this request ?',
};

export const ACTIVE_INACTIVE_STATUS = [
  { label: 'In Active', identifier: 2, value: false },
  { label: 'Active', identifier: 1, value: true },
];

export const ACTIVE_STATUS_OPTONS = [
  { label: 'In Active', value: 2 },
  { label: 'Active', value: 1 },
];
export const ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM = {
  des: 'Want to change the status? ',
  buttonLabel: 'Change',
};

export const STATUS_OPTIONS = [
  { label: 'APPROVED', value: 1 },
  { label: 'REJECT', value: 2 },
  { label: 'REMARKS', value: 3 },
  { label: 'ON_HOLD', value: 4 },
];

export const DATE_TIME_FORMAT = 'MM/DD/YYYY hh:mm a';

export const DATE_FORMAT = 'MM/DD/YYYY';

export const FORM_GENDER_CONSANT = [
  { label: 'Male', value: 1 },
  { label: 'Female', value: 2 },
  { label: 'Others', value: 3 },
];
