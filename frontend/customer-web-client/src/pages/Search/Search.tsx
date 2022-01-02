import React, { ReactElement } from 'react';
import ScrollLock from 'react-scrolllock';
import styles from './Search.module.css';
import { SearchInputManagement } from './SearchInputManagement';

interface SearchProps {
  visible: boolean;
  onClose: () => void;
}

export function Search({ visible, onClose }: SearchProps): ReactElement {
  const style = {
    background: visible ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
    display: visible ? 'block' : 'none',
  };

  return (
    <ScrollLock isActive={visible}>
      <div>
        <div style={style} className={styles.container} onClick={onClose}></div>
        <SearchInputManagement visible={visible} onClose={onClose} />
      </div>
    </ScrollLock>
  );
}
