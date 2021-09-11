import React, { useState } from 'react';
import classes from './Button.module.css';
import { useAppDispatch } from '../../app/hooks';
import { previous, next } from '../Queue/queueSlice';
import { ActionCreator } from 'redux';
import type { InputHandler } from '../../types/types';

export const Controls = () => {

  return (
    <div className={`${classes.controls}`}>
      <Button action={ previous }>Prev</Button>

      <Button action={ next }>Next</Button>
    </div>
  );
};

interface ButtonProps {
  children: React.ReactNode,
  action: ActionCreator<any>,
}

const Button = ({ children, action }: ButtonProps) => {
  const dispatch = useAppDispatch();
  const [isActive, setActive] = useState(true);

  const clickHandler: InputHandler = (event) => {
    if (!isActive) return;
    dispatch(action());
    event.target.blur();
  };

  return (
    <>
      <button
        className={`${classes.btn_border}`}
        onClick={clickHandler}
      >
        { children }
      </button>
    </>
  );
};