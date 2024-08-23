import { AdaptableCard } from 'components/shared';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'components/shared';
import dayjs from 'dayjs';
import { getApi, postApi } from 'services/CommonService';
import { APIS } from 'constants/api.constant';
import { toast, Notification, Avatar } from 'components/ui';
import ActionColumn from 'components/custom/actionColumn';
import { AiFillDelete, AiOutlineFile } from 'react-icons/ai';
import ConfirmationContent from 'components/custom/ConfirmationContent';
import Header from 'components/custom/header';
import appConfig from 'configs/app.config';
import {
  TABLE_ACTION_KEYS,
  CONFIRMATION_OBJ,
  DELETE_TOAST,
  UPDATE_TOAST,
  ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM,
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  APP_NAME,
  ACTIVE_STATUS_OPTONS,
} from 'constants/app.constant';
import { FaKey } from 'react-icons/fa';
import ActiveInActiveCheckbox from 'components/custom/activeCheckbox';
import UserPasswordConfirm from 'components/custom/userPasswordConfirm';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { LOGO_SRC_PATH } from 'components/template/Logo';
import ExportContent from 'components/custom/exportContent';
import { GrPowerReset } from 'react-icons/gr';
import hasPermisson, {
  ACCESS,
  MODULE,
  getFormattedPhoneNum,
  userActionMenu,
  userColumn,
} from 'utils/hasPermission';

const STAFF_TYPE = [
  { label: 'Clinician', value: 1 },
  { label: 'Technician', value: 2 },
];

const ACTION_CONSTANT = [
  { label: 'Edit', key: TABLE_ACTION_KEYS.EDIT },
  {
    label: <FaKey style={{ fontSize: '1.2rem' }} />,
    key: TABLE_ACTION_KEYS.CHANGE_PASSWORD,
    toolTip: 'Change Password',
  },
  {
    label: <AiFillDelete style={{ fontSize: '1.2rem' }} />,
    key: TABLE_ACTION_KEYS.DELETE,
    toolTip: 'Delete',
  },
];

const DEL_CONFIRM = {
  header: CONFIRMATION_OBJ.HEADER,
  des: CONFIRMATION_OBJ.DELETE,
  warning: CONFIRMATION_OBJ.WARNING,
  buttonLabel: 'Delete',
};

const BUTTON_CONSTANT = [
  {
    label: 'Add Staff',
    key: TABLE_ACTION_KEYS.ADD,
    icon: <HiOutlinePlusCircle />,
  },
  {
    label: 'Export Excel',
    key: TABLE_ACTION_KEYS.EXPORT,
    icon: <AiOutlineFile />,
  },
];

const FILTER_CONSTANT = [
  {
    component: 'select',
    options: ACTIVE_STATUS_OPTONS,
    className: 'mb-4 w-40	',
    placeholder: 'Status',
    filterKey: 'status',
  },
  {
    component: 'resetButton',
    label: 'Reset',
    icon: <GrPowerReset />,
    className: 'mb-4',
    filterKey: { status: '' },
  },
];

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

      <div className="w-36">{`${
        row?.firstName || row?.lastName
          ? `${row?.firstName ? row?.firstName : ''} ${row?.lastName ? row?.lastName : ''} 
            `
          : '-'
      }`}</div>
    </div>
  );
};

const StaffManagement = () => {
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectedData, setSelectedData] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [activeConfirm, setActiveConfirm] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState('');
  const [openExportModal, setOpenExportModal] = useState(false);
  const [filterValue, setFilterValue] = useState({
    status: '',
  });
  const navigate = useNavigate();

  ////// GET LIST ADMINS FROM API///////////

  useEffect(() => {
    getApi(APIS.GET_USERS, {
      limit,
      search,
      userType: 2,
      status: filterValue?.status ? filterValue?.status?.value : null,
      skip: limit * (page - 1),
    })
      .then((res) => {
        setTags(res?.data?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  }, [search, page, limit, refresh, filterValue]);

  const onActionHandle = (e, key, row) => {
    if (key === TABLE_ACTION_KEYS.DELETE) {
      setSelectedData({
        id: row?.id,
      });
      setOpenModal(true);
    }
    if (key === TABLE_ACTION_KEYS.EDIT) {
      navigate(`/app/staff/edit/${row?.id}`);
    }
    if (key === TABLE_ACTION_KEYS.CHANGE_PASSWORD) {
      setOpenPasswordModal(row?.id);
    }
  };

  const onModalClose = () => {
    setSelectedData('');
    setOpenModal(false);
    setActiveConfirm(false);
    setOpenPasswordModal('');
    setOpenExportModal(false);
  };

  const onHeaderButtonClick = (e, key) => {
    if (key === TABLE_ACTION_KEYS.ADD) {
      navigate('/app/staff/add');
    }
    if (key === TABLE_ACTION_KEYS.EXPORT) {
      setOpenExportModal(true);
    }
  };

  const columns = [
    {
      Header: 'Actions',
      id: 'action',
      accessor: (row) => row,
      Cell: (props) => (
        <ActionColumn
          row={props.row.original}
          onActionHandle={onActionHandle}
          actionsMenu={userActionMenu(MODULE.PROVIDER, ACTION_CONSTANT)}
        />
      ),
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
      Header: 'Enrollment Number',
      Cell: (props) => {
        const row = props.row.original;
        return row?.enrollmentNumber;
      },
    },
    {
      Header: 'Member Details',
      Cell: (props) => {
        const row = props.row.original;
        return <NameColumn row={row} />;
      },
    },
    {
      Header: 'Job Type',
      Cell: (props) => {
        const dataObj = STAFF_TYPE.find((item, i) => item.value === props?.row?.original?.jobType);
        return dataObj?.label ? dataObj?.label : '-';
      },
    },
    {
      Header: 'Email',
      Cell: (props) => {
        const row = props.row.original;
        const dataObj = row?.isEmailVerify;
        return (
          <div className="flex items-center whitespace-nowrap">
            <p>{row?.email} </p>
            {dataObj === 1 && (
              <img
                className="ml-1 h-5 w-5"
                src={`${LOGO_SRC_PATH}verified.png`}
                alt={`${APP_NAME} logo`}
              />
            )}
          </div>
        );
      },
    },
    {
      Header: 'Phone',
      Cell: (props) => {
        const row = props.row.original;
        const dataObj = row?.isPhoneVerify;
        return (
          <div className="flex items-center whitespace-nowrap">
            <p>{`${row?.countryCode} ${getFormattedPhoneNum(row?.phoneNumber)}`}</p>
            {dataObj === 1 && (
              <img
                className="ml-1 h-5 w-5"
                src={`${LOGO_SRC_PATH}verified.png`}
                alt={`${APP_NAME} logo`}
              />
            )}
          </div>
        );
      },
    },
    {
      Header: 'Staff ID',
      Cell: (props) => {
        const row = props.row.original;
        return row?.patientNo === null ? '-' : row?.patientNo;
      },
    },

    {
      Header: 'DOB',
      Cell: (props) => {
        const row = props.row.original;
        return <div className="flex items-center ">{dayjs(row?.dob).format(DATE_FORMAT)}</div>;
      },
    },

    {
      Header: 'Registered On',
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="flex items-center w-40">
            {dayjs(row?.createdAt).format(DATE_TIME_FORMAT)}
          </div>
        );
      },
    },
  ];

  const onConfirmClick = () => {
    if (activeConfirm) {
      postApi(APIS.UPDATE_STATUS, {
        id: selectedData?.id,
        action: +selectedData?.action,
      }).then((res) => {
        toast.push(<Notification type="success">{UPDATE_TOAST}</Notification>);
        setRefresh((s) => !s);
        onModalClose();
      });
    } else {
      postApi(APIS.DELETE_DATA, { id: selectedData?.id, type: 2 }).then((res) => {
        toast.push(<Notification type="success">{DELETE_TOAST}</Notification>);
        setRefresh((s) => !s);
        onModalClose();
      });
    }
  };

  return (
    <>
      <Header
        buttonMenu={
          hasPermisson(MODULE.STAFF, ACCESS.WRITE) ? BUTTON_CONSTANT : [BUTTON_CONSTANT?.[1]]
        }
        FilterMenu={FILTER_CONSTANT}
        setSearch={setSearch}
        buttonClick={onHeaderButtonClick}
        setFilterValue={setFilterValue}
        filterValue={filterValue}
        searchPlaceholder="Search with Name, Email, Mobile"
      />

      <AdaptableCard className="h-full" bodyClass="h-full">
        <DataTable
          isCursor={false}
          columns={userColumn(columns, MODULE.STAFF)}
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
        des={activeConfirm ? ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM?.des : DEL_CONFIRM.des}
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
      <ExportContent type="2" isOpen={openExportModal} onDialogClose={onModalClose} />
    </>
  );
};

export default StaffManagement;
