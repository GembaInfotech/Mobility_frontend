import { Input } from "components/ui";
import * as Yup from "yup";
import { getApi } from "services/CommonService";
import debounce from "lodash/debounce";
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";
import AsyncSelect from "react-select/async";
import { CODE_TYPE, DATE_FORMAT } from 'constants/app.constant';
import dayjs from "dayjs";

const savedHospitalId = localStorage.getItem("selectedHospitalId");

const loadPhysicianOption = (inputValue, resolve) => {
  getApi(APIS.LIST_DATA, {
    type: LIST_DATA_API_TYPE.PHYSICIANS,
    companyId:savedHospitalId,
    search: inputValue,
  }).then((result) => {
    const filter = result?.data?.data.map((item) => {
      let option = {
        label: `${item?.name}`,
        value: item?._id,
      };
      return option;
    });
    resolve(filter);
  });
};
const loadLocationOption = (inputValue, resolve) => {
  getApi(APIS.LIST_DATA, {
    type: LIST_DATA_API_TYPE.LOCATIONS,
    companyId:savedHospitalId,
    search: inputValue,
  }).then((result) => {
    const filter = result?.data?.data.map((item) => {
      let option = {
        label: `${item?.name}`,
        value: item?._id,
      };
      return option;
    });
    resolve(filter);
  });
};

const loadPatientOption = (inputValue, resolve) => {
  getApi(APIS.LIST_DATA, {
    type: LIST_DATA_API_TYPE.PATIENTS,
    companyId:savedHospitalId,
    search: inputValue,
  }).then((result) => {
    const filter = result?.data?.data.map((item) => {
      let option = {
        label: `${item?.firstName} ${item?.lastName} - ${dayjs(item?.dob).format(DATE_FORMAT)} (${item?.patientNo})`,
        value: item?._id,
        data : item
      };
      return option;
    });
    resolve(filter);
  });
};
const loadlCodeOption = (inputValue, resolve) => {
  getApi(APIS.LIST_DATA, {
    type: LIST_DATA_API_TYPE.CODES,
    companyId:savedHospitalId,
    search: inputValue,
    codeType: CODE_TYPE.Lcode
  }).then((result) => {
    const filter = result?.data?.data.map((item) => {
      let option = {
        label: item?.code,
        value: item?._id,
      };
      return option;
    });
    resolve(filter);
  });
};
const loadicdCodeOption = (inputValue, resolve) => {
  getApi(APIS.LIST_DATA, {
    type: LIST_DATA_API_TYPE.CODES,
    companyId:savedHospitalId,
    search: inputValue,
    codeType: CODE_TYPE.Icd
  }).then((result) => {
    const filter = result?.data?.data.map((item) => {
      let option = {
        label: item?.code,
        value: item?._id,
      };
      return option;
    });
    resolve(filter);
  });
};

const loadDeviceTypeOption = (inputValue, resolve) => {
  getApi(APIS.LIST_DATA, {
    type: LIST_DATA_API_TYPE.DEVICE_TYPES,
    companyId:savedHospitalId,
    search: inputValue,
  }).then((result) => {
    const filter = result?.data?.data.map((item) => {
      let option = {
        label: item?.name,
        value: item?._id,
      };
      return option;
    });
    resolve(filter);
  });
};

const loadInsuranceOption = (inputValue, resolve) => {
  getApi(APIS.LIST_DATA, {
    type: LIST_DATA_API_TYPE.INSURANCES,
    companyId:savedHospitalId,
    search: inputValue,
  }).then((result) => {
    const filter = result?.data?.data.map((item) => {
      let option = {
        label: item?.name,
        value: item?._id,
      };
      return option;
    });
    resolve(filter);
  });
};

const loadInsuranceOption1 = (inputValue, resolve) => {
  getApi(APIS.LIST_DATA, {
    type: LIST_DATA_API_TYPE.INSURANCES,
    companyId:savedHospitalId,
    search: inputValue,
  }).then((result) => {
    const filter = result?.data?.data.map((item) => {
      let option = {
        label: item?.name,
        value: item?._id,
      };
      return option;
    });
    resolve(filter);
  });
};

const loadPhysicians = debounce(loadPhysicianOption, 300);
const loadPhysicians1 = debounce(loadPhysicianOption, 300);
const loadlcodeoptions = debounce(loadlCodeOption, 300);
const loadicdcodeoptions = debounce(loadicdCodeOption, 300);
const loadLocations = debounce(loadLocationOption, 300);
const loadLocations1 = debounce(loadLocationOption, 300);
const loadPatients = debounce(loadPatientOption, 300);
const loadDeviceTypes = debounce(loadDeviceTypeOption, 300);
const loadInsurances = debounce(loadInsuranceOption, 300);
const loadInsurances1 = debounce(loadInsuranceOption1, 300);

export const SERVICE_ORDER_STATUS = [
  { label: "Referral Sent", value: 1 ,color: "red"},
  { label: "Intake Completed", value: 2 ,color: "indigo"},
  { label: "Insurance in process", value: 13 ,color : "emerald" },
  { label: "Insurance Completed", value: 3  ,color: "blue"},
  { label: "Order Fulfilment in Process", value: 4, color : "emerald" },
  { label: "Order Fulfilment Completed", value: 5,color : "cyan" },
  { label: "Delivery Ready", value: 6 , color : "orange" },
  { label: "Delivery Scheduled", value: 15 , color : "orange" },
  { label: "Dropship in Process", value: 12 ,color : "emerald" },
  { label: "Delivered", value: 7 , color: "green" },
  { label: "DR Sent to PPS", value: 8, color: "purple"  },
  { label: "Billed", value: 9 ,color : "orange" },
  { label: "RNR", value: 10 ,color : "orange" },
  { label: "Denied", value: 11 ,color : "red" },
  { label: "High Deductible", value: 14 ,color : "emerald" },
  {label:  "LMN signed", value: 16, color: "purple"},
  {label:  "Get LMN", value: 17, color: "blue"}

  // { label: "Pending", value: 1, color: "red" },
  // { label: "In-Process", value: 2, color: "indigo" },
  // { label: "Completed", value: 3, color: "green" },
];
// Reterra Sent
// Intake Completed
// Insurance Completed
// Order Fulfilment in Process
// Order Fulfilment Completed
// Delivery Ready
// Delivered
// DR Sent to PPS
// Billed
// RNR
// Denied
export const PROVIDER_STATUS = [
  { label: "Approved", value: 1 },
  { label: "Rejected", value: 2 },
  { label: "Processing", value: 3 },
];

export const INSURANCE_CONSTANT = [
  { label: "Self Pay", value: 1 },
  { label: "Insurance", value: 2 },
];
export const PERSONAL_INFORMATION = [
  {
    name: "patientId",
    label: "Select Patient (Search with name)",
    component: "asyncSelect",
    option: loadPatients,
    placeholder: "Select Patient",
  },
  {
    name: "nextAppointmentDate",
    label: "Next Appointment Date",
    component: "datepicker",
  },
  {
    name: "locationId",
    label: "Select Prescription Location (Search with name)",
    component: "asyncSelect",
    option: loadLocations,
    placeholder: "Select Location",
  },
  {
    name: "appointmentLocationId",
    label: "Next Appointment Location (Search with name)",
    component: "asyncSelect",
    option: loadLocations1,
    placeholder: "Search/Select with Name",
  },
  {
    name: "physicianId",
    label: "Referring Physician (Search with name)",
    component: "asyncSelect",
    option: loadPhysicians,
    placeholder: "Search Physician",
  },
  {
    name: "renderingPhysicianId",
    label: "Rendering Physician (Search with name)",
    component: "asyncSelect",
    option: loadPhysicians1,
    placeholder: "Search/Select with Name",
  },
  {
    name: "prescriptionDocument",
    label: "Upload Prescription",
    component: "PdfUpload",
  },
  {
    name: "physicianNotes",
    label: "Physician Notes",
    type: "switch",
    component: "switch",
  },
];

export const INSURANCE_FIELD_CONSTANT = [
  {
    name: "primaryInsurance",
    apiType: "insurance",
    label: "Primary Insurance",
    option: loadInsurances,
    component: "asyncSelect",
    placeholder: "Select primary insurance",
  },
  {
    name: "primaryInsuranceNo",
    label: "Primary Insurance No.",
    type: "text",
    component: Input,
    placeholder: "Enter primary insurance no.",
    isBasic: true,
  },
  {
    name: "secondaryInsurance",
    apiType: "insurance",
    label: "Secondary Insurance",
    option: loadInsurances1,
    component: "asyncSelect",
    placeholder: "Select secondary insurance",
  },
  {
    name: "secondaryInsuranceNo",
    label: "Seconday Insurance No.",
    type: "text",
    component: Input,
    placeholder: "Enter secondary insurance no.",
    isBasic: true,
  },
  {
    name: "insuranceDocument",
    label: "Upload Insurance Verification",
    component: "PdfUpload",
  },
  {
    name: "notes",
    label: "Notes",
    type: "text",
    component: Input,
    isBasic: true,
    placeholder: "Enter notes",
    textArea: true,
  },
];

export const FORM_FIELD_ARRAY = [
  {
    name: "deviceType",
    label: "Device Type",
    type: "select",
    key: "deviceType",
    option: loadDeviceTypes,
    placeholder: "Select",
    component: AsyncSelect,
    isMulti : false
  },
  {
    name: "lCode",
    label: "LCode",
    type: "select",
    key: "lCode",
    option: loadlcodeoptions,
    placeholder: "Select",
    component: AsyncSelect,
    isMulti : false
  },
  {
    name: "icdCode",
    label: "ICD Code",
    type: "select",
    key: "icdCode",
    option: loadicdcodeoptions,
    placeholder: "Select",
    component: AsyncSelect,
    isMulti : true
  },
  {
    name: "quantity",
    label: "LCode Quantity",
    type: "number",
    key: "quantity",
    placeholder: "Enter Quantity",
    component: Input,
  },
];

export const PAGE_KEY = {
  DELETE: "delete",
  EXPORT: "export",
  VIEW: "view",
  CALENDOR: "calendor",
  DOWNLOAD: "download",
  INSURANCE: "insurance",
  STATUS_CHANGE: "statusChange",
  DELIVERY_RECEIPT: "deliveryReceipt",
  MEDICAL_NECESSITY: "medicalNecessity",
  STATUS_VIEW:"statusView"
};

export const MODAL_HEADER = {
  calendor: "Appointment",
  download: "Download Package",
  insurance: "Insurance",
  statusChange: "Update Order Status",
};

export const SEGMENT_CONSTANT = [
  { label: "Left", value: 1 },
  { label: "Right", value: 2 },
  { label: "Spine", value: 3 },
  { label: "Bilateral", value: 4 },
];

export { loadLocations };
