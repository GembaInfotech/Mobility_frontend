import React, { useEffect, useState } from 'react';
import reducer from './store';
import { injectReducer } from 'store/index';
import { getProjectDashboardData } from './store/dataSlice';
import ProjectDashboardHeader from './components/ProjectDashboardHeader';
import TaskOverview from './components/TaskOverview';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Spinner } from 'components/ui';
import { getApi } from 'services/CommonService';
import { APIS } from 'constants/api.constant';
import { MdGroups, MdGroupAdd, MdGroup, MdDocumentScanner,MdAttachFile } from 'react-icons/md';

const BLOCK_CONSTANT_DATA = [
  // {
  //   subTitle: 'Staff Registered',
  //   icon: <MdGroups className="text-white text-5xl" />,
  //   key: 'totalStaff',
  // },
  {
    subTitle: 'Total Physicians',
    icon: <MdGroups className="text-white text-5xl" />,
    key: 'totalPhysician',
  },
  {
    subTitle: 'Total Patients',
    icon: <MdGroupAdd className="text-white text-5xl" />,
    key: 'totalPatient',
  },
  {
    subTitle: 'Uploaded Documents',
    icon: <MdAttachFile className="text-white text-5xl" />,
    key: 'onlineOrders',
  },
  {
    subTitle: 'Insurance Verification',
    icon: <MdDocumentScanner className="text-white text-5xl" />,
    key: 'onlineOrders',
  },
  {
    subTitle: 'Insurance Authorization',
    icon: <MdDocumentScanner className="text-white text-5xl" />,
    key: 'onlineOrders',
  },
  // {
  //   subTitle: 'Service Orders',
  //   icon: <MdDocumentScanner className="text-white text-5xl" />,
  //   key: 'serviceOrders',
  // },
  // {
  //   subTitle: 'Cancel Orders',
  //   icon: <MdGroup className="text-white text-5xl" />,
  //   key: 'cancelOrders',
  // },
  // {
  //   subTitle: 'Return Orders',
  //   icon: <MdDocumentScanner className="text-white text-5xl" />,
  //   key: 'returnOrders',
  // },
];

injectReducer('projectDashboard', reducer);

const ProjectDashboard = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const { name } = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchData();
    getApi(APIS.LIST_DASHBOARD)
      .then((res) => setData(res?.data))
      .finally(() => setLoading(false));
  }, []);

  const fetchData = () => {
    dispatch(getProjectDashboardData());
  };

  const { projectOverviewData } = useSelector((state) => state.projectDashboard.data.dashboardData);

  return (
    <>
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-4 h-full">
          <ProjectDashboardHeader data={{ name }} />

          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {BLOCK_CONSTANT_DATA.map((block, i) => {
                return (
                  <Card className="p-2 bg-blue-900" key={i}>
                    <div className="flex w-full ">
                      <div className="w-3/4">
                        <p className="text-2xl font-bold text-white">{data[block.key]}</p>
                        <p className="text-base text-white">{block.subTitle}</p>
                      </div>
                      <div className="w-1/4 flex justify-end text-center items-center	">
                        <div className="w-12 h-12 ">{block.icon}</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
          {/* <div className="flex flex-col xl:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-auto">
              <TaskOverview data={projectOverviewData} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="xl:w-[380px]"></div>
            </div>
          </div> */}
        </div>
      )}
    </>
  );
};

export default ProjectDashboard;
