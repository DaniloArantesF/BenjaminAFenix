import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectActionLogs } from '../../../app/logSlice';
import classes from './ActionLog.module.css';
import type { Action } from '../../../app/logSlice';

const ActionItem: React.FC<Action> = ({ message, timestamp }) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return (
    <div className={classes.log__item}>
      <span>{`${message}`}</span>
      <span>{`${hours}:${minutes}`}</span>
    </div>
  );
};

const ActionLog: React.FC = () => {
  const items = useAppSelector(selectActionLogs);

  return (
    <div className={classes.log_container}>
      <div className={classes.log__header}>
        <h1>Server Log</h1>
      </div>
      <div className={classes.log__body}>
        {items.map((item, index) => {
          return <ActionItem key={index} {...item} />;
        })}
      </div>
    </div>
  );
};

export default ActionLog;
