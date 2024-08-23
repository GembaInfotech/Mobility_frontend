import React, { useState } from 'react';
import { Avatar, Button, Dialog, Dropdown } from 'components/ui';
import withHeaderItem from 'utils/hoc/withHeaderItem';
import useAuth from 'utils/hooks/useAuth';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { HiOutlineUser, HiOutlineCog, HiOutlineLogout } from 'react-icons/hi';
import { AiOutlineCaretDown } from 'react-icons/ai';

const dropdownItemList = [
  // {
  //   label: "Profile",
  //   path: "/app/account/settings/profile",
  //   icon: <HiOutlineUser />,
  // },
  {
    label: 'Account Settings',
    path: '/app/account/settings/profile',
    icon: <HiOutlineCog />,
  },
  // {
  //   label: "Activity Log",
  //   path: "/app/account/activity-log",
  //   icon: <FiActivity />,
  // },
];

export const UserDropdown = ({ className }) => {
  const [isHover, setIsHover] = useState(false);
  const [isSignOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const { avatar, email, name } = useSelector((state) => state.auth.user);

  const { signOut } = useAuth();

  const UserAvatar = (
    <div className={classNames(className, 'flex items-center gap-2')}>
      <Avatar
        className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
        size={32}
        shape="circle"
        src={avatar}
        icon={<HiOutlineUser />}
      />
      <div className="hidden md:block">
        <div className="text-xs capitalize">
          {/* {authority[0] || "guest"} */}
          {'Welcome'}
        </div>
        <div className="font-bold">{name}</div>
      </div>
      <div>
        <AiOutlineCaretDown />
      </div>
    </div>
  );
  const handleSignOut = () => {
    // Open the sign-out confirmation dialog
    setSignOutDialogOpen(true);
  };

  const handleConfirmSignOut = () => {
    // Close the dialog and perform sign-out
    setSignOutDialogOpen(false);
    signOut();
  };

  const handleCancelSignOut = () => {
    // Close the dialog without sign-out
    setSignOutDialogOpen(false);
  };
  return (
    <div onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
      <Dropdown
        menuStyle={{ minWidth: 240 }}
        renderTitle={UserAvatar}
        placement="bottom-end" 
        isHoverMenu={true}
        isMenuOpen={isHover}
      >
        <Dropdown.Item variant="header">
          <div className="py-2 px-3 flex items-center gap-2">
            <Avatar
              className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
              shape="circle"
              src={avatar}
              icon={<HiOutlineUser />}
            />
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-100">{name}</div>
              <div className="text-xs">{email}</div>
            </div>
          </div>
        </Dropdown.Item>
        <Dropdown.Item variant="divider" />
        {dropdownItemList.map((item) => (
          <Dropdown.Item eventKey={item.label} key={item.label} className="mb-1">
            <Link className="flex gap-2 items-center" to={item.path}>
              <span className="text-xl opacity-50">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </Dropdown.Item>
        ))}
        <Dropdown.Item variant="divider" />
        <Dropdown.Item onClick={handleSignOut} eventKey="Sign Out" className="gap-2">
          <span className="text-xl opacity-50">
            <HiOutlineLogout />
          </span>
          <span>Sign Out</span>
        </Dropdown.Item>
      </Dropdown>

      {/* Sign-out confirmation dialog */}
      <Dialog
        isOpen={isSignOutDialogOpen}
        onClose={handleCancelSignOut}
        onRequestClose={handleCancelSignOut}
      >
        <h4>Confirm Sign Out</h4>
        <p>Are you sure you want to sign out?</p>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleCancelSignOut} className="mr-2" variant="solid">
            Cancel
          </Button>
          <Button onClick={handleConfirmSignOut} variant="solid">
            Sign Out
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default withHeaderItem(UserDropdown);
