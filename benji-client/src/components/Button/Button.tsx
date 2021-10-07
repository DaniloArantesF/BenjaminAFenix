import React, { useEffect, useState } from 'react';
import classes from './Button.module.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { previous, next, selectQueue } from '../../store/queueSlice';
import { ActionCreator } from 'redux';
import type { InputHandler } from '../../types/types';
import { togglePlayer } from '../../store/playerSlice';


interface ButtonProps {
  children: React.ReactNode;
  action: ActionCreator<any>;
  isActive: () => boolean;
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
        {children}
      </button>
    </div>
  );
};

export default Button;
