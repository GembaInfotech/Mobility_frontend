import { Input } from "components/ui";

export const PATIENT_FIELD_CONSTANT = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    component: Input,
    placeholder: "Enter first name",
    isBasic: true,
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    component: Input,
    placeholder: "Enter last name",
    isBasic: true,
  },
  {
    name: "phoneNumber",
    countryCode: "countryCode",
    label: "Mobile No.",
    component: "phoneNumber",
    placeholder: "Enter mobile no.",
  },

  {
    name: "dob",
    label: "DOB",
    component: "datepicker",
  },
  {
    name: "naspacNo",
    label: "NASPAC Case No.",
    type: "text",
    component: Input,
    isBasic: true,
    placeholder: "Enter NASPAC No.",
  },
];

export const INSURANCE_FIELD_CONSTANT = [
  {
    name: "primaryInsurance",
    apiType : "insurance",
    label: "Primary Insurance",
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
    apiType : "insurance",
    label: "Secondary Insurance",
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
  }
];

export const SERVICE_ORDER_FIELDS = [
  {
    name: "deviceType",
    label: "Type of device needed",
    component: "asyncSelect",
    placeholder: "Select device type",
  },
  {
    name: "patientType",
    label: "Is the patient ?",
    component: "patientRadio",
  },
  {
    name: "prescription",
    label: "Prescription",
    component: "upload",
  },
  {
    name: "clinicalAssessment",
    label: "Clinical Assessment",
    component: "upload",
  },
  {
    name: "remarks",
    label: "Remarks",
    type: "text",
    component: Input,
    placeholder: "Enter Remarks",
    textArea: true,
    isBasic: true,
  },
];

export const FORM_GENDER_CONSANT = [
  { label: "Male", value: 1 },
  { label: "Female", value: 2 },
  { label: "Others", value: 3 },
];

export const IS_PATINET = [
  { label: "LTC", value: 1 },
  { label: "Subacute", value: 2 },
];
