import React, { SyntheticEvent, useRef, useState } from 'react';
import { Track } from '../../types';
import { msToMinSec } from '../../util/util';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectPosition,
  selectQueue,
  selectQueueLength,
  setQueue,
} from '../../app/queueSlice';
import classes from './Queue.module.css';
import { ReactComponent as DraggableIcon } from '../../assets/draggable.svg';
import { selectPlayerState } from '../../app/playerSlice';
import { selectDashboard } from '../../app/dashboardSlice';

export interface QItem extends Track {
  itemPosition: number;
}

export type QProps = {
  items: Array<QItem>;
  setTrack: (p: number) => void;
};

interface QItemProps {
  item: QItem;
  dragCallback: (event: SyntheticEvent) => void;
  onClickCb: (event: SyntheticEvent) => void;
  mouseUpCb?: (event: SyntheticEvent) => void;
  active?: boolean;
}

const DRAGGING_ENABLED = false;

const QueueItem = ({ item, dragCallback, mouseUpCb, active, onClickCb }: QItemProps) => {
  const [hover, setHover] = useState(false); // current item is being hovered
  const { itemPosition, title, channelTitle, duration, user } = item;

  return (
    <div
      // draggable="true"
      className={`${classes.queue__item} ${active && classes.current_item}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDrag={dragCallback}
      onMouseUp={mouseUpCb}
      onClick={onClickCb}
    >
      {(hover && DRAGGING_ENABLED) ? (
        <span>
          <DraggableIcon className={classes.draggable} />
        </span>
      ) : (
        <span>{itemPosition}</span>
      )}
      <span>{title}</span>
      <span>{channelTitle}</span>
      <span>{msToMinSec(duration)}</span>
      <span>{user}</span>
    </div>
  );
};

const useDragging = () => {
  const [isDragging, setDragging] = useState(false);
  const [newItems, setNewItems] = useState<QItem[]>();

  return { isDragging, setDragging, newItems, setNewItems };
};

const Queue = ({ items, setTrack }: QProps) => {
  const dispatch = useAppDispatch();
  const queueLength = useAppSelector(selectQueueLength);
  const position = useAppSelector(selectPosition);
  const headerRef = useRef<HTMLDivElement>(null);
  const queueRef = useRef<HTMLDivElement>(null);
  const { isDragging, setDragging, newItems, setNewItems } = useDragging();

  const endDrag = (event: any) => {
    event.target.style = ''; // Reset CSS used to change row
    if (newItems) {
      // Reset hook
      dispatch(setQueue({ items: newItems, position }));
      setNewItems(undefined);
    }
  };

  const dragHandler = (index: number, event: any) => {
    const { pageY: mouseY, target } = event;
    if (!queueRef.current || !headerRef.current || mouseY === 0) {
      setDragging(false);
      endDrag(event);
      return;
    }
    if (!isDragging) setDragging(true);
    const { height: itemHeight } = target.getBoundingClientRect();
    const { bottom: startY } = headerRef.current.getBoundingClientRect();
    //const { bottom: queueBottom } = queueRef.current.getBoundingClientRect();
    const { scrollTop: mouseScroll, offsetHeight: scrollOffset } =
      queueRef.current;
    //const endY = queueBottom + scrollOffset;

    const newIndex = getItemPosition(startY, mouseY + mouseScroll, itemHeight);

    if (index !== newIndex) {
      target.style.gridRow = `${newIndex + 2}`; // grid row starts at 1, skip header
      const item = { ...items[index] };
      const indexToRemove = index;
      const tmp = items.filter((item, index) => index !== indexToRemove);
      tmp.splice(newIndex, 0, item);
      setNewItems(tmp);
    } else {
      target.style.gridRow = '';
    }
  };

  const getItemPosition = (
    startY: number,
    mouseY: number,
    itemHeight: number
  ) => {
    const position = Math.round((mouseY - startY) / itemHeight); // snap whenitem is halfway
    return minMax(position - 1, 0, queueLength - 1);
  };

  const minMax = (value: number, min: number, max: number) => {
    return Math.min(Math.max(min, value), max);
  };

  const QueueHeader = () => {
    return (
      <div
        ref={headerRef}
        className={`${classes.queue__item} ${classes.queue__header}`}
      >
        <span>#</span>
        <span>Title</span>
        <span>Author</span>
        <span>Duration</span>
        <span>User</span>
      </div>
    );
  };

  return (
    <div className={classes.queue_container}>
      <div
        ref={queueRef}
        className={classes.queue_component}
        onMouseLeave={() => setDragging(false)}
        onMouseUp={endDrag}
      >
        <QueueHeader />
        {items.map((item, index) => {
          return (
            <QueueItem
              dragCallback={(event: SyntheticEvent) =>
                dragHandler(index, event)
              }
              onClickCb={ () => { setTrack(index) }}
              key={index}
              item={{ ...item, itemPosition: index + 1}}
              active={ index === position }
            />
          );
        })}
      </div>
    </div>
  );
};

export default Queue;
