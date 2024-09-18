import React, { useState, useEffect } from "react";
import Header from "./header";
import { AdaptableCard, DataTable } from "components/shared";
// import useThemeClass from "utils/hooks/useThemeClass";
import { getApi, postApi } from "services/CommonService";
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, Tag, toast } from "components/ui";
import Confirmation from "./confirmation";
import {
  PAGE_KEY,
  SERVICE_ORDER_STATUS,
} from "./serviceConstant";
import dayjs from "dayjs";
import { FaPen, FaDownload } from "react-icons/fa";
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
  { label: <FaDownload />, key: PAGE_KEY.DOWNLOAD, toolTip: "Download Forms", show: () => hasPermisson(MODULE.SERVICEORDER, ACCESS.READ) },
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

const BUTTON_CONSTANT = [
  {
    label: "Export Excel",
    key: TABLE_ACTION_KEYS.EXPORT,
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
  const { id } = useParams();
  const [tabledata, setTableData] = useState([]);
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
  const [ filterNalId, setFilterNalId] = useState("");
  const [ filterPhysicianId, setFilterPhysicianId] = useState("");
  const [ filterLcodeId, setFilterLcodeId] = useState("");
  const [selectedData, setSelectedData] = useState("");
  const [payload, setPayload] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    if (id) {
      
      getApi(APIS.LIST_DATA, { type: LIST_DATA_API_TYPE.PATIENTS, id }).then(
        (result) =>{
          // console.log(result)
           setFilterPatientId(result?.data?.data);
        }
      );
    }
  }, []);

  useEffect(() => {
    const payload = {
      limit,
      search,
      patientId: filterPatientId && filterPatientId?._id,
      nalId: filterNalId._id,
      physicianId: filterPhysicianId._id,
      lcodeId: filterLcodeId._id,
      skip: limit * (page - 1),
    };
    console.log(payload)
  setPayload(payload);

    if(filterPatientDob && filterPatientDob !== "") payload.patientDob = filterPatientDob

    if (filtervalue && filtervalue?.value) payload.status = filtervalue?.value;

    if (selectedDate?.startDate && selectedDate?.endDate) {
      payload.startDate = selectedDate?.startDate;
      payload.endDate = selectedDate?.endDate;
    }

    if(filterNad && filterNad !== "") payload.nad = filterNad

    getApi(APIS.GET_SERVICE_ORDER, payload)
      .then((res) => {
        console.log(res)
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
    filterPhysicianId,
    filterLcodeId,
    refresh,
    selectedDate,
    filterPatientDob,
    filterNad
  ]);



  const onActionHandle = (e, value, row) => {
    e.preventDefault();
    if (value === PAGE_KEY.VIEW) {
      navigate(`/app/service-order/edit/${row?._id}`);
    } else if (value === PAGE_KEY.DELIVERY_RECEIPT) {
      navigate(`/app/orderManagement/delivery-receipt/${row?._id}`);
    } else if (value === PAGE_KEY.MEDICAL_NECESSITY) {
      navigate(`/app/orderManagement/medical-necessity/${row?._id}`);
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

  const columns = [
    // {
    //   Header: "Presc. ID",
    //   Cell: (props) => {
    //     const row = props.row.original;
    //     return (
    //       <div className="flex items-center ">
    //         {row?.orderNo !== null && row?.orderNo ? row?.orderNo : "-"}
    //       </div>
    //     );
    //   },
    //   accessor: "orderNo",
    // },
    {
      Header: "Presc. Date",
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="flex items-center w-35">
            {dayjs(row?.createdAt).format(DATE_TIME_FORMAT)}
          </div>
        );
      },
    },
    // {
    //   Header: 'Order Status',
    //   Cell: (props) => (
    //     <TagSection status={props?.row?.original?.orderStatus} selectedRow={props?.row?.original} />
    //   ),
    // },
    // {
    //   Header: "Patient ID",
    //   Cell: (props) => {
    //     const row = props.row.original;
    //     return row?.patientId?.patientNo ? row?.patientId?.patientNo : "-";
    //   },
    // },
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
        return `${row?.appointmentLocationId?.name ||  "-"}`;
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
              `${item?.lCode?.code} - ${item?.quantity} qty.`
            }
          </div>
          )
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
        return <TagSection status={row?.orderStatus} selectedRow={row} />;
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
        setFilterNalId = {setFilterNalId}
        setFilterPhysicianId = {setFilterPhysicianId}
        setFilterLcodeId={setFilterLcodeId}
        filterPatientId={filterPatientId}
        filterPhysicianId = {filterPhysicianId}
        filterLcode={filterLcodeId}
        filterNalId = {filterNalId}
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
          columns={columns}
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
      {selectedKey !== PAGE_KEY.DELETE && (
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

      <ExportContent
        Payload= {payload}
        user={filterPatientId}
        type="1"
        isOpen={openExportModal}
        onDialogClose={onDialogClose}
      />
    </>
  );
};

export default ServiceOrder;
