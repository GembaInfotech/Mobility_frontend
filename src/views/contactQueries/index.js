import { AdaptableCard } from "components/shared";
import React, { useEffect, useState } from "react";
import { DataTable } from "components/shared";
import dayjs from "dayjs";
import { getApi, postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import ActionColumn from "components/custom/actionColumn";
import { AiFillDelete } from "react-icons/ai";
import ConfirmationContent from "components/custom/ConfirmationContent";
import { Avatar, Notification, toast } from "components/ui";
import Header from "components/custom/header";
import useThemeClass from "utils/hooks/useThemeClass";
import {
  TABLE_ACTION_KEYS,
  CONFIRMATION_OBJ,
  DELETE_TOAST,
  DATE_TIME_FORMAT,
} from "constants/app.constant";
import { Link } from "react-router-dom";
import ParagraphWithSeeMore from "components/custom/paragraphWithSeeMore";
import { MODULE, newColumn } from "utils/hasPermission";

const NameColumn = ({ row }) => {
  const { textTheme } = useThemeClass();
  return (
    <div className="flex items-center w-28">
      <Avatar size={28} shape="circle">
        {row?.User?.firstName?.[0]?.toUpperCase()}
      </Avatar>

      <Link className={`w-48 hover:${textTheme} ml-2 rtl:mr-2 font-semibold `}>
        {`${row?.User?.firstName} ${
          row?.User?.lastName !== null && row?.User?.lastName
            ? row?.User?.lastName
            : ""
        }` || "-"}
      </Link>
    </div>
  );
};

const ACTION_CONSTANT = [
  {
    label: <AiFillDelete style={{ fontSize: "1.2rem" }} />,
    key: TABLE_ACTION_KEYS.DELETE,
    toolTip: "Delete",
  },
];

export const USER_TYPE = [
  { label: "Providers", value: 1 },
  { label: "Staff", value: 2 },
  { label: "Patients", value: 3 },
];

const CONFIRMATION_CONSTANT = {
  header: CONFIRMATION_OBJ.HEADER,
  des: CONFIRMATION_OBJ.DELETE,
  warning: CONFIRMATION_OBJ.WARNING,
  buttonLabel: "Delete",
};

const BUTTON_CONSTANT = [];

const FILTER_CONSTANT = [];

const ContactQueries = () => {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [selectedData, setSelectedData] = useState("");
  const [openModal, setOpenModal] = useState(false);

  ////// GET LIST ADMINS FROM API///////////

  useEffect(() => {
    getApi(APIS.GET_CODE, {
      limit,
      search,
      skip: limit * (page - 1),
      type: 3,
    })
      .then((res) => {
        setTableData(res?.data?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  }, [search, page, limit, refresh]);

  const onActionHandle = (e, key, row) => {
    if (key === TABLE_ACTION_KEYS.DELETE) {
      setSelectedData({
        id: row?.id,
      });
      setOpenModal(true);
    }
  };

  const onModalClose = () => {
    setSelectedData("");
    setOpenModal(false);
  };

  const onHeaderButtonClick = () => {};

  const columns = [
    {
      Header: "Actions",
      id: "action",
      accessor: (row) => row,
      Cell: (props) => {
        return (
          <ActionColumn
            row={props.row.original}
            onActionHandle={onActionHandle}
            actionsMenu={ACTION_CONSTANT}
          />
        );
      },
    },
    {
      Header: "User Name",
      Cell: (props) => {
        const row = props.row.original;
        return <NameColumn row={row} />;
      },
    },
    {
      Header: 'Email',
      Cell: (props) => {
        const row = props.row.original;
        return <div className="w-32">{row?.User?.email || '-'}</div>;
      },
    },
    {
      Header: 'Mobile No.',
      Cell: (props) => {
        const row = props.row.original;
        return row?.User?.phoneNumber || '-';
      },
    },
    {
      Header: "User Type",
      Cell: (props) => {
        const row = props.row.original;
        const typeObj = USER_TYPE.find(
          (obj, i) => obj.value === row?.User?.userType
        );
        return typeObj.label;
      },
    },
    {
      Header: "Message",
      Cell: (props) => {
        const row = props?.row?.original;
        return row?.message && row?.message !== null ? (
          <ParagraphWithSeeMore text={row?.message} maxChars={100} />
        ) : (
          "-"
        );
      },
    },

    {
      Header: "Query Date",
      accessor: "createdAt",
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="flex items-center">
            {dayjs(row?.createdAt).format(DATE_TIME_FORMAT)}
          </div>
        );
      },
    },
  ];

  const onConfirmClick = () => {
    postApi(APIS.DELETE_DATA, { id: selectedData?.id, type: 7 }).then((res) => {
      toast.push(<Notification type="success">{DELETE_TOAST}</Notification>);
      setRefresh((s) => !s);
      onModalClose();
    });
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
          columns={newColumn(columns, MODULE.CONTACTQUERIES , 2)}
          data={tableData}
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
        header={CONFIRMATION_CONSTANT.header}
        des={CONFIRMATION_CONSTANT.des}
        onDialogClose={onModalClose}
        onConfirmClick={onConfirmClick}
        buttonLabel={CONFIRMATION_CONSTANT.buttonLabel}
      />
    </>
  );
};

export default ContactQueries;
