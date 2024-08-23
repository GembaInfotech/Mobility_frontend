import React, { cloneElement } from "react";
import Logo from "components/template/Logo";
import { APP_NAME } from "constants/app.constant";
import { useConfig } from "components/ui";

const Cover = ({ children, content, ...rest }) => {
  const { themeColor, primaryColorLevel } = useConfig();
  return (
    <div className="grid lg:grid-cols-2 h-full">
      <div
        className={`flex-col justify-end items-center	  bg-cover bg-no-repeat	lg:flex`}
        style={{ backgroundImage: `url('/img/others/cover.jpg')` }}
      >
        {/* <Logo mode="dark" /> */}
        {/* <div className={`bg-${themeColor}-${primaryColorLevel} opacity-85 p-5`}>
          <h3 className="text-white mb-4">Mobility Admin Panel</h3>
          <p className="text-lg text-white opacity-80 max-w-[700px]">
            Ideal Healthcare
          </p>
        </div> */}
        <span className="text-white">
          Copyright &copy; {`${new Date().getFullYear()}`}{" "}
          <span className="font-semibold">{`${APP_NAME}`}</span>{" "}
        </span>
      </div>
      <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800">
        <div className="xl:min-w-[450px] px-8">
          <div className="mb-8">{content}</div>
          {children ? cloneElement(children, { ...rest }) : null}
        </div>
      </div>
    </div>
  );
};

export default Cover;

//    bg-center py-6 px-16  bg-${themeColor}-100 dark:bg-gray-800 hidden
