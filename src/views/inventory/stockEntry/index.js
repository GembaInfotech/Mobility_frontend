import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApi, postApi } from 'services/CommonService';
import { APIS, LIST_DATA_API_TYPE } from 'constants/api.constant';
import { toast, Notification } from 'components/ui';
import { AdaptableCard, DataTable } from 'components/shared';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import Header from './header'
import ActionColumn from 'components/custom/actionColumn';
import ConfirmationContent from 'components/custom/ConfirmationContent';
import ActiveInActiveCheckbox from 'components/custom/activeCheckbox';
import hasPermisson, { ACCESS, MODULE, newColumn } from 'utils/hasPermission';
import { FaPen } from "react-icons/fa";
// import { IoIosSend } from "react-icons/io";
import { PAGE_KEY } from 'views/orderManagement/serviceOrder/serviceConstant';
import {
  TABLE_ACTION_KEYS,
  CONFIRMATION_OBJ,
  DELETE_TOAST,
  UPDATE_TOAST,
  ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM,
} from 'constants/app.constant';

const DEL_CONFIRM = {
  header: CONFIRMATION_OBJ.HEADER,
  des: CONFIRMATION_OBJ.DELETE,
  warning: CONFIRMATION_OBJ.WARNING,
  buttonLabel: "Delete",
};

const ACTION_CONSTANT = [
  { label: <FaPen />, key: PAGE_KEY.VIEW, toolTip: "View/Edit", show: () => hasPermisson(MODULE.STOCKENTRY, ACCESS.WRITE) },
  // { label: <IoIosSend />, key: PAGE_KEY.VIEW, toolTip: "Transfer/Edit", show: () => hasPermisson(MODULE.STOCKENTRY, ACCESS.WRITE) }
];

const BUTTON_CONSTANT = [
  {
    label: "Add Stock",
    key: TABLE_ACTION_KEYS.ADD,
    icon: <HiOutlinePlusCircle />,
    show: () => hasPermisson(MODULE.STOCKENTRY, ACCESS.WRITE)
  },
];

const Codes = () => {
  const savedHospitalId = localStorage.getItem("selectedHospitalId");

  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectedData, setSelectedData] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [activeConfirm, setActiveConfirm] = useState(false);
  const [filtervalue, setFilterValue] = useState("");
  const [filterLocationId, setFilterLocationId] = useState("");
  const [filterCompanyId, setFilterCompanyId] = useState("");
  const [filterLCodes, setFilterLCodes] = useState("");
  const [LCodes, setLCodes] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  console.log("filterCompanyId", filterCompanyId);
  console.log("filterLCodes", filterLCodes);
  
  // Fetching data when component mounts or any dependency changes
  let companyId = savedHospitalId
  
  useEffect(() => {
    setLoading(true);
    if(filterCompanyId){
      companyId = filterCompanyId
    }
    getApi(APIS.LIST_DATA, {
     
      type: LIST_DATA_API_TYPE.STOCK_ENTRY,
      locationId: filterLocationId || "",
      companyId: companyId,
      lcodeId: filterLCodes || "",
      limit,
      // companyId:savedHospitalId,
      skip: limit * (page - 1),
    })
      .then((res) => {
        setCodes(res?.data?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  }, [page, limit, refresh, filtervalue, filterLocationId, filterCompanyId,filterLCodes]);

     console.log("checking",codes);
  const onActionHandle = (e, key, row) => {
    e.preventDefault();
    if (key === PAGE_KEY.VIEW) {
      // Pass the full row as `editData` when navigating
      navigate(`/app/stockEntry/edit/${row?._id}`, {
        state: {
          editData: row,  // Pass the full data of the row
        },
      });
    }

  };
  
  
  const onModalClose = () => {
    setSelectedData("");
    setOpenModal(false);
    setActiveConfirm(false);
  };

  const onHeaderButtonClick = (e, key) => {
    if (key === TABLE_ACTION_KEYS.ADD) {
      navigate("/app/stockEntry/add");
    }
  };

  const onConfirmClick = () => {
    let toastMessage;
    const payload = {
      type: LIST_DATA_API_TYPE.INVENTORY,
      id: selectedData?.id,
    };
    if (activeConfirm) {
      toastMessage = UPDATE_TOAST;
      payload.status = +selectedData?.action;
    } else {
      toastMessage = DELETE_TOAST;
      payload.status = 0;
    }

    postApi(APIS.BLOCK_DELETE_DATA, payload).then((res) => {
      toast.push(<Notification type="success">{toastMessage}</Notification>);
      setRefresh((s) => !s);
      onModalClose();
    });
  };

  const columns = [
    {
      Header: "LCodes",
      accessor: (row) => row.lcodeId?.code || "-",
    },
    {
      Header: "Description",
      accessor: (row) => row.lcodeId?.description || "-",
    },
    {
      Header: "Quantity",
      accessor: "quantity",
      Cell: ({ value }) => (
        <span style={{ color: value <= 5 ? "red" : "black" }}>
          {value}
        </span>
      ),
    },
    {
      Header: "Location",
      accessor: (row) => row.locationId?.name || "-",
    },
    {
      Header: "Active",
      Cell: (props) => (
        <ActiveInActiveCheckbox
          dataObj={props}
          setSelectedData={setSelectedData}
          setActiveConfirm={setActiveConfirm}
          setOpenModal={setOpenModal}
        />
      ),
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
      <Header
        buttonMenu={
          hasPermisson(MODULE.STOCKENTRY, ACCESS.WRITE)
            ? BUTTON_CONSTANT
            : BUTTON_CONSTANT.slice(0, BUTTON_CONSTANT.length - 1)
        }
        buttonClick={onHeaderButtonClick}
        setSearch={setSearch}
        filtervalue={filtervalue}
        setFilterValue={setFilterValue}
        setFilterLocationId={setFilterLocationId}
        setFilterCompanyId={setFilterCompanyId}
        filterLocationId={filterLocationId}
        filterCompanyId={filterCompanyId}
        filterLCodes={filterLCodes}
        setFilterLCodes={setFilterLCodes}
        LCodes={LCodes}
      />
      <AdaptableCard className="h-full" bodyClass="h-full">
        <DataTable
          isCursor={false}
          columns={newColumn(columns, MODULE.STOCKENTRY, 1)}
          data={codes}
          loading={loading}
          skeletonAvatarColumns={[0]}
          skeletonAvatarProps={{ width: 28, height: 28 }}
          pagingData={{ pageIndex: page, pageSize: limit, total: totalCount }}
          onPaginationChange={(page) => setPage(page)}
          onSelectChange={(limit) => setLimit(limit)}
        />
      </AdaptableCard>
      <ConfirmationContent
        isOpen={openModal}
        onConfirmClick={onConfirmClick}
        header={DEL_CONFIRM.header}
        des={activeConfirm ? ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM?.des : DEL_CONFIRM.des}
        onDialogClose={onModalClose}
        isWarning={!activeConfirm && DEL_CONFIRM.warning}
        buttonLabel={
          activeConfirm
            ? ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM?.buttonLabel
            : DEL_CONFIRM.buttonLabel
        }
      />
    </>
  );
};

export default Codes;
