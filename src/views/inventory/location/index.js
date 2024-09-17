import React, { useEffect, useState } from 'react';
import { getApi, postApi } from 'services/CommonService';
import { APIS, LIST_DATA_API_TYPE } from 'constants/api.constant';
import { AdaptableCard } from 'components/shared';
import { DataTable } from 'components/shared';
import { toast, Notification } from 'components/ui';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import AddEditDeviceType from './addEdit';
import ActionColumn from 'components/custom/actionColumn';
import { AiFillDelete } from 'react-icons/ai';
import Header from 'components/custom/header';
import ConfirmationContent from 'components/custom/ConfirmationContent';
import {
  TABLE_ACTION_KEYS,
  CONFIRMATION_OBJ,
  DELETE_TOAST,
  UPDATE_TOAST,
  ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM,
} from 'constants/app.constant';
import ActiveInActiveCheckbox from 'components/custom/activeCheckbox';
import hasPermisson, { ACCESS, MODULE, newColumn } from 'utils/hasPermission';

const ACTION_CONSTANT = [
  {
    label: 'Edit',
    key: TABLE_ACTION_KEYS.EDIT,
    show: () => hasPermisson(MODULE.INVLOCATION, ACCESS.WRITE),
  },
  {
    label: <AiFillDelete style={{ fontSize: '1.2rem' }} />,
    key: TABLE_ACTION_KEYS.DELETE,
    toolTip: 'Delete',
    show: () => hasPermisson(MODULE.INVLOCATION, ACCESS.DELETE),
  },
];

const BUTTON_CONSTANT = hasPermisson(MODULE.INVLOCATION, ACCESS.WRITE)
  ? [
      {
        label: 'Add Location',
        key: TABLE_ACTION_KEYS.ADD,
        icon: <HiOutlinePlusCircle />,
      },
    ]
  : [];

const CONFIRMATION_CONSTANT = {
  header: CONFIRMATION_OBJ.HEADER,
  des: CONFIRMATION_OBJ.DELETE,
  buttonLabel: 'Delete',
};

const Locations = () => {
  const [deviceType, setDeviceType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedData, setSelectedData] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [activeConfirm, setActiveConfirm] = useState(false);
  const refreshPage = () => setRefresh((prev) => !prev);

  useEffect(() => {
    setLoading(true);
    getApi(APIS.LIST_DATA, {
      type: LIST_DATA_API_TYPE.INVLOCATION,
      limit,
      search,
      skip: limit * (page - 1),
    })
      .then((res) => {
        setDeviceType([]);
        setDeviceType(res?.data?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  }, [search, page, limit, refresh]);

  const onActionHandle = (e, key, row) => {
    if (key === TABLE_ACTION_KEYS.EDIT) {
      setSelectedData({
        id: row?._id,
        name: row?.name,
      });
      setDrawer(true);
    }
    if (key === TABLE_ACTION_KEYS.DELETE) {
      setSelectedData({
        id: row?._id,
      });
      setOpenModal(true);
    }
  };

  const columns = [
    {
      Header: 'Location ID',
      accessor: 'locationNo',
    },
    {
      Header: 'name',
      accessor: 'name',
    },
    {
      Header: 'Active',
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
      Header: 'Actions',
      id: 'action',
      accessor: (row) => row,
      Cell: (props) => (
        <ActionColumn
          row={props.row.original}
          onActionHandle={onActionHandle}
          actionsMenu={ACTION_CONSTANT}
        />
      ),
    }
  ];

  const onDrawerClose = () => {
    setSelectedData('');
    setDrawer(false);
  };

  const onHeaderButtonClick = (e, key) => {
    if (key === TABLE_ACTION_KEYS.ADD) {
      setDrawer(true);
    }
  };

  const onModalClose = () => {
    setSelectedData('');
    setOpenModal(false);
    setActiveConfirm(false);
  };

  const onConfirmClick = () => {
    let toastMessage;
    const payload = {
      type: LIST_DATA_API_TYPE.INVLOCATION,
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
        buttonMenu={BUTTON_CONSTANT}
        setSearch={setSearch}
        buttonClick={onHeaderButtonClick}
      />
      <AdaptableCard className="h-full" bodyClass="h-full">
        <DataTable
          columns={newColumn(columns, MODULE.INVLOCATION, 1)}
          isCursor={false}
          data={deviceType}
          loading={loading}
          skeletonAvatarColumns={[0]}
          skeletonAvatarProps={{ width: 28, height: 28 }}
          pagingData={{ pageIndex: page, pageSize: limit, total: totalCount }}
          onPaginationChange={(pages) => setPage(pages)}
          onSelectChange={(limits) => setLimit(limits)}
        />
      </AdaptableCard>
      <AddEditDeviceType
        show={drawer}
        onClose={onDrawerClose}
        refreshPage={refreshPage}
        editData={selectedData}
      />

      <ConfirmationContent
        isOpen={openModal}
        onConfirmClick={onConfirmClick}
        header={CONFIRMATION_CONSTANT.header}
        des={activeConfirm ? ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM?.des : CONFIRMATION_CONSTANT.des}
        onDialogClose={onModalClose}
        isWarning={!activeConfirm && CONFIRMATION_OBJ.WARNING}
        buttonLabel={
          activeConfirm
            ? ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM?.buttonLabel
            : CONFIRMATION_CONSTANT.buttonLabel
        }
      />
    </>
  );
};
export default Locations;
