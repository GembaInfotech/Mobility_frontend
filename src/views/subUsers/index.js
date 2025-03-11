import { AdaptableCard, DataTable } from 'components/shared';
import React, { useEffect, useState } from 'react';
import { Avatar, toast, Notification } from 'components/ui';
import useThemeClass from 'utils/hooks/useThemeClass';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getApi, postApi } from 'services/CommonService';
import { APIS, LIST_DATA_API_TYPE } from 'constants/api.constant';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import ActionColumn from 'components/custom/actionColumn';
import ConfirmationContent from 'components/custom/ConfirmationContent';
import { AiFillDelete } from 'react-icons/ai';
import Header from 'components/custom/header';
import {
  TABLE_ACTION_KEYS,
  CONFIRMATION_OBJ,
  DELETE_TOAST,
  UPDATE_TOAST,
  ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM,
  DATE_TIME_FORMAT,
} from 'constants/app.constant';
import ActiveInActiveCheckbox from 'components/custom/activeCheckbox';
import hasPermisson, { ACCESS, MODULE, newColumn } from 'utils/hasPermission';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const ACTION_CONSTANT = [
  { label: 'Edit', key: TABLE_ACTION_KEYS.EDIT , show: ()=> hasPermisson(MODULE.SUBUSERS, ACCESS.WRITE)},
  {
    label: <AiFillDelete style={{ fontSize: '1.2rem' }} />,
    key: TABLE_ACTION_KEYS.DELETE,
    toolTip: 'Delete',
    show: ()=> hasPermisson(MODULE.SUBUSERS, ACCESS.DELETE)
  },
];

const CONFIRMATION_CONSTANT = {
  header: CONFIRMATION_OBJ.HEADER,
  des: CONFIRMATION_OBJ.DELETE,
  buttonLabel: 'Delete',
};

const BUTTON_CONSTANT = hasPermisson(MODULE.SUBUSERS, ACCESS.WRITE)
  ? [
      {
        label: 'Add Sub Admin',
        key: TABLE_ACTION_KEYS.ADD,
        icon: <HiOutlinePlusCircle />,
      },
    ]
  : [];
const FILTER_CONSTANT = [];

const NameColumn = ({ row }) => {
  const { textTheme } = useThemeClass();
  return (
    <div className="flex items-center">
      <Avatar size={28} shape="circle">
        {row?.name?.[0]?.toUpperCase()}
      </Avatar>

      <Link className={`hover:${textTheme} ml-2 rtl:mr-2 font-semibold`}>{row?.name || '-'}</Link>
    </div>
  );
};

const Admins = () => {
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectedData, setSelectedData] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [activeConfirm, setActiveConfirm] = useState(false);
  const navigate = useNavigate();
  dayjs.extend(utc);
  dayjs.extend(timezone);
  ////// GET LIST ADMINS FROM API///////////

  useEffect(() => {
    getApi(APIS.LIST_DATA, {
      type : LIST_DATA_API_TYPE.ADMINS,
      limit,
      search,
      skip: limit * (page - 1),
    })
      .then((res) => {
        setTags(res?.data?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  }, [refresh, search, page, limit]);

  const onActionHandle = (e, key, row) => {
    if (key === TABLE_ACTION_KEYS.EDIT) {
      navigate(`/app/sub-user/edit/${row?._id}`);
    }
    if (key === TABLE_ACTION_KEYS.DELETE) {
      setSelectedData({
        id: row?._id,
      });
      setOpenModal(true);
    }
  };
  const onModalClose = () => {
    setSelectedData('');
    setOpenModal(false);
  };

  const onHeaderButtonClick = (e, key) => {
    if (key === TABLE_ACTION_KEYS.ADD) {
      navigate('/app/sub-user/add');
    }
  };

  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      Cell: (props) => {
        const row = props.row.original;
        return <NameColumn row={row} />;
      },
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Is Super Admin?',
      accessor: 'superAdmin',
      Cell: (props) => {
        const row = props.row.original;
        return row?.superAdmin ? "True" : "False" 
      },
    },

    {
      Header: 'Date added',
      accessor: 'createdAt',
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="flex items-center">{dayjs.utc(row?.createdAt).tz("America/New_York").format(DATE_TIME_FORMAT)}</div>
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
    }
  ];

  const onConfirmClick = () => {
    let toastMessage;
    const payload = {
      type: LIST_DATA_API_TYPE.ADMINS,
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

  const DEL_CONFIRM = {
    header: CONFIRMATION_OBJ.HEADER,
    des: CONFIRMATION_OBJ.DELETE,
    warning: CONFIRMATION_OBJ.WARNING,
    buttonLabel: "Delete",
  };

  return (
    <>
      <Header
        buttonMenu={BUTTON_CONSTANT}
        FilterMenu={FILTER_CONSTANT}
        setSearch={setSearch}
        buttonClick={onHeaderButtonClick}
      />
      <AdaptableCard className="h-full" bodyClass="h-full">
        <DataTable
          isCursor={false}
          columns={newColumn(columns, MODULE.SUBUSERS, 1)}
          data={tags}
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
        header={CONFIRMATION_CONSTANT.header}
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

export default Admins;
