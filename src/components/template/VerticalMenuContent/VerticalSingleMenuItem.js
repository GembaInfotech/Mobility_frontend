import React from 'react';
import { Menu, Tooltip } from 'components/ui';
import VerticalMenuIcon from './VerticalMenuIcon';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

const { MenuItem } = Menu;

const CollapsedItem = ({ title, translateKey, children, direction }) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t(translateKey) || title} placement={direction === 'rtl' ? 'left' : 'right'}>
      {children}
    </Tooltip>
  );
};

const DefaultItem = (props) => {
  const { nav, onLinkClick, sideCollapsed, userAuthority } = props;
  return (
    <>
      {nav?.isVisible?.() ? (
        <MenuItem key={nav.key} eventKey={nav.key} className="mb-2 text-white">
          <Link
            to={nav.path}
            onClick={() =>
              onLinkClick?.({
                key: nav.key,
                title: nav.title,
                path: nav.path,
              })
            }
            className="flex items-center h-full w-full text-white"
          >
            <VerticalMenuIcon icon={nav.icon} />
            {!sideCollapsed && (
              <span>
                <Trans i18nKey={nav.translateKey} defaults={nav.title} />
              </span>
            )}
          </Link>
        </MenuItem>
      ) : (
        ''
      )}
    </>
  );
};

const VerticalSingleMenuItem = ({ nav, onLinkClick, sideCollapsed, userAuthority, direction }) => {
  return sideCollapsed ? (
    <CollapsedItem title={nav.title} translateKey={nav.translateKey} direction={direction}>
      <DefaultItem
        nav={nav}
        sideCollapsed={sideCollapsed}
        onLinkClick={onLinkClick}
        userAuthority={userAuthority}
      />
    </CollapsedItem>
  ) : (
    <DefaultItem
      nav={nav}
      sideCollapsed={sideCollapsed}
      onLinkClick={onLinkClick}
      userAuthority={userAuthority}
    />
  );
};

export default VerticalSingleMenuItem;
