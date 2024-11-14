import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApi, postApi } from 'services/CommonService';
import { APIS, LIST_DATA_API_TYPE } from 'constants/api.constant';
import { toast, Notification } from 'components/ui';
import { AdaptableCard, DataTable } from 'components/shared';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import Header from 'components/custom/header';
import ActionColumn from 'components/custom/actionColumn';
import ConfirmationContent from 'components/custom/ConfirmationContent';
import ActiveInActiveCheckbox from 'components/custom/activeCheckbox';
import hasPermisson, { ACCESS, MODULE, newColumn } from 'utils/hasPermission';
import { GrPowerReset } from 'react-icons/gr';
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

const BUTTON_CONSTANT = [
  {
    label: "Add Stock",
    key: TABLE_ACTION_KEYS.ADD,
    icon: <HiOutlinePlusCircle />,
  },
];

// const FILTER_CONSTANT = [
//   {
//     component: "input",
//     placeholder: "Filter By Location",
//     className: "mb-4 w-40",
//     filterKey: "search",
//   },
//   {
//     component: "resetButton",
//     label: "Reset",
//     icon: <GrPowerReset />,
//     className: "mb-4",
//     filterKey: { search: "" },
//   },
// ];

const Codes = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectedData, setSelectedData] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [activeConfirm, setActiveConfirm] = useState(false);
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState({});

  useEffect(() => {
    setLoading(true);
    getApi(APIS.LIST_DATA, {
      type: LIST_DATA_API_TYPE.STOCK_ENTRY,
      limit,
      search,
      skip: limit * (page - 1),
    })
      .then((res) => {
        console.log("dataa", res?.data?.data );
        
        setCodes(res?.data?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  }, [search, page, limit, refresh]);

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
          // actionsMenu={ACTION_CONSTANT}
        />
      ),
    },
  ];

  const onActionHandle = (e, key, row) => {
    if (key === TABLE_ACTION_KEYS.DELETE) {
      setSelectedData({ id: row?._id });
      setOpenModal(true);
    }
    if (key === TABLE_ACTION_KEYS.EDIT) {
      navigate(`/app/stockEntry/edit/${row?._id}`);
    }
  };

  const onModalClose = () => {
    setSelectedData("");
    setOpenModal(false);
    setActiveConfirm(false);
  };

  const onHeaderButtonClick = (e, key) => {
    if (key === TABLE_ACTION_KEYS.ADD) {
      console.log("navigate")
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

  return (
    <>
      <Header
        buttonMenu={
          hasPermisson(MODULE.STOCKENTRY, ACCESS.WRITE)
            ? BUTTON_CONSTANT
            : BUTTON_CONSTANT.slice(0, BUTTON_CONSTANT.length - 1)
        }
        // FilterMenu={FILTER_CONSTANT}
        setSearch={setSearch}
        buttonClick={onHeaderButtonClick}
        setFilterValue={setFilterValue}
        filterValue={filterValue}
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