import React, { useEffect, useRef, useState } from 'react';
import btn1 from './Button1.module.css';
import btn2 from './Button2.module.css';
import btn3 from './Button3.module.css';
import { useAppDispatch } from '../../app/hooks';
import { ActionCreator } from 'redux';
import type { InputHandler } from '../../types';

interface ButtonProps {
  type?: string;
  children: React.ReactNode;
  action?: ActionCreator<any>;
  isActive: () => boolean;
  onClick?: () => any;
}

const Button = ({ children, action, isActive, onClick, type }: ButtonProps) => {
  const [classes, setClasses] = useState(btn1);
  const dispatch = useAppDispatch();
  const active = isActive();
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    switch (type) {
      case 'control':
        setClasses(btn1);
        break;
      case 'button':
        setClasses(btn2);
        break;
      default:
    }
  }, []);

  const clickHandler: InputHandler = (event) => {
    if (!active) return;
    if (action) dispatch(action());
    if (onClick) onClick();
    event.target.blur();
    if (btnRef.current)
      btnRef.current.blur();
  };

  return (
    <div className={`${classes.btn_container}`}>
      <button
        ref={btnRef}
        className={`${classes.btn_border} ${!active && classes.btn_inactive}`}
        onClick={clickHandler}
      >
        <span>{children}</span>
      </button>
    </div>
  );
};

export default Button;
