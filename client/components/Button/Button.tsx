import React, { useEffect, useState } from 'react';
import classes from './Button.module.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { previous, next, selectQueue } from '../../app/queueSlice';
import { ActionCreator } from 'redux';
import type { InputHandler } from '../../types/types';
import { togglePlayer } from '../Player/playerSlice';

export const Controls = () => {
  const queue = useAppSelector(selectQueue);
  const [active, setActive] = useState(false);

  const btns = [
    {
      label: "Prev",
      icon: null,
      isActive: () => (queue.items.length > 1) && (queue.position > 0),
      action: previous,
    },
    {
      label: "Play",
      icon: null,
      isActive: () => (queue.items.length > 0),
      action: togglePlayer,
    },
    {
      label: "Next",
      icon: null,
      isActive: () => (queue.items.length > 1) && (queue.position + 1 < queue.items.length),
      action: next,
    },
  ];

  return (
    <div className={`${classes.controls}`}>
      {
        btns.map((btn, index) => {
          return <Button key={index} action={btn.action} isActive={() => btn.isActive()}>
            {btn.label}
          </Button>
        })
      }
    </div>
  );
};

interface ButtonProps {
  children: React.ReactNode,
  action: ActionCreator<any>,
  isActive: () => boolean,
}

const Button = ({ children, action, isActive }: ButtonProps) => {
  const dispatch = useAppDispatch();
  const active = isActive();

  const clickHandler: InputHandler = (event) => {
    if (!active) return;
    dispatch(action());
    event.target.blur();
  };

  return (
    <div className={`${classes.btn_container}`}>
      <button
        className={`${classes.btn_border} ${!active && classes.btn_inactive}`}
        onClick={clickHandler}
      >
        { children }
      </button>
    </div>
  );
};

export default Button;