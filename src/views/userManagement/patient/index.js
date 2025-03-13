import { AdaptableCard } from "components/shared";
import React, { useEffect, useState } from "react";
import { DataTable } from "components/shared";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getApi, postApi } from "services/CommonService";
import { APIS, LIST_DATA_API_TYPE } from "constants/api.constant";
import { toast, Notification, Avatar } from "components/ui";
import ActionColumn from "components/custom/actionColumn";
import { AiFillDelete } from "react-icons/ai";
import ConfirmationContent from "components/custom/ConfirmationContent";
import Header from "components/custom/header";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import appConfig from "configs/app.config";
import {
  TABLE_ACTION_KEYS,
  CONFIRMATION_OBJ,
  DELETE_TOAST,
  UPDATE_TOAST,
  ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM,
  DATE_TIME_FORMAT,
  ACTIVE_STATUS_OPTONS,
} from "constants/app.constant";
import { IMAGES } from "../../../assets/icon";
import ActiveInActiveCheckbox from "components/custom/activeCheckbox";
import UserPasswordConfirm from "components/custom/userPasswordConfirm";
import ExportContent from "components/custom/exportContent";
import { GrPowerReset } from "react-icons/gr";
import hasPermisson, {
  ACCESS,
  MODULE,
  getFormattedPhoneNum,
  userColumn,
} from "utils/hasPermission";


const ACTION_CONSTANT = [
  {
    label: "Edit",
    key: TABLE_ACTION_KEYS.EDIT,
    show: () => hasPermisson(MODULE.PATIENT, ACCESS.WRITE),
  },
  // {
  //   label: <FaKey style={{ fontSize: "1.2rem" }} />,
  //   key: TABLE_ACTION_KEYS.CHANGE_PASSWORD,
  //   toolTip: "Change Password",
  //   show: () => hasPermisson(MODULE.PATIENT, ACCESS.WRITE),
  // },
  {
    label: <AiFillDelete style={{ fontSize: "1.1rem" }} />,
    key: TABLE_ACTION_KEYS.DELETE,
    show: () => hasPermisson(MODULE.PATIENT, ACCESS.DELETE),
    toolTip: "Delete",
  },
  {
    label: IMAGES.VIEW_IMAGE,
    key: TABLE_ACTION_KEYS.NAVIGATE,
    isImage: true,
    toolTip: "View Prescriptions",
    show: () => hasPermisson(MODULE.SERVICEORDER, ACCESS.READ),
  },
];

const DEL_CONFIRM = {
  header: CONFIRMATION_OBJ.HEADER,
  des: CONFIRMATION_OBJ.DELETE,
  warning: CONFIRMATION_OBJ.WARNING,
  buttonLabel: "Delete",
};

const BUTTON_CONSTANT = [
  {
    label: "Add Patient",
    key: TABLE_ACTION_KEYS.ADD,
    icon: <HiOutlinePlusCircle />,
  },
  // {
  //   label: "Export Excel",
  //   key: TABLE_ACTION_KEYS.EXPORT,
  //   icon: <AiOutlineFile />,
  // },
];

const FILTER_CONSTANT = [
  {
    component: "select",
    options: ACTIVE_STATUS_OPTONS,
    className: "mb-4 w-40",
    placeholder: "Status",
    filterKey: "status",
  },
  {
    component: "datePicker",
    placeholder: "DOB",
    className: "mb-4 w-64",
    filterKey: "dob",
  },
  {
    component: "input",
    placeholder: "Mobile Number",
    className: "mb-4 w-40",
    filterKey: "mobile",
  },
  {
    component: "resetButton",
    label: "Reset",
    icon: <GrPowerReset />,
    className: "mb-4",
    filterKey: { status: "", dob: null, search: "" },
  },
];


const PatientManagement = () => {
  const savedHospitalId = localStorage.getItem("selectedHospitalId");
  const [filterCompanyId, setFilterCompanyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [tags, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectedData, setSelectedData] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [activeConfirm, setActiveConfirm] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState("");
  const [openExportModal, setOpenExportModal] = useState(false);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState({
    status: "",
  });
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const NameColumn = ({ row }) => {
    return (
      <div className="flex items-center">
        {row?.imageUrlThumbnail !== null && row?.imageUrlThumbnail ? (
          <Avatar
            size={28}
            shape="circle"
            className="mr-2"
            src={`${appConfig.imageBaseUrl}${row?.imageUrlThumbnail}`}
          />
        ) : (
          <Avatar size={28} shape="circle" className="mr-2">
            {row?.firstName?.[0]?.toUpperCase()}
          </Avatar>
        )}

        <div className="w-32">{`${row?.firstName || row?.lastName
            ? `${row?.lastName ? row?.lastName : ""
            }, ${row?.firstName ? row?.firstName : ""} `
            : "-"
          }`}</div>
      </div>
    );
  };

  useEffect(() => {
    getApi(APIS.LIST_DATA, {
      type: LIST_DATA_API_TYPE.PATIENTS,
      limit,
      search,
      companyId: filterCompanyId?._id ?? savedHospitalId,
      status: filterValue?.status ? filterValue?.status?.value : null,
      patientDob: filterValue?.dob ? dayjs(filterValue.dob).format("MM/DD/YYYY") : null,
      mobile: filterValue?.mobile ? filterValue.mobile : null,
      skip: limit * (page - 1),
    })
      .then((res) => {
        setData(res?.data?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  }, [savedHospitalId, search, page, limit, refresh, filterValue, filterCompanyId]);


  const onActionHandle = (e, key, row) => {
    if (key === TABLE_ACTION_KEYS.DELETE) {
      setSelectedData({
        id: row?._id,
      });
      setOpenModal(true);
    }
    if (key === TABLE_ACTION_KEYS.EDIT) {
      navigate(`/app/patient/edit/${row?._id}`);
    }
    if (key === TABLE_ACTION_KEYS.NAVIGATE) {
      navigate(`/app/orderManagement/service-order/${row?._id}`);
    }
  };

  const onModalClose = () => {
    setSelectedData("");
    setOpenModal(false);
    setActiveConfirm(false);
    setOpenExportModal(false);
    setOpenPasswordModal("");
  };

  const onHeaderButtonClick = (e, key) => {
    if (key === TABLE_ACTION_KEYS.ADD) {
      navigate("/app/patient/add");
    }
    if (key === TABLE_ACTION_KEYS.EXPORT) {
      setOpenExportModal(true);
    }
  };

  const Caselabel = savedHospitalId === "67c3ec77851f03d96270ca85"
    ? "NASPAC Case No."
    : savedHospitalId === "67c3fb8308a4d79e36ebf939"
      ? "PPS Case No."
      : "Case No.";

  const columns = [
    {
      Header: "Patient ID",
      Cell: (props) => {
        const row = props.row.original;
        return row?.patientNo === null ? "-" : row?.patientNo;
      },
    },
    {
      Header: "Patient Name",
      Cell: (props) => {
        const row = props.row.original;
        return <NameColumn row={row} />;
      },
    },
    {
      Header: "Mobile",
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="flex items-center whitespace-nowrap">
            <p>{`${row?.countryCode} ${getFormattedPhoneNum(
              row?.phoneNumber
            )}`}</p>
            {/* {dataObj === 1 && (
              <img
                className="ml-1 h-5 w-5"
                src={`${LOGO_SRC_PATH}verified.png`}
                alt={`${APP_NAME} logo`}
              />
            )} */}
          </div>
        );
      },
    },

    {
      Header: "DOB",
      Cell: (props) => {
        const row = props.row.original;
        return `${dayjs(row?.dob).format("MM/DD/YYYY") || '-'}`;
      },
    },

    {
      Header: `${Caselabel}`,
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="flex items-center ">
            {row?.naspacNo ? row?.naspacNo : "-"}
          </div>
        );
      },
    },

    {
      Header: "Registered On",
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="flex items-center ">
            {dayjs.utc(row?.createdAt).tz("America/New_York").format(DATE_TIME_FORMAT)}
          </div>
        );
      },
    },

    {
      Header: "Active",
      Cell: (props) => {
        return (
          <ActiveInActiveCheckbox
            dataObj={props}
            setSelectedData={setSelectedData}
            setActiveConfirm={setActiveConfirm}
            setOpenModal={setOpenModal}
          />
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

  const onConfirmClick = () => {
    let toastMessage;
    const payload = {
      type: LIST_DATA_API_TYPE.PATIENTS,
      id: selectedData?.id,
    }
    if (activeConfirm) {
      toastMessage = UPDATE_TOAST;
      payload.status = +selectedData?.action;

    } else {
      toastMessage = DELETE_TOAST;
      payload.status = 0
    }

    postApi(APIS.BLOCK_DELETE_DATA, payload).then((res) => {
      toast.push(<Notification type="success">{toastMessage}</Notification>);
      setRefresh((s) => !s);
      onModalClose();
    });
  };

  return (
    <>
      <Header
        buttonMenu={
          hasPermisson(MODULE.PATIENT, ACCESS.WRITE)
            ? BUTTON_CONSTANT
            : BUTTON_CONSTANT.slice(0, BUTTON_CONSTANT.length - 1)
        }
        FilterMenu={FILTER_CONSTANT}
        setFilterCompanyId={setFilterCompanyId}
        filterCompanyId={filterCompanyId}
        setSearch={setSearch}
        buttonClick={onHeaderButtonClick}
        setFilterValue={setFilterValue}
        filterValue={filterValue}
        searchPlaceholder="Search with Code, Name, Email, Mobile"
      />

      <AdaptableCard className="h-full" bodyClass="h-full">
        <DataTable
          isCursor={false}
          columns={userColumn(columns, MODULE.PATIENT)}
          data={tags}
          loading={loading}
          skeletonAvatarColumns={[0]}
          skeletonAvatarProps={{ width: 28, height: 28 }}
          pagingData={{ pageIndex: page, pageSize: limit, total: totalCount }}
          onPaginationChange={(pages) => setPage(pages)}
          onSelectChange={(limits) => setLimit(limits)}
        />
      </AdaptableCard>

      <ConfirmationContent
        isOpen={openModal}
        onConfirmClick={onConfirmClick}
        header={DEL_CONFIRM.header}
        des={
          activeConfirm
            ? ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM?.des
            : DEL_CONFIRM.des
        }
        onDialogClose={onModalClose}
        isWarning={!activeConfirm && DEL_CONFIRM.warning}
        buttonLabel={
          activeConfirm
            ? ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM?.buttonLabel
            : DEL_CONFIRM.buttonLabel
        }
      />
      <UserPasswordConfirm
        isOpen={!!openPasswordModal}
        onDialogClose={onModalClose}
        selectedId={openPasswordModal}
        setRefresh={setRefresh}
      />
      <ExportContent
        type="3"
        isOpen={openExportModal}
        onDialogClose={onModalClose}
      />
    </>
  );
};

export default PatientManagement;
