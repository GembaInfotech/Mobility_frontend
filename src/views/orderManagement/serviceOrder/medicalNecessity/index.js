import React, { useEffect, useState, useRef } from "react";
import { Form, Field, useFormik, FormikProvider } from "formik";
import { Button, Input, Notification, toast } from "components/ui";
import { ExportPdf } from "assets/svg";
import dayjs from "dayjs";
import { DATE_FORMAT } from "constants/app.constant";
import { APIS } from "constants/api.constant";
import { getApi, postApi } from "services/CommonService";
import { useParams, useNavigate } from "react-router-dom";
import hasPermisson, { ACCESS, MODULE } from "utils/hasPermission";
import HeaderPanel from "../headerPanel";
import { MdKeyboardBackspace } from "react-icons/md";
import moment from "moment";
import appConfig from "../../../../configs/app.config";

const initialValues = {
  patientName: "",
  patientId: "",
  patientDob: "",
  primaryDeviceType: "",
  lCode: [{ code: "", quantity: 1, description: "" }],
  icd: [{ code: "", description: "" }],
  quantity: "",
  description: "",
  monthlyFrequency: "Daily",
  lengthOfNeed: "Life Time",
  startDate: "",
  insuranceInfo: "",
  prescriberName: "",
  prescriberNpi: "",
  prescriberAddress: "",
  prescriberWorkPhone: "",
  notes: "",
};

const patientInformation = [
  {
    label: "Patient Name ",
    name: "patientName",
    placeholder: "Patient Name ",
    // show: () => hasPermisson(MODULE.SERVICEORDER, ACCESS.READ),
  },
  { label: "Patient ID", name: "patientId", placeholder: "Patient ID" },
  { label: "Patient DOB", name: "patientDob", placeholder: "Patient DOB" },
  {
    label: "Device Type",
    name: "primaryDeviceType",
    placeholder: "Primary Device Type",
  },
];

const prescription = [
  {
    label: "Projected Monthly Frequency",
    name: "monthlyFrequency",
    placeholder: "Projected Monthly Frequency",
    value: "Daily",
  },
  {
    label: "Estimated Length of Need",
    name: "lengthOfNeed",
    placeholder: "Estimated Length of Need",
    value: "Life Time",
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
  {
    label: "Doctor Name",
    name: "doctorName",
    placeholder: "Doctor Name",
  },
  {
    label: "Doctor NPI",
    name: "doctorNpi",
    placeholder: "Doctor NPI",
  },
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

const MedicalNecessity = () => {
  const { id } = useParams();
  const [editData, setEditData] = useState();
  const componentRef = useRef();
  const navigate = useNavigate();
  const canEdit = hasPermisson(MODULE.SERVICEORDER, ACCESS.WRITE);
  const savedHospitalId = localStorage.getItem("selectedHospitalId");

  useEffect(() => {
    if (id) {
      getApi(APIS.GET_SERVICE_ORDER, { id, companyId:savedHospitalId}).then((result) => {
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
        obj.notes = `${result?.data?.data?.notes || ""}`;
        obj.lCode = prescriptions?.map((item, i) => ({
          code: item.lCode?.code,
          description: item.lCode?.description || "",
          quantity: item.quantity || "1",
        }));

        obj.doctorName = `${renderingPhysicianId?.name || "-"}`;
        obj.doctorNpi = `${renderingPhysicianId?.npiNo || "-"}`;

        obj.icd = prescriptions?.flatMap((item) =>
          item.icdCode?.map((icd) => ({
            code: icd?.code,
            description: icd?.description || "",
          }))
        );

        obj.monthlyFrequency = "Daily";
        obj.lengthOfNeed = "Life Time";

        setEditData(obj);
      });
    }
  }, [id]);

  const formik = useFormik({
    initialValues: id ? editData : initialValues,
    enableReinitialize: true,
    // validationSchema: schema,
    onSubmit: (payload) => {
      console.log("payload payload", payload)
      payload.companyId = savedHospitalId
      postApi(APIS.GENERATE_PDF, { data: payload, type: 1 })
        .then((res) => {
          toast.push(<Notification type="success">Success</Notification>);
          window.open(`${appConfig.imageBaseUrl}${res?.data?.path}`, "_blank");
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
        {/* <HeaderPanel componentRef={componentRef} orderDetails={editData} /> */}
        <div className="border border-black">
          <div className="p-8" ref={componentRef}>
            <div className="text-[20px] text-center mb-4 border-b border-black">
              <h1>North American Spine & Pain Clinic</h1>
              {/* <div className="text-black">North American</div> */}
              {/* <div className="uppercase text-[#A4D3F9]">Spine & pain</div> */}
            </div>
            <div className="page-header"></div>
            <h2 className="text-center text-xl font-bold mb-4">
              RX / Detailed Written Order and Letter of Medical Necessity
            </h2>
            <div className="max-w-4xl mx-auto my-2 border border-black">
              <div className="py-4 mb-2">
                <h3 className="font-bold mb-2 text-center">
                  Patient Information
                </h3>
                <div className="overflow-visible">
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
                <div className="overflow-visible border-y border-black">
                  {values?.lCode?.map((item, index) => (
                    <div key={index} className="flex">
                      <div className="flex flex-col border-r border-black">
                        <label className="p-2 text-black font-medium border-b border-black">
                          L-Code
                        </label>
                        <div className="p-2">
                          <Input
                            name={"code"}
                            placeholder="L-Code"
                            className="w-[100px]"
                            value={item?.code}
                            onChange={(e) => {
                              const { value } = e.target;
                              const newValues = values;
                              newValues.lCode[index].code = value;
                              setFieldValue("lCode", newValues.lCode);
                            }}
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
                            placeholder="Quantity"
                            className="w-[100px]"
                            value={item?.quantity}
                            onChange={(e) => {
                              const { value } = e.target;
                              const newValues = values;
                              newValues.lCode[index].quantity = value;
                              setFieldValue("lCode", newValues.lCode);
                            }}
                            disabled={!canEdit}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col flex-1">
                        <label className="p-2 text-black font-medium border-b border-black">
                          Description
                        </label>
                        <div className="p-2">
                          <Input
                            name={"description"}
                            placeholder=""
                            className="w-full text-wrap"
                            value={item?.description}
                            onChange={(e) => {
                              const { value } = e.target;
                              const newValues = values;
                              newValues.lCode[index].description = value;
                              setFieldValue("lCode", newValues.lCode);
                            }}
                            disabled={!canEdit}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="py-4 mb-2">
                <h3 className="font-bold mb-2 text-center">Diagnosis</h3>
                <div className="overflow-visible border-y border-black">
                  {values?.icd?.map((item, index) => (
                    <div key={index} className="flex">
                      <div className={`flex flex-col border-r border-black`}>
                        {index === 0 && (
                          <label className="p-2 text-black font-medium border-b border-black">
                            ICD
                          </label>
                        )}
                        <div
                          className={`p-2 ${
                            index !== values?.icd?.length - 1
                              ? "border-b border-black"
                              : ""
                          }`}
                        >
                          <Input
                            name={"code"}
                            placeholder="ICD"
                            className="w-[100px]"
                            value={item?.code}
                            onChange={(e) => {
                              const { value } = e.target;
                              const newValues = values;
                              newValues.icd[index].code = value;
                              setFieldValue("icd", newValues.icd);
                            }}
                            disabled={!canEdit}
                          />
                        </div>
                      </div>
                      <div className={`flex flex-col justify-between flex-1`}>
                        {index === 0 && (
                          <label className="p-2 text-black font-medium border-b border-black">
                            Description
                          </label>
                        )}
                        <div
                          className={`p-2 ${
                            index !== values?.icd?.length - 1
                              ? "border-b border-black"
                              : ""
                          }`}
                        >
                          <Input
                            name={"description"}
                            placeholder=""
                            className="w-full text-balance"
                            value={item?.description}
                            onChange={(e) => {
                              const { value } = e.target;
                              const newValues = values;
                              newValues.icd[index].description = value;
                              setFieldValue("icd", newValues.icd);
                            }}
                            disabled={!canEdit}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ pageBreakBefore: "always", margin: "20px" }}>
              {/* <div className="text-[20px] text-center mb-4 border-b border-black">
              <h1>North American Spine & Pain Clinic</h1>
            </div> */}
              {/* <div className="text-[20px]">
                <div className="text-black">North American</div>
                <div className="uppercase text-[#A4D3F9]">Spine & pain</div>
              </div> */}
              <div className="max-w-4xl mx-auto my-2 border border-black">
                <h3 className="font-bold p-2 text-center">Prescription</h3>
                <div className="overflow-visible">
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
                          index === 6 || index === 8 ? "col-span-2" : ""
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
              <div className="text-black my-5">
                The above procedure and any repair and/or parts to maintain
                proper fit and function are appropriate for this patient and are
                deemed medically necessary.
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <h4>Medical Necessity</h4>
                </div>
                <div>
                  <Field
                    className="w-full"
                    component={Input}
                    textArea
                    type="text"
                    autoComplete="off"
                    name="notes"
                    placeholder=""
                    rows="10"
                    disabled={!canEdit}
                  />
                </div>
              </div>
              <div className="uppercase flex justify-between text-black mt-12 font-semibold">
                <div>
                  <hr className="my-3 border-t-2 border-black" /> Prescriber
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
      </Form>
    </FormikProvider>
  );
};

export default MedicalNecessity;
