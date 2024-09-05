import React, { useEffect, useState } from 'react';
import { getApi, postApi } from 'services/CommonService';
import { APIS, LIST_DATA_API_TYPE } from 'constants/api.constant';
import { AdaptableCard } from 'components/shared';
import { DataTable } from 'components/shared';
import { toast, Notification } from 'components/ui';
import { HiOutlinePlusCircle, HiDocumentDownload, HiOutlineUpload } from 'react-icons/hi';
import AddEditCodes from './addEdit';
import ActionColumn from 'components/custom/actionColumn';
import { AiFillDelete } from 'react-icons/ai';
import Header from 'components/custom/header';
import ConfirmationContent from 'components/custom/ConfirmationContent';
import { GrPowerReset } from 'react-icons/gr';
import appConfig from 'configs/app.config';

import {
  TABLE_ACTION_KEYS,
  CONFIRMATION_OBJ,
  DELETE_TOAST,
  UPLOAD_TOAST,
  ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM,
  UPDATE_TOAST,
} from 'constants/app.constant';
import FieldModal from 'components/custom/fieldModal';
import ActiveInActiveCheckbox from 'components/custom/activeCheckbox';
import hasPermisson, { ACCESS, MODULE, newColumn } from 'utils/hasPermission';

const typeObjHandler = (code) => {
  if (code === '1') {
    return { label: 'Lcodes', value: 1 };
  } else {
    return { label: 'icd', value: 2 };
  }
};

const groupObjHandler = (code) => {
  if (code === '1') {
    return { label: 'Consumables', value: 1 };
  } else {
    return { label: 'Manufacture', value: 2 };
  }
};

const CODE_TYPE = [
  { label: 'Lcodes', value: 1 },
  { label: 'icd', value: 2 },
];

const ACTION_CONSTANT = [
  {
    label: 'Edit',
    key: TABLE_ACTION_KEYS.EDIT,
    show: () => hasPermisson(MODULE.CODES, ACCESS.WRITE),
  },
  {
    label: <AiFillDelete style={{ fontSize: '1.2rem' }} />,
    key: TABLE_ACTION_KEYS.DELETE,
    toolTip: 'Delete',
    show: () => hasPermisson(MODULE.CODES, ACCESS.DELETE),
  },
];

const BUTTON_CONSTANT = [
  // {
  //   label: 'Download Sample File',
  //   key: TABLE_ACTION_KEYS.DOWNLOAD,
  //   icon: <HiDocumentDownload />,
  // },
  // {
  //   label: 'Import File',
  //   key: TABLE_ACTION_KEYS.IMPORT,
  //   icon: <HiOutlineUpload />,
  // },
  {
    label: 'Add Material',
    key: TABLE_ACTION_KEYS.ADD,
    icon: <HiOutlinePlusCircle />,
  },
];
const FILTER_CONSTANT = [
  {
    component: 'select',
    options: CODE_TYPE,
    className: 'mb-4 w-40	',
    placeholder: 'Code Type',
    filterKey: 'codeType',
  },
  {
    component: 'input',
    className: 'mb-4 w-40	',
    placeholder: 'CreatedBy',
    filterKey: 'createdBy',
  },
  {
    component: 'resetButton',
    label: 'Reset',
    icon: <GrPowerReset />,
    className: 'mb-4',
    filterKey: { codeType: '' },
  },
];

const CONFIRMATION_CONSTANT = {
  header: CONFIRMATION_OBJ.HEADER,
  des: CONFIRMATION_OBJ.DELETE,
  buttonLabel: 'Delete',
};

const FIELD_CONFIRMATION_CONSTANT = {
  header: 'Import',
  des: 'Choose File to upload',
  buttonLabel: 'Upload',
  buttonLabelLoading: 'Uploading',
};

const Codes = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedData, setSelectedData] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState();
  const [sampleCodeName, setSampleCodeName] = useState('');
  const refreshPage = () => setRefresh((prev) => !prev);
  const [filterValue, setFilterValue] = useState({
    codeType: '',
  });
  const [activeConfirm, setActiveConfirm] = useState(false);
  const [isImportModal, setIsImportModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    const payload = {
      type: LIST_DATA_API_TYPE.MATERIALS,
      limit,
      search,
      createdBy: filterValue?.createdBy ? filterValue.createdBy : null,
      skip: limit * (page - 1),
    };
    if (filterValue?.codeType !== '') {
      payload.codeType = filterValue?.codeType?.value;
    }

    getApi(APIS.LIST_DATA, {
      ...payload,
    })
      .then((res) => {
        setSampleCodeName(res?.data?.lcodeSampleFile);
        setCodes([]);
        setCodes(res?.data?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  }, [search, page, limit, refresh, filterValue]);

  const onActionHandle = (e, key, row) => {
    if (key === TABLE_ACTION_KEYS.EDIT) {
      setSelectedData({
        id: row?._id,
        material: row?.material,
        group: groupObjHandler(row?.group),
        code: row?.code,
        description: row?.description,
        type: typeObjHandler(row?.type), 
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
      Header: 'Code',
      accessor: 'code',
    },
    {
      Header: 'Material Name',
      accessor: 'material',
    },
    {
      Header: 'Description',
      Cell: (props) => {
        const row = props?.row?.original;
        return row?.description ? row?.description : '-';
      },
      // accessor: 'description',
    },
    {
      Header: 'Type',
      accessor: 'type',
      Cell: (props) => {
        const type = props.row.original.type;
        if (type === '1') {
          return 'Lcodes';
        }
        return 'icd';
      },
    },
    {
      Header: 'Group',
      accessor: 'group',
      Cell: (props) => {
        const group = props.row.original.group;
        if (group === '1') {
          return 'Consumables';
        }
        return 'Manufacture';
      },
    },
    {
      Header: 'CreatedBy',
      accessor: (row) => row.createdBy ? row.createdBy?.name: "-",
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

  const onDrawerClose = () => {
    setSelectedData('');
    setDrawer(false);
  };

  const onHeaderButtonClick = (e, key) => {
    if (key === TABLE_ACTION_KEYS.ADD) {
      setDrawer(true);
    }
    if (key === TABLE_ACTION_KEYS.IMPORT) {
      setIsImportModal(true);
    }
    if (key === TABLE_ACTION_KEYS.DOWNLOAD) {
      const url = `${appConfig?.imageBaseUrl}${sampleCodeName}`;
      const a = document.createElement('a');
      a.href = url;
      a.download = 'example-file.txt';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const onModalClose = () => {
    setSelectedData('');
    setOpenModal(false);
    setActiveConfirm(false);
  };

  const onFieldModalClose = () => {
    setIsImportModal(false);
    setUploadFile('');
  };

  const onConfirmClick = () => {
    let toastMessage;
    const payload = {
      type: LIST_DATA_API_TYPE.MATERIALS,
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

  const onFieldConfirmClick = () => {
    setUploadLoading(true);
    let payload = new FormData();
    for (let i = 0; i < uploadFile?.length; i++) {
      payload.append('file', uploadFile[i]);
    }
    postApi(APIS.IMPORT_CODE, payload).then((res) => {
      setRefresh((s) => !s);
      setUploadLoading(false);
      toast.push(<Notification type="success">{UPLOAD_TOAST}</Notification>);
      onFieldModalClose();
    });
  };

  return (
    <>
      <Header
        buttonMenu={
          hasPermisson(MODULE.CODES, ACCESS.WRITE)
            ? BUTTON_CONSTANT
            : BUTTON_CONSTANT.slice(0, BUTTON_CONSTANT.length - 1)
        }
        FilterMenu={FILTER_CONSTANT}
        setSearch={setSearch}
        buttonClick={onHeaderButtonClick}
        setFilterValue={setFilterValue}
        filterValue={filterValue}
      />
      <AdaptableCard className="h-full" bodyClass="h-full">
        <DataTable
          columns={newColumn(columns, MODULE.CODES, 1)}
          isCursor={false}
          data={codes}
          loading={loading}
          skeletonAvatarColumns={[0]}
          skeletonAvatarProps={{ width: 28, height: 28 }}
          pagingData={{ pageIndex: page, pageSize: limit, total: totalCount }}
          onPaginationChange={(pages) => setPage(pages)}
          onSelectChange={(limits) => setLimit(limits)}
        />
      </AdaptableCard>
      <AddEditCodes
        show={drawer}
        onClose={onDrawerClose}
        refreshPage={refreshPage}
        editData={selectedData}
      />

      <ConfirmationContent
        isOpen={openModal}
        onConfirmClick={onConfirmClick}
        header={CONFIRMATION_CONSTANT.header}
        des={activeConfirm ? ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM?.des : CONFIRMATION_OBJ.DELETE}
        onDialogClose={onModalClose}
        isWarning={!activeConfirm && CONFIRMATION_OBJ.WARNING}
        buttonLabel={
          activeConfirm
            ? ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM?.buttonLabel
            : CONFIRMATION_CONSTANT.buttonLabel
        }
      />

      <FieldModal
        uploadLoading={uploadLoading}
        setUploadFile={setUploadFile}
        isOpen={isImportModal}
        header={FIELD_CONFIRMATION_CONSTANT.header}
        des={FIELD_CONFIRMATION_CONSTANT.des}
        onDialogClose={onFieldModalClose}
        onConfirmClick={onFieldConfirmClick}
        buttonLabel={
          uploadLoading
            ? FIELD_CONFIRMATION_CONSTANT.buttonLabelLoading
            : FIELD_CONFIRMATION_CONSTANT.buttonLabel
        }
        uploadFile={uploadFile}
      />
    </>
  );
};
export default Codes;
