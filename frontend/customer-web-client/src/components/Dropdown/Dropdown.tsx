import { Dropdown as AntDropdown } from 'antd';
import React, { ReactElement } from 'react';

interface HeaderDropdownProps {
  overlayElement: ReactElement;
  children: ReactElement | ReactElement[];
  onClose?: () => void;
  onOpen?: () => void;
}

export function Dropdown({
  overlayElement,
  children,
  onClose,
  onOpen,
}: HeaderDropdownProps): ReactElement {
  const onVisibleChange = (visible: boolean) => {
    document.getElementsByTagName('body')[0].style.overflow = visible
      ? 'hidden'
      : 'auto';

    if (onOpen) {
      onOpen();
    }

    if (!onClose) return;
    if (!visible) onClose();
  };

  return (
    <AntDropdown
      onVisibleChange={onVisibleChange}
      overlay={overlayElement}
      trigger={['click']}
      placement="bottomCenter"
    >
      {children}
    </AntDropdown>
  );
}
