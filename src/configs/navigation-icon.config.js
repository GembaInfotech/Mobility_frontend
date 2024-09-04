import React from "react";
import {
  HiOutlineChartSquareBar,
  HiOutlineUserGroup,
  HiOutlineTrendingUp,
  HiOutlineUserCircle,
  HiOutlineBookOpen,
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck,
  HiOutlineColorSwatch,
  HiOutlineChatAlt,
  HiOutlineDesktopComputer,
  HiOutlinePaperAirplane,
  HiOutlineChartPie,
  HiOutlineUserAdd,
  HiOutlineKey,
  HiOutlineBan,
  HiOutlineHand,
  HiOutlineDocumentText,
  HiOutlineTemplate,
  HiOutlineLockClosed,
  HiOutlineDocumentDuplicate,
  HiOutlineViewGridAdd,
  HiOutlineShare,
  HiOutlineVariable,
  HiOutlineCode,
  HiOutlineArchive,
} from "react-icons/hi";
import { AiOutlineHome, AiTwotoneContacts } from "react-icons/ai";
import { FaInfoCircle } from "react-icons/fa";

const navigationIcon = {
  apps: <HiOutlineViewGridAdd />,
  project: <HiOutlineChartSquareBar />,
  crm: <HiOutlineUserGroup />,
  sales: <HiOutlineTrendingUp />,
  crypto: <HiOutlineCurrencyDollar />,
  knowledgeBase: <HiOutlineBookOpen />,
  account: <HiOutlineUserCircle />,
  uiComponents: <HiOutlineTemplate />,
  common: <HiOutlineColorSwatch />,
  feedback: <HiOutlineChatAlt />,
  dataDisplay: <HiOutlineDesktopComputer />,
  forms: <HiOutlineDocumentText />,
  navigation: <HiOutlinePaperAirplane />,
  graph: <HiOutlineChartPie />,
  authentication: <HiOutlineLockClosed />,
  signIn: <HiOutlineShieldCheck />,
  signUp: <HiOutlineUserAdd />,
  forgotPassword: <HiOutlineLockClosed />,
  resetPassword: <HiOutlineKey />,
  pages: <HiOutlineDocumentDuplicate />,
  welcome: <HiOutlineHand />,
  accessDenied: <HiOutlineBan />,
  guide: <HiOutlineBookOpen />,
  documentation: <HiOutlineDocumentText />,
  sharedComponentDoc: <HiOutlineShare />,
  utilsDoc: <HiOutlineVariable />,
  changeLog: <HiOutlineCode />,
  homeSvg: <AiOutlineHome />,
  contact: <FaInfoCircle />,
  inventory: <HiOutlineArchive />,
};

export default navigationIcon;
