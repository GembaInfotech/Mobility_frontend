import useThemeClass from 'utils/hooks/useThemeClass';
import { Tooltip } from 'components/ui';

const ActionColumn = ({ row, onActionHandle, actionsMenu }) => {
  const { textTheme } = useThemeClass();

  return (
    <div className="flex items-center justify-between">
      {actionsMenu?.map((item, i) => {
        if (item?.show?.() ?? true) {
          return (
            <Tooltip title={item?.toolTip} visible={item?.toolTip ? true : false}>
              {item?.isImage ? (
                <img
                  src={item.label}
                  alt="view Icon"
                  style={{ maxWidth: '20px' }}
                  // h-5 justify-center ml-5 text-blue-400
                  className="cursor-pointer mx-0.5"
                  onClick={(e) => onActionHandle(e, item.key, row)}
                />
              ) : (
                <span
                  className={`${textTheme} cursor-pointer select-none font-semibold ml-2 `}
                  onClick={(e) => onActionHandle(e, item.key, row)}
                >
                  {item.label}
                </span>
              )}
            </Tooltip>
          );
        }
      })}
    </div>
  );
};

export default ActionColumn;
