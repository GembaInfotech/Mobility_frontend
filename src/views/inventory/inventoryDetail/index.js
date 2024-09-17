// import React, { useEffect, useState } from 'react';
// import { getApi, postApi } from 'services/CommonService';
// import { APIS, LIST_DATA_API_TYPE } from 'constants/api.constant';
// import { AdaptableCard } from 'components/shared';
// import { DataTable } from 'components/shared';
// import { toast, Notification } from 'components/ui';
// import Header from 'components/custom/header';
// import ConfirmationContent from 'components/custom/ConfirmationContent';
// import { GrPowerReset } from 'react-icons/gr';
// import {
//   CONFIRMATION_OBJ,
//   DELETE_TOAST,
//   UPLOAD_TOAST,
//   ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM,
//   UPDATE_TOAST,
// } from 'constants/app.constant';
// import FieldModal from 'components/custom/fieldModal';

// import {MODULE, newColumn } from 'utils/hasPermission';

// const CODE_TYPE = [
//   { label: 'Lcodes', value: 1 },
//   { label: 'icd', value: 2 },
// ];

// const FILTER_CONSTANT = [
//   {
//     component: 'select',
//     options: CODE_TYPE,
//     className: 'mb-4 w-40	',
//     placeholder: 'Code Type',
//     filterKey: 'codeType',
//   },
//   {
//     component: 'resetButton',
//     label: 'Reset',
//     icon: <GrPowerReset />,
//     className: 'mb-4',
//     filterKey: { codeType: '' },
//   },
// ];

// const CONFIRMATION_CONSTANT = {
//   header: CONFIRMATION_OBJ.HEADER,
//   des: CONFIRMATION_OBJ.DELETE,
//   buttonLabel: 'Delete',
// };

// const FIELD_CONFIRMATION_CONSTANT = {
//   header: 'Import',
//   des: 'Choose File to upload',
//   buttonLabel: 'Upload',
//   buttonLabelLoading: 'Uploading',
// };

// const Codes = () => {
//   const [codes, setCodes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const [limit, setLimit] = useState(10);
//   const [search, setSearch] = useState('');
//   const [refresh, setRefresh] = useState(false);
//   const [selectedData, setSelectedData] = useState('');
//   const [openModal, setOpenModal] = useState(false);
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [uploadFile, setUploadFile] = useState();
//   const [sampleCodeName, setSampleCodeName] = useState('');
//   const refreshPage = () => setRefresh((prev) => !prev);
//   const [filterValue, setFilterValue] = useState({
//     codeType: '',
//   });
//   const [activeConfirm, setActiveConfirm] = useState(false);
//   const [isImportModal, setIsImportModal] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     const payload = {
//       type: LIST_DATA_API_TYPE.MATERIALS,
//       limit,
//       search,
//       createdBy: filterValue?.createdBy ? filterValue.createdBy : null,
//       skip: limit * (page - 1),
//     };
//     if (filterValue?.codeType !== '') {
//       payload.codeType = filterValue?.codeType?.value;
//     }

//     getApi(APIS.LIST_DATA, {
//       ...payload,
//     })
//       .then((res) => {
//         setSampleCodeName(res?.data?.lcodeSampleFile);
//         setCodes([]);
//         setCodes(res?.data?.data);
//         setTotalCount(res?.data?.count);
//       })
//       .finally(() => setLoading(false));
//   }, [search, page, limit, refresh, filterValue]);

//   const columns = [
//     {
//       Header: 'Code',
//       accessor: 'code',
//     },
//     {
//       Header: 'Material Name',
//       accessor: 'material',
//     },
//     {
//       Header: 'Description',
//       Cell: (props) => {
//         const row = props?.row?.original;
//         return row?.description ? row?.description : '-';
//       },
//     },
//     {
//       Header: 'Type',
//       accessor: 'type',
//       Cell: (props) => {
//         const type = props.row.original.type;
//         if (type === '1') {
//           return 'Lcodes';
//         }
//         return 'icd';
//       },
//     },
//     {
//       Header: 'Group',
//       accessor: 'group',
//       Cell: (props) => {
//         const group = props.row.original.group;
//         if (group === '1') {
//           return 'Consumables';
//         }
//         return 'Manufacture';
//       },
//     },
//     {
//         Header: 'Available Stocks',
//         accessor: 'availableStocks',
//       },
//   ];

//   const onModalClose = () => {
//     setSelectedData('');
//     setOpenModal(false);
//     setActiveConfirm(false);
//   };

//   const onFieldModalClose = () => {
//     setIsImportModal(false);
//     setUploadFile('');
//   };

//   const onConfirmClick = () => {
//     let toastMessage;
//     const payload = {
//       type: LIST_DATA_API_TYPE.MATERIALS,
//       id: selectedData?.id,
//     }
//     if (activeConfirm) {
//       toastMessage = UPDATE_TOAST;
//       payload.status = +selectedData?.action;
    
//     } else {
//       toastMessage = DELETE_TOAST;
//       payload.status = 0
//     }

//     postApi(APIS.BLOCK_DELETE_DATA, payload).then((res) => {
//       toast.push(<Notification type="success">{toastMessage}</Notification>);
//       setRefresh((s) => !s);
//       onModalClose();
//     });
//   };

//   const onFieldConfirmClick = () => {
//     setUploadLoading(true);
//     let payload = new FormData();
//     for (let i = 0; i < uploadFile?.length; i++) {
//       payload.append('file', uploadFile[i]);
//     }
//     postApi(APIS.IMPORT_CODE, payload).then((res) => {
//       setRefresh((s) => !s);
//       setUploadLoading(false);
//       toast.push(<Notification type="success">{UPLOAD_TOAST}</Notification>);
//       onFieldModalClose();
//     });
//   };

//   return (
//     <>
//       <Header
//         FilterMenu={FILTER_CONSTANT}
//         setSearch={setSearch}
//         setFilterValue={setFilterValue}
//         filterValue={filterValue}
//       />
//       <AdaptableCard className="h-full" bodyClass="h-full">
//         <DataTable
//           columns={newColumn(columns, MODULE.CODES, 1)}
//           isCursor={false}
//           data={codes}
//           loading={loading}
//           skeletonAvatarColumns={[0]}
//           skeletonAvatarProps={{ width: 28, height: 28 }}
//           pagingData={{ pageIndex: page, pageSize: limit, total: totalCount }}
//           onPaginationChange={(pages) => setPage(pages)}
//           onSelectChange={(limits) => setLimit(limits)}
//         />
//       </AdaptableCard>
//       <ConfirmationContent
//         isOpen={openModal}
//         onConfirmClick={onConfirmClick}
//         header={CONFIRMATION_CONSTANT.header}
//         des={activeConfirm ? ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM?.des : CONFIRMATION_OBJ.DELETE}
//         onDialogClose={onModalClose}
//         isWarning={!activeConfirm && CONFIRMATION_OBJ.WARNING}
//         buttonLabel={
//           activeConfirm
//             ? ACTIVE_INACTIVE_STATUS_UPDATE_CONFIRM?.buttonLabel
//             : CONFIRMATION_CONSTANT.buttonLabel
//         }
//       />

//       <FieldModal
//         uploadLoading={uploadLoading}
//         setUploadFile={setUploadFile}
//         isOpen={isImportModal}
//         header={FIELD_CONFIRMATION_CONSTANT.header}
//         des={FIELD_CONFIRMATION_CONSTANT.des}
//         onDialogClose={onFieldModalClose}
//         onConfirmClick={onFieldConfirmClick}
//         buttonLabel={
//           uploadLoading
//             ? FIELD_CONFIRMATION_CONSTANT.buttonLabelLoading
//             : FIELD_CONFIRMATION_CONSTANT.buttonLabel
//         }
//         uploadFile={uploadFile}
//       />
//     </>
//   );
// };
// export default Codes;
