import React, { useState, useEffect } from "react";
import Header from "./header";
import appConfig from "configs/app.config";
import { AdaptableCard, DataTable } from "components/shared";

// import useThemeClass from "utils/hooks/useThemeClass";

import { getApi, postApi } from "services/CommonService";
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Dialog, Tag, toast } from "components/ui";
import Confirmation from "./confirmation";
import {
  PAGE_KEY,
  SERVICE_ORDER_STATUS,
  SEGMENT_CONSTANT,
} from "./serviceConstant";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { FaPen, FaDownload, FaEye } from "react-icons/fa";
// import { Tooltip } from "components/ui";
import {
  CONFIRMATION_OBJ,
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  DELETE_TOAST,
  TABLE_ACTION_KEYS,
} from "constants/app.constant";
import ExportContent from "components/custom/exportContent";
import { IMAGES } from "assets/icon";
import ActionColumn from "components/custom/actionColumn";
import hasPermisson, {
  ACCESS,
  MODULE,
} from "utils/hasPermission";
import { AiOutlineFile, AiFillFileAdd, AiFillDelete } from "react-icons/ai";
import ConfirmationContent from "components/custom/ConfirmationContent";
import Notification from "components/template/Notification";

const ACTION_CONSTANT = [
  { label: <FaPen />, key: PAGE_KEY.VIEW, toolTip: "View/Edit", show: () => hasPermisson(MODULE.SERVICEORDER, ACCESS.WRITE) },
  // { label: <FaDownload />, key: PAGE_KEY.DOWNLOAD, toolTip: "Download Forms", show: () => hasPermisson(MODULE.SERVICEORDER, ACCESS.READ) },
  {
    label: IMAGES.EXPORT,
    key: PAGE_KEY.MEDICAL_NECESSITY,
    isImage: true,
    toolTip: "Medical Necessity",
    show: () => hasPermisson(MODULE.SERVICEORDER, ACCESS.READ),
  },
  {
    label: IMAGES.RECEIPT,
    key: PAGE_KEY.DELIVERY_RECEIPT,
    isImage: true,
    toolTip: "Delivery Receipt",
    show: () => hasPermisson(MODULE.SERVICEORDER, ACCESS.READ),
    
  },
  {
    label: <AiFillDelete style={{ fontSize: "1rem" }} />,
    key: PAGE_KEY.DELETE,
    toolTip: "Delete",
    show: () => hasPermisson(MODULE.SERVICEORDER, ACCESS.DELETE),
  },
];

const STATUS_ACTION = [
  { label: <FaEye />, key: PAGE_KEY.STATUS_VIEW, toolTip: "View", show: () => hasPermisson(MODULE.SERVICEORDER, ACCESS.READ) },
]

const BUTTON_CONSTANT = [
  {
    label: "Export Excel",
    key: TABLE_ACTION_KEYS.EXPORT,
    icon: <AiOutlineFile />,
    show: () => hasPermisson(MODULE.SERVICEORDER, ACCESS.READ),
  },
  {
    label: "Update Excel",
    key: TABLE_ACTION_KEYS.IMPORT,
    icon: <AiOutlineFile />,
    show: () => hasPermisson(MODULE.SERVICEORDER, ACCESS.READ),
  },
  {
    label: "Add Prescription",
    key: TABLE_ACTION_KEYS.ADD,
    icon: <AiFillFileAdd />,
    // show: () => hasPermisson(MODULE.SERVICEORDER, ACCESS.WRITE),
  },
];

const ServiceOrder = () => {
  const savedHospitalId = localStorage.getItem("selectedHospitalId");
  const location = useLocation();

  const { id } = useParams();
  const [tabledata, setTableData] = useState([]);
  //const [filterParams, setFilterParams] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [filtervalue, setFilterValue] = useState("");
  const [selectedDate, setSelectedDate] = useState({
    startDate: "",
    endDate: "",
  });
  
  const [filterPatientId, setFilterPatientId] = useState("");

  const [filterPatientDob, setFilterPatientDob] = useState("");
  const [filterNad, setFilterNad] = useState("");
  const [filterNalId, setFilterNalId] = useState("");
  const [filterCompanyId, setFilterCompanyId] = useState("");
  const [filterPhysicianId, setFilterPhysicianId] = useState("");
  const [filterLcodeId, setFilterLcodeId] = useState("");
  const [filterInsuranceId, setFilterInsuranceId] = useState("");
  const [selectedData, setSelectedData] = useState("");
  const [payload, setPayload] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file
  const navigate = useNavigate();
  

  dayjs.extend(utc);
  dayjs.extend(timezone);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log("params",window.location.search);
    const physicianId = JSON.parse(params.get("physicianId"));
    const insuranceId = JSON.parse(params.get("insuranceId"));
    const lcodeId = JSON.parse(params.get("lcodeId"));
    const patientDob = params.get("patientDob");
    const nal = JSON.parse(params.get("nal"));
    const orderStatus = JSON.parse(params.get("orderStatus"));
    const nad = params.get("nad");
    const PatientId = JSON.parse(params.get("PatientId"));
    console.log(orderStatus);
    setFilterPhysicianId(physicianId);
    setFilterPatientDob(patientDob);
    setFilterLcodeId(lcodeId);
    setFilterInsuranceId(insuranceId);
    setFilterNalId(nal);
    setFilterValue(orderStatus);
    setFilterNad(nad);
    setFilterPatientId(PatientId);
  }, [location.search]);
  console.log("filterPatientId",filterPatientId);
  useEffect(() => {
    if (id) {
      console.log("getting id from params ", id);

      getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.PATIENTS, id, companyId:savedHospitalId }).then(
        (result) => {
          console.log("get order status", result)
          setFilterPatientId(result?.data?.data);
        }
      );
    }
  }, []);
  // useEffect(() => {
  //   var companyId;
  //   if (filterCompanyId && filterCompanyId._id) {
  //     companyId = filterCompanyId._id;
  //   } else {
  //     companyId = savedHospitalId;
  //   }
  // },[filterCompanyId])

  useEffect(() => {
    const payload = {
      limit,
      search,
      // companyId: typeof filterCompanyId === "object" && filterCompanyId !== null 
      // ? filterCompanyId._id 
      // : savedHospitalId,
      companyId: filterCompanyId?._id ?? savedHospitalId,
      nalId: filterNalId?._id,
      // companyId: filterCompanyId._id,
      patientId:filterPatientId?._id,
      physicianId: filterPhysicianId?._id,
      lcodeId: filterLcodeId?._id,
      insuranceId: filterInsuranceId?._id,
      skip: limit * (page - 1),
    };
    console.log(payload)
    setPayload(payload);
    
    if (filterPatientDob && filterPatientDob !== "") payload.patientDob = filterPatientDob

    if (filtervalue && filtervalue?.value) payload.status = filtervalue?.value;

    if (selectedDate?.startDate && selectedDate?.endDate) {
      payload.startDate = selectedDate?.startDate;
      payload.endDate = selectedDate?.endDate;
    }

    if (filterNad && filterNad !== "") payload.nad = filterNad

    getApi(APIS.GET_SERVICE_ORDER, payload)
      .then((res) => {
        console.log("orderStatus get", res)
        setTableData(res?.data?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  }, [
    search,
    page,
    limit,
    filtervalue,
    filterPatientId,
    filterNalId,
    filterCompanyId,
    filterPhysicianId,
    filterLcodeId,
    filterInsuranceId,
    refresh,
    selectedDate,
    filterPatientDob,
    filterNad
  ]);

  console.log("SelectedDate",selectedDate);
  const onActionHandle = (e, value, row) => {
    e.preventDefault();
    if (value === PAGE_KEY.VIEW) {
      const queryParams = new URLSearchParams({
        physicianId: JSON.stringify(filterPhysicianId) || "",
        patientDob: filterPatientDob || "",
        lcodeId: JSON.stringify(filterLcodeId) || "",
        insuranceId: JSON.stringify(filterInsuranceId) || "",
        nal: JSON.stringify(filterNalId) || "",
        orderStatus: JSON.stringify(filtervalue) || "",
        nad: filterNad || "",   
        PatientId: JSON.stringify(filterPatientId) || ""  
      }).toString();
      navigate(`/app/service-order/edit/${row?._id}?${queryParams}`);
    } else if (value === PAGE_KEY.DELIVERY_RECEIPT) {
       window.open(`/app/orderManagement/delivery-receipt/${row?._id}`, '_blank', 'noopener,noreferrer');
    } else if (value === PAGE_KEY.MEDICAL_NECESSITY) {
      window.open(`/app/orderManagement/medical-necessity/${row?._id}`,'_blank','noopener,noreferrer');
    } else {
      setOpenModal(true);
      setSelectedKey(value);
      setSelectedData(row);
    }
  };

  const onDialogClose = () => {
    setSelectedKey("");
    setOpenModal(false);
    setRefresh(!refresh);
    setSelectedData("");
    setOpenExportModal(false);
  };

  const TagSection = ({ status, selectedRow }) => {
    const valueobj = SERVICE_ORDER_STATUS.find(
      (option) => option?.value === status
    );
    return (
      <div
        className="flex justify-center"
        onClick={() => {
          setSelectedKey(PAGE_KEY.STATUS_CHANGE);
          setOpenModal(true);
          setSelectedData(selectedRow);
        }}
      >
        <Tag
          className={`bg-${[
            valueobj?.color,
          ]}-100 text-gray-600 rounded border-0 cursor-pointer`}
        >
          {valueobj?.label}
        </Tag>
      </div>
    );
  };

  const onHeaderButtonClick = (e, key) => {
    if (key === TABLE_ACTION_KEYS.ADD) {
      const path = "/app/service-order/add"
      if (id && filterPatientId)
        navigate(path, { state: { patientData: filterPatientId } });
      else navigate(path);
    }
    if (key === TABLE_ACTION_KEYS.EXPORT) {
      setOpenExportModal(true);
    }
    if (key === TABLE_ACTION_KEYS.IMPORT) {
      setOpenImportModal(true);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file.name);

      const formData = new FormData();
      formData.append('file', file);

      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1] instanceof File ? pair[1].name : pair[1]}`);
      }

      postApi(APIS.UPDATE_EXCEL_DATA, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((res) => {

          console.log("update excell", res);

          const downloadLink = document.createElement('a');
          downloadLink.href = appConfig.imageBaseUrl + res?.filePath;
          downloadLink.download = 'file_name.xlsx';

          // Trigger a click event on the download link
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          console.log("API Response:", res);
          toast.push(<Notification type="success">File uploaded and updated successfully!</Notification>);
        })
        .catch((error) => {
          toast.push(
            <Notification type="error">
              Error uploading file: {error?.res?.message || "Unknown error"}
            </Notification>
          );
        });

      e.target.value = null;
    }
  };


  const onDeleteSubmit = () => {
    postApi(APIS.BLOCK_DELETE_DATA, {
      id: selectedData?._id,
      type: LIST_DATA_API_TYPE.PRESCRIPTIONS,
      status: 0,
    })
      .then((res) => {
        toast.push(<Notification type="success">{DELETE_TOAST}</Notification>);
        onDialogClose();
      })
      .catch((err) => {
        toast.push(
          <Notification type="error">
            {err?.response?.data?.message}
          </Notification>
        );
      });
  };

  const Caselabel = savedHospitalId === "67c3ec77851f03d96270ca85"
  ? "NASPAC Case No."
  : savedHospitalId === "67c3fb8308a4d79e36ebf939"
  ? "PPS Case No."
  : "Case No.";
  const columns = [
    {
      Header: "Presc. Date",
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="flex items-center w-35">
            {dayjs.utc(row?.createdAt).tz("America/New_York").format(DATE_TIME_FORMAT)}
          </div>
        );
      },
    },
    {
      Header: "Patient Details",
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="w-40">
            <p>{`${row?.patientId?.lastName}, ${row?.patientId?.firstName}`}</p>
            <span className="text-gray-600 text-xs font-semibold">
              {row?.patientId?.patientNo}
            </span>
          </div>
        );
      },
    },
    {
      Header:`${Caselabel}`,
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="w-40">
            <span className="text-gray-600 text-xs font-semibold">
              {row?.patientId?.naspacNo}
            </span>
          </div>
        );
      },
    },
    {
      Header: "NAD",
      Cell: (props) => {
        const row = props.row.original;
        return `${dayjs(row?.nextAppointmentDate).format(DATE_FORMAT) || "-"}`;
      },
    },

    {
      Header: "NAL",
      Cell: (props) => {
        const row = props.row.original;
        return `${row?.appointmentLocationId?.name || "-"}`;
      },
    },

    {
      Header: "LCodes",
      accessor: "",
      Cell: (props) => {
        const row = props.row.original;
        return (
          row?.prescriptions?.map((item, index) => <div className="w-40" key={index}>
            {
              `${item?.lCode?.code} - ${item?.quantity} qty. - ${item?.lCode?.description}`
            }
          </div>
          )
        );
      },
    },

    {
      Header: "Orientation",
      accessor: "",
      Cell: (props) => {
        const row = props.row.original;
    
        return (
          row?.prescriptions?.map((item, index) => {
            const segmentLabel = SEGMENT_CONSTANT.find(seg => seg.value === item?.segment)?.label || "-";
    
            return (
              <div className="w-40" key={index}>
                {segmentLabel}
              </div>
            );
          })
        );
      },
    },
    
    {
      Header: "Referring Physician",
      Cell: (props) => {
        const row = props.row.original;
        return `${row?.physicianId?.name ? row?.physicianId?.name : ""}`;
      },
    },

    {
      Header: "Insurance",
      accessor: "",
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="flex items-center">
            {
              row?.patientId?.primaryInsurance?.name || 'Self Pay'
            }
          </div>
        );
      },
    },

    // {
    //   Header: "Presc. Doc",
    //   accessor: "",
    //   Cell: (props) => {
    //     const row = props.row.original;
    //     if(row?.prescriptionDocument && row?.prescriptionDocument?.original){
    //       return (
    //         <Tooltip title={"Download"} visible={true}>
    //           <img
    //             src={IMAGES.DOWNLOAD_PDF}
    //             alt="donwload Icon"
    //             style={{ maxWidth: "20px", height: "24px" }}
    //             className="cursor-pointer mx-0.5"
    //             onClick={() => window.open(`${appConfig.imageBaseUrl}${row?.prescriptionDocument?.original}`, "_blank")}
    //           />
    //         </Tooltip>
    //       );
    //     }
    //     else {
    //       return ( <div className="flex items-center">-</div>)
    //     }

    //   },
    // },

    {
      Header: "Presc. Status",
      accessor: "",
      Cell: (props) => {
        const row = props.row.original;
        console.log("ROW",row.orderStatus);
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <TagSection status={row?.orderStatus} selectedRow={row} />
            <ActionColumn
              row={row}
              onActionHandle={onActionHandle}
              actionsMenu={STATUS_ACTION}
            />
          </div>
        );
      },
    },

    {
      Header: "Actions",
      id: "action",
      accessor: (row) => row,
      Cell: (props) => (
        <ActionColumn
          row={props.row.original}
          onActionHandle={onActionHandle}
          actionsMenu={ACTION_CONSTANT}
        />
      ),
    },
  ];

  // Define the Location column
  const locationColumn = {
    Header: "Location",
    Cell: (props) => {
      const row = props.row.original;
      return row.locationId?.name || "-";
    },
  };

  // Find if any row has Dropship in Process status (orderStatus === 12)
  const hasDropshipInProcess = tabledata.some(row => row.orderStatus === 12);

  // Find the index of the NAL column
  const nalIndex = columns.findIndex(col => col.Header === "NAL");

  // Conditionally insert the Location column after NAL
  let displayColumns = columns;
  if (hasDropshipInProcess && nalIndex !== -1) {
    displayColumns = [
      ...columns.slice(0, nalIndex + 1),
      locationColumn,
      ...columns.slice(nalIndex + 1)
    ];
  }

  const ImportModal = ({ isOpen, onClose }) => {
    const handleClose = () => {
      setSelectedFile(null);
      onClose();
    };
    return (
      <Dialog isOpen={isOpen} onClose={handleClose}>
        <h3>Import Excel File</h3>
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileUpload}
          style={{ display: "none" }} // Hide the default file input
          id="file-upload" // Assign an ID for the label
        />
        <label htmlFor="file-upload">
          <strong>Choose file</strong>
        </label>
        {selectedFile && <p>Chosen file: {selectedFile}</p>}{" "}
        {/* Display chosen file name */}
      </Dialog>
    );
  };

  return (
    <>
      {id && filterPatientId && (
        <h3>
          Of {filterPatientId?.firstName} {filterPatientId?.lastName}
        </h3>
      )}
      <Header
        buttonMenu={
          hasPermisson(MODULE.SERVICEORDER, ACCESS.WRITE)
            ? BUTTON_CONSTANT
            : BUTTON_CONSTANT.slice(0, BUTTON_CONSTANT.length - 1)
        }
        buttonClick={onHeaderButtonClick}
        setSearch={setSearch}
        filtervalue={filtervalue}
        setFilterValue={setFilterValue}
        setFilterPatientId={setFilterPatientId}
        setFilterNalId={setFilterNalId}
        setFilterCompanyId={setFilterCompanyId}
        setFilterPhysicianId={setFilterPhysicianId}
        setFilterLcodeId={setFilterLcodeId}
        setFilterInsuranceId={setFilterInsuranceId}
        filterPatientId={filterPatientId}
        filterPhysicianId={filterPhysicianId}
        filterLcodeId={filterLcodeId}
        filterInsuranceId = {filterInsuranceId}
        filterNalId={filterNalId}
        filterCompanyId={filterCompanyId}

        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setFilterPatientDob={setFilterPatientDob}
        filterPatientDob={filterPatientDob}
        setFilterNad={setFilterNad}
        filterNad={filterNad}
      />
      <AdaptableCard className="h-full" bodyClass="h-full">
        <DataTable
          isCursor={false}
          columns={displayColumns}
          data={tabledata}
          loading={loading}
          skeletonAvatarColumns={[0]}
          skeletonAvatarProps={{ width: 28, height: 28 }}
          pagingData={{ pageIndex: page, pageSize: limit, total: totalCount }}
          onPaginationChange={(limitpage) => setPage(limitpage)}
          onSelectChange={(limitPage) => setLimit(limitPage)}
        />
      </AdaptableCard>
      {selectedKey === PAGE_KEY.DELETE && (
        <ConfirmationContent
          isOpen={openModal}
          onConfirmClick={onDeleteSubmit}
          header={CONFIRMATION_OBJ.HEADER}
          des={CONFIRMATION_OBJ.DELETE}
          onDialogClose={onDialogClose}
          isWarning={CONFIRMATION_OBJ.WARNING}
          buttonLabel={"Delete"}
        />
      )}

      {selectedKey === PAGE_KEY.STATUS_VIEW && (
        <Dialog
          isOpen={openModal}
          onClose={onDialogClose}
          onRequestClose={onDialogClose}
          contentClassName="py-10 pl-20 pr-40 mt-60 min-w-36"
        >
        <div>
         {tabledata && (
        <>
          <p className="font-bold text-md mb-2 text-blue-900">Comments:</p>
          {Array.isArray(tabledata[0]?.comments) && tabledata[0].comments.length > 0 ? (
            tabledata[0].comments.map((comment, index) => (
              <p key={index} className="ml-4 mb-1">
                {typeof comment === "string"
                  ? comment
                  : <>
                      {comment.comment || JSON.stringify(comment)}
                      {comment.commentAddedBy?.email && (
                        <span style={{ color: "#2563eb", marginLeft: 8, fontSize: "0.9em" }}>
                          ({comment.commentAddedBy.email})
                        </span>
                      )}
                    </>
                }
              </p>
            ))
          ) : (
            <p className="ml-4">No comments available</p>
          )}
        </>
      )}
    </div>
        </Dialog>

      )}

      {(selectedKey !== PAGE_KEY.DELETE && selectedKey !== PAGE_KEY.STATUS_VIEW) && (
        <Dialog
          isOpen={openModal}
          onClose={onDialogClose}
          onRequestClose={onDialogClose}
          contentClassName="pb-0 px-0 mt-30 min-w-36"
        >
          <Confirmation
            selectedKey={selectedKey}
            selectedData={selectedData}
            closeDialog={onDialogClose}
          />
        </Dialog>
      )}
      <ImportModal
        isOpen={openImportModal}
        onClose={() => setOpenImportModal(false)}
        setSelectedFile={setSelectedFile}
      />
      <ExportContent
        Payload={payload}
        user={filterPatientId}
        type="1"
        isOpen={openExportModal}
        onDialogClose={onDialogClose}
      />
    </>
  );
};

export default ServiceOrder;

