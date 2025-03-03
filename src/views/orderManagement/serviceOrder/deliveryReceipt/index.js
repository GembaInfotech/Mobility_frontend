import React, { useEffect, useState, useRef } from "react";
import { Form, Field, useFormik, FormikProvider } from "formik";
import { Button, Input, Notification, toast } from "components/ui";
import { ExportPdf } from "assets/svg";
import dayjs from "dayjs";
import { DATE_FORMAT } from "constants/app.constant";
import { APIS } from "constants/api.constant";
import { getApi, postApi } from "services/CommonService";
import { useParams, useNavigate } from "react-router-dom";
import HeaderPanel from "../headerPanel";
import moment from "moment";
import appConfig from "../../../../configs/app.config";
import { MdKeyboardBackspace } from "react-icons/md";
import hasPermisson, { ACCESS, MODULE } from "utils/hasPermission";

const initialValues = {
  patientName: "",
  patientId: "",
  patientDob: "",
  primaryDeviceType: "",
  lCode: [{ code: "", quantity: 1, description: "" }],
  icd: [{ code: "", description: "" }],
  quantity: "",
  description: "",
  size: "",
  orientation: "",
  monthlyFrequency: "Daily",
  lengthOfNeed: "Life Time",
  startDate: "",
  insuranceInfo: "",
  prescriberName: "",
  prescriberNpi: "",
  doctorName: "",
  doctorNpi: "",
  prescriberAddress: "",
  prescriberWorkPhone: "",
};

const patientInformation = [
  {
    label: "Patient Name",
    name: "patientName",
    placeholder: "Patient Name",
  },
  { label: "Patient ID", name: "patientId", placeholder: "Patient ID" },
  { label: "Patient DOB", name: "patientDob", placeholder: "Patient DOB" },
  {
    label: "Primary Device Type",
    name: "primaryDeviceType",
    placeholder: "Primary Device Type",
  },
];

const prescription = [
  {
    label: "Projected Monthly Frequency",
    name: "monthlyFrequency",
    placeholder: "Projected Monthly Frequency",
  },
  {
    label: "Estimated Length of Need",
    name: "lengthOfNeed",
    placeholder: "Estimated Length of Need",
  },
  { label: "Start Date", name: "startDate", placeholder: "Start Date" },
  {
    label: "Insurance/Medicare Info",
    name: "insuranceInfo",
    placeholder: "Insurance/Medicare Info",
  },
  {
    label: "Prescriber Name",
    name: "prescriberName",
    placeholder: "Prescriber Name",
  },
  {
    label: "Prescriber NPI",
    name: "prescriberNpi",
    placeholder: "Prescriber NPI",
  },
  { label: "Doctor Name", name: "doctorName", placeholder: "Doctor Name" },
  { label: "Doctor NPI", name: "doctorNpi", placeholder: "Doctor NPI" },
  {
    label: "Prescriber Address",
    name: "prescriberAddress",
    placeholder: "Prescriber Address",
  },
  {
    label: "Prescriber Work Phone",
    name: "prescriberWorkPhone",
    placeholder: "Prescriber Work Phone",
  },
];

const DeliveryReceipt = () => {
  const { id } = useParams();
  const [editData, setEditData] = useState();
  const navigate = useNavigate();
  const canEdit = hasPermisson(MODULE.SERVICEORDER, ACCESS.WRITE);
  const savedHospitalId = localStorage.getItem("selectedHospitalId");

  useEffect(() => {
    if (id) {
      getApi(APIS.GET_SERVICE_ORDER, { id, companyId: savedHospitalId }).then((result) => {
        const { patientId, physicianId, prescriptions, renderingPhysicianId } =
          result?.data?.data;
        const obj = {};
        obj.orderNo = `${result?.data?.data?.orderNo || ""}`;
        obj.patientName = `${patientId?.lastName} ${patientId?.firstName}`;
        obj.patientId = `${patientId?.patientNo || ""}`;
        obj.patientDob = `${dayjs(patientId?.dob).format(DATE_FORMAT) || ""}`;
        obj.startDate = `${
          dayjs(result?.data?.data?.createdAt).format(DATE_FORMAT) || ""
        }`;
        obj.primaryDeviceType = `${prescriptions?.[0]?.deviceType?.name || ""}`;

        obj.insuranceInfo = `${patientId?.primaryInsurance?.name || ""}`;
        obj.prescriberName = `${physicianId?.name || ""}`;
        obj.prescriberNpi = `${physicianId?.npiNo || ""}`;
        obj.prescriberAddress = `${physicianId?.address || ""}`;
        obj.prescriberWorkPhone = `${physicianId?.countryCode || ""}-${
          physicianId?.phoneNumber || ""
        }`;
        obj.monthlyFrequency = "Daily";
        obj.lengthOfNeed = "Life Time";

        obj.doctorName = `${renderingPhysicianId?.name || "-"}`;
        obj.doctorNpi = `${renderingPhysicianId?.npiNo || "-"}`;

        obj.lCode = prescriptions?.map((item, i) => ({
          code: item.lCode?.code,
          description: item.lCode?.description || "",
          quantity: item.quantity || "1",
          size: "No",
          orientation: "No",
        }));
        setEditData(obj);
      });
    }
  }, [id]);

  const formik = useFormik({
    initialValues: id ? editData : initialValues,
    enableReinitialize: true,
    // validationSchema: schema,
    onSubmit: (payload) => {
      payload.companyId = savedHospitalId
      postApi(APIS.GENERATE_PDF, { data: payload, type: 2 })
        .then((res) => {
          if (res?.data?.path) {
            toast.push(<Notification type="success">Success</Notification>);
            window.open(
              `${appConfig.imageBaseUrl}${res?.data?.path}`,
              "_blank"
            );
          } else {
            toast.push(
              <Notification type="error">
                Something went wrong! Try After sometime
              </Notification>
            );
          }
        })
        .catch((err) => {
          toast.push(<Notification type="error">{err}</Notification>);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  const { values, handleSubmit, setFieldValue, isSubmitting, setSubmitting } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Form
        className="p-1"
        onSubmit={handleSubmit}
        autoComplete="off"
        noValidate
      >
        <div className="flex mb-3 justify-between">
          <h3 className="mb-10"></h3>
          <div className="flex">
            <Button
              size="sm"
              variant="solid"
              className="flex items-center  mr-5 gap-2"
              loading={isSubmitting}
              type="submit"
            >
              <ExportPdf />
              Export PDF
            </Button>
            <Button
              size="sm"
              variant="solid"
              onClick={() => navigate("/app/orderManagement/service-order")}
              type="button"
              className="flex items-center"
            >
              <MdKeyboardBackspace style={{ fontSize: "20px" }} />
              Back / Cancel
            </Button>
          </div>
        </div>

        <div className="border border-black">
          <div className="p-8">
            <div className="text-[20px]">
              <div className="text-black">North American</div>
              <div className="uppercase text-[#A4D3F9]">Spine & pain</div>
            </div>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-center text-xl font-bold mb-4">
                DME Delivery Receipt
              </h2>
              <h2 className="text-center text-lg mb-8">
                Product Dispensed - Signature Form
              </h2>

              <div className="max-w-4xl mx-auto my-2 border border-black">
                <div className="py-4 mb-2">
                  <h3 className="font-bold mb-2 text-center">
                    Patient Information
                  </h3>
                  <div className="overflow-x-auto">
                    <div className="grid grid-cols-4 border-y border-black">
                      {patientInformation.map((it, index) => (
                        <div
                          key={index}
                          className={`flex flex-col ${
                            index !== patientInformation?.length - 1
                              ? "border-r border-black"
                              : ""
                          } `}
                        >
                          <label className="p-2 text-black font-medium border-b border-black">
                            {it.label}
                          </label>
                          <div className="p-2">
                            <Field
                              name={it.name}
                              placeholder={it.placeholder}
                              className="w-full"
                              component={Input}
                              disabled={!canEdit}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="py-1 mb-2">
                  <h3 className="font-bold mb-2 text-center">
                    Product / Procedure
                  </h3>
                  <div className="overflow-x-auto border-y border-black">
                    {values?.lCode?.map((it, index) => (
                      <div key={index} className="flex">
                        <div className="flex flex-col border-r border-black">
                          <label className="p-2 text-black font-medium border-b border-black">
                            L-Code
                          </label>
                          <div className="p-2">
                            <Input
                              name={"code"}
                              placeholder={""}
                              className="w-[100px]"
                              value={it.code}
                              disabled={!canEdit}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col border-r border-black">
                          <label className="p-2 text-black font-medium border-b border-black">
                            Quantity
                          </label>
                          <div className="p-2">
                            <Input
                              name={"quantity"}
                              placeholder={""}
                              className="w-[100px]"
                              value={it.quantity}
                              disabled={!canEdit}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col flex-1 border-r border-black">
                          <label className="p-2 text-black font-medium border-b border-black">
                            Description
                          </label>
                          <div className="p-2">
                            <Input
                              name={"description"}
                              placeholder={""}
                              className="w-full"
                              value={it.description}
                              disabled={!canEdit}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col border-r border-black">
                          <label className="p-2 text-black font-medium border-b border-black">
                            Size
                          </label>
                          <div className="p-2">
                            <Input
                              name={"size"}
                              placeholder={""}
                              className="w-[80px]"
                              value={it?.size || ""}
                              disabled={!canEdit}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col border-r border-black">
                          <label className="p-2 text-black font-medium border-b border-black">
                            Orientation
                          </label>
                          <div className="p-2">
                            <Input
                              name={"orientation"}
                              placeholder={""}
                              className="w-[80px]"
                              value={it?.orientation || ""}
                              disabled={!canEdit}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="py-4 mb-2">
                  <h3 className="font-bold mb-2 text-center">Prescription</h3>
                  <div className="overflow-x-auto">
                    <div className="grid grid-cols-3 border-t border-black">
                      {prescription.map((field, index) => (
                        <div
                          key={index}
                          className={`${
                            [3, 4, 5, 8, 9].includes(index)
                              ? "border-y border-black"
                              : ""
                          } ${
                            [0, 1, 3, 4, 6, 8].includes(index)
                              ? "border-r border-black"
                              : ""
                          } flex flex-col ${
                            index === 7 || index === 8 ? "col-span-2" : ""
                          }`}
                        >
                          <label className="text-black font-medium border-b border-black p-2">
                            {field.label}
                          </label>
                          <div className="p-2">
                            <Field
                              name={field.name}
                              placeholder={field.placeholder}
                              className="w-full"
                              component={Input}
                              disabled={!canEdit}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ pageBreakBefore: "always", margin: "20px" }}>
                <div className="flex flex-col gap-5">
                  <h4 className="uppercase">
                    Authorization to Assign Benefits to Provider & Release
                    Medical Information
                  </h4>
                  <div>
                    My signature below states that I request and authorize
                    payment from the Centers for Medicare and Medicaid Services
                    or my Primary, Secondary or Tertiary Insurance carriers of
                    benefit to be made on my behalf to the above company and its
                    physician or medical staff for medical equipment, products
                    or services that they have provided me. I further authorize
                    the above provider and authorized holders of my medical
                    information to release to the Centers of Medicare and
                    Medicaid Services and its agents or affiliates any
                    information needed to determine these benefits or compliance
                    with current healthcare standards. I have received a copy of
                    the HIPAA privacy statement. I certify that the information
                    given by me in applying for payment under Title XVIII of the
                    Social Security Act, or under a policy of insurance is
                    correct. I authorized any of my medical providers or any
                    other holder of my medical information or the above named
                    patient, to be released or received by any governmental
                    agency or insurance company to whom application has been
                    made for payment for services rendered to myself or the
                    above patient; to any physicians, other healthcare providers
                    or facilities, institutions or agencies providing treatment
                    to myself or the above-named patient or providing continuity
                    of care and to quality reviewers. The terms of the agreement
                    are incorporated herein and part hereof, and I acknowledge
                    that I have read the same and received a copy thereof. I
                    authorize North American Spine and Pain to provide care
                    and/or services. I understand that I have the right to make
                    decisions about my medical care, including the right to
                    accept or refuse medical or surgical treatment or equipment.
                  </div>
                  <div className="text-black uppercase">
                    my signature below states that i have received the above
                    medical equipment item(s) in good condition and in proper
                    working order, i have been properly trained and instructed
                    on the use and care of the medical equipment(s) and the
                    manufacture guidelines, product safety (home safety
                    assessment), maintenance and cleaning and warranties. i
                    understand and have read my rights and responsibilities
                    along with repair and refund policies. my signature below
                    also states that the item(s) dispensed to me have been
                    inspected for structural safety and meet the specifications
                    of my current prescription/written doctor's order. i have
                    read and agree to each and all of the terms and conditions
                    written in this document. i consent to receive medical
                    equipment and services from the above-named provider.
                  </div>
                </div>

                <div className="uppercase flex justify-between text-black mt-16 font-semibold">
                  <div>
                    <hr className="my-3 border-t-2 border-black" /> Patient
                    Signature
                  </div>
                  <div className="flex items-center ml-6">
                    <span className="ml-1">date:</span>
                    <hr className="my-3 mb-1 ml-1 border-t-2 border-black w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </FormikProvider>
  );
};

export default DeliveryReceipt;
