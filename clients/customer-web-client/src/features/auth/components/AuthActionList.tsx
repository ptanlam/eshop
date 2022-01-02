import React, { ReactElement } from 'react';
import { generateKeyForArray } from '../../../utils';
import { AuthButton } from './AuthButton';
import { AuthGreetingText } from './AuthGreetingText';
import styles from './AuthActionList.module.css';

export function AuthActionList(): ReactElement {
  return (
    <div className={styles.container}>
      <div
        key={generateKeyForArray('auth_action_list_title')}
        style={{
          fontSize: '1.4rem',
          color: 'black',
          cursor: 'default',
        }}
      >
        <AuthGreetingText />
      </div>
      <div key={generateKeyForArray('auth_action_list_button')}>
        <AuthButton />
      </div>
    </div>
  );
}
