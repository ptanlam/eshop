import { LoadingOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Input } from 'antd';
import { motion } from 'framer-motion';
import React, { ReactElement } from 'react';
import styles from './SearchInput.module.css';

interface SearchInputProps {
  options: Array<any>;
  visible: boolean;
  fetching: boolean;
  onChange: (textSearch: string) => void;
  onSearch: (option: string) => void;
  onCompleteClick: () => void;
}

export default function SearchInput({
  options,
  visible,
  fetching,
  onChange,
  onSearch,
  onCompleteClick,
}: SearchInputProps): ReactElement {
  return (
    <motion.div
      animate={{
        display: visible ? 'flex' : 'none',
        y: visible ? '15vh' : '0',
      }}
      className={styles.container}
    >
      <AutoComplete
        onSearch={onSearch}
        className={styles.autocomplete}
        options={options}
        onChange={onChange}
      >
        <Input className={styles.input} placeholder="Search..." />
      </AutoComplete>
      <Button
        size="large"
        type="primary"
        className={styles.button}
        onClick={onCompleteClick}
      >
        {fetching ? <LoadingOutlined /> : 'Search'}
      </Button>
    </motion.div>
  );
}
