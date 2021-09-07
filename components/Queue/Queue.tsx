import React from 'react';
import { Track, } from '../../util/types';
import { msToMinSec } from '../../util/util';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { next, previous, selectPosition, setPosition } from './queueSlice';
import classes from './Queue.module.css';

export interface QItem extends Track {
  itemPosition: number;
}

export type QProps = {
  items: Array<QItem>;
};

const QueueItem = ({ itemPosition, title, author, duration, user }: QItem) => {
  return (
    <div className={classes.queue__item}>
      <span>{itemPosition}</span>
      <span>{title}</span>
      <span>{author}</span>
      <span>{msToMinSec(duration)}</span>
      <span>{user}</span>
    </div>
  );
};

const QueueHeader = () => {
  return (
    <div className={`${classes.queue__item} ${classes.queue__header}`}>
      <span>Order</span>
      <span>Title</span>
      <span>Author</span>
      <span>Duration</span>
      <span>User</span>
    </div>
  );
};

const Queue = ({ items }: QProps) => {
  const dispatch = useAppDispatch();
  const position = useAppSelector(selectPosition);


  return (
    <div className={classes.queue_component}>
      <QueueHeader />
      {items.map((item, index) => {
        return <QueueItem key={index} {...item} />
      }) }
    </div>
  );
};

export default Queue;
