import React, { useEffect, useState } from 'react';
import { getApi, postApi } from 'services/CommonService';
import { APIS, LIST_DATA_API_TYPE } from 'constants/api.constant';
import { AdaptableCard, DataTable } from 'components/shared';
import Header from './Header';
import { AiFillDelete } from 'react-icons/ai';
import { toast, Notification } from 'components/ui';
import ConfirmationContent from 'components/custom/ConfirmationContent';
import {
  ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM,
  DELETE_TOAST,
  UPDATE_TOAST,
} from 'constants/app.constant';
import { TABLE_ACTION_KEYS, CONFIRMATION_OBJ } from 'constants/app.constant';
import AddEditInsurance from './addEdit';
import ActiveInActiveCheckbox from 'components/custom/activeCheckbox';
import hasPermisson, { ACCESS, MODULE, newColumn } from 'utils/hasPermission';
import ActionColumn from 'components/custom/actionColumn';

const ACTION_CONSTANT = [
  {
    label: 'Edit',
    key: TABLE_ACTION_KEYS.EDIT,
    show: () => hasPermisson(MODULE.INSURANCES, ACCESS.WRITE),
  },
  {
    label: <AiFillDelete style={{ fontSize: '1.2rem' }} />,
    key: TABLE_ACTION_KEYS.DELETE,
    toolTip: 'Delete',
    show: () => hasPermisson(MODULE.INSURANCES, ACCESS.DELETE),
  },
];

const Insurances = () => {
  const [tabledata, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isAddEdit, setIsAddEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedData, setSelectedData] = useState('');
  const [activeConfirm, setActiveConfirm] = useState(false);

  useEffect(() => {
    getApi(APIS.LIST_DATA, {
      type : LIST_DATA_API_TYPE.INSURANCES,
      limit,
      search,
      skip: limit * (page - 1),
    })
      .then((res) => {
        setTableData(res?.data?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  }, [search, page, limit, refresh]);

  const onActionHandle = (event, key, row) => {
    setSelectedRow(row);
    if (key === TABLE_ACTION_KEYS.EDIT) {
      row.phoneNumber = row?.countryCode + row?.phoneNumber
      setIsAddEdit(true);
    }
    if (key === TABLE_ACTION_KEYS.DELETE) {
      setOpenModal(true);
    }
  };

  const onDialogClose = () => {
    setOpenModal(false);
    setSelectedRow('');
    setActiveConfirm(false);
  };

  const CONFIRMATION_CONSTANT = {
    header: CONFIRMATION_OBJ.HEADER,
    des: CONFIRMATION_OBJ.DELETE,
    buttonLabel: 'Delete',
  };

  const onDialogOk = () => {
    let toastMessage;
    console.log('selectedRow', selectedRow)
    const payload = {
      type: LIST_DATA_API_TYPE.INSURANCES,
      id: selectedRow?._id,
    }
    if (activeConfirm) {
      toastMessage = UPDATE_TOAST;
      payload.status = +selectedRow?.action;
    
    } else {
      toastMessage = DELETE_TOAST;
      payload.status = 0
    }

    postApi(APIS.BLOCK_DELETE_DATA, payload).then((res) => {
      toast.push(<Notification type="success">{toastMessage}</Notification>);
      setRefresh((s) => !s);
      onDialogClose();
    });
  };

  const closeAddEdit = () => {
    setIsAddEdit(false);
    setRefresh(!refresh);
    setSelectedRow('');
  };

  const columns = [
  
    {
      Header: 'Company Name',
      Cell: (props) => {
        const row = props?.row?.original;
        return <div className="flex items-center w-40">{row?.name}</div>;
      },
    },
    {
      Header: 'Address',
      accessor: 'address',
      Cell: (props) => {
        const row = props?.row?.original;
        return (
          <div className="flex items-center w-40">
            {row?.address}
          </div>
        );
      },
    },
    {
      Header: 'Mobile',
      accessor: 'mobile',
      Cell: (props) => {
        const row = props?.row?.original;
        return (
          <div className="flex items-center w-40">
            {row?.countryCode} - {row?.phoneNumber}
          </div>
        );
      },
    },

    {
      Header: 'Email',
      accessor: 'email',
      Cell: (props) => {
        const row = props?.row?.original;
        return (
          <div className="flex items-center w-40">
            {row?.email}
          </div>
        );
      },
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
    },
    
  ];

  return (
    <>
      {isAddEdit ? (
        <AddEditInsurance closeAddEdit={closeAddEdit} selectedRow={selectedRow} />
      ) : (
        <>
          <Header setSearch={setSearch} addButtonClick={() => setIsAddEdit(true)} />
          <AdaptableCard className="h-full" bodyClass="h-full">
            <DataTable
              columns={newColumn(columns, MODULE.INSURANCES, 1)}
              data={tabledata}
              loading={loading}
              skeletonAvatarColumns={[0]}
              skeletonAvatarProps={{ width: 28, height: 28 }}
              pagingData={{
                pageIndex: page,
                pageSize: limit,
                total: totalCount,
              }}
              onPaginationChange={(limitpage) => setPage(limitpage)}
              onSelectChange={(limitPage) => setLimit(limitPage)}
            />
          </AdaptableCard>

          <ConfirmationContent
            isOpen={openModal}
            onConfirmClick={onDialogOk}
            header={CONFIRMATION_CONSTANT.header}
            des={
              activeConfirm ? ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM?.des : CONFIRMATION_OBJ.DELETE
            }
            isWarning={!activeConfirm && CONFIRMATION_OBJ.WARNING}
            onDialogClose={onDialogClose}
            buttonLabel={
              activeConfirm
                ? ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM?.buttonLabel
                : CONFIRMATION_CONSTANT.buttonLabel
            }
          />
        </>
      )}
    </>
  );
};
export default Insurances;
