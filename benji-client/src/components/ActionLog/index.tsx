import { useAppSelector } from '../../app/hooks';
import { selectActionLogs } from '../../app/logSlice';
import classes from './ActionLog.module.css';
import type { Action } from '../../app/logSlice';
import { timeStamp } from 'console';

const ActionItem = ({ message, timestamp }: Action) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return (
    <div className={classes.log__item}>
      {`${message} at ${hours}:${minutes}`}
    </div>
  );
}

const ActionLog = () => {
  const items = useAppSelector(selectActionLogs);

  return (
    <div className={classes.log_container}>
      {
        items.map((item, index) => {
          return <ActionItem key={index} {...item} />
        })
      }
    </div>
  );
};

export default ActionLog;