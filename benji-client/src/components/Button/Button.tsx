import React from 'react';
import classes from './Button2.module.css';
import { useAppDispatch } from '../../app/hooks';
import { ActionCreator } from 'redux';
import type { InputHandler } from '../../types';

interface ButtonProps {
  children: React.ReactNode;
  action?: ActionCreator<any>;
  isActive: () => boolean;
  onClick?: () => any;
}

const Button = ({ children, action, isActive, onClick }: ButtonProps) => {
  const dispatch = useAppDispatch();
  const active = isActive();

  const clickHandler: InputHandler = (event) => {
    if (!active) return;
    if (action) dispatch(action());
    if (onClick) onClick();
    event.target.blur();
  };

  return (
    <div className={`${classes.btn_container}`}>
      <button
        className={`${classes.btn_border} ${!active && classes.btn_inactive}`}
        onClick={clickHandler}
      >
        <span>{children}</span>
      </button>
    </div>
  );
};

export default Button;
