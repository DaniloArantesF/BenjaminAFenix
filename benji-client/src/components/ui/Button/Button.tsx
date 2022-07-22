import React, { useEffect, useRef, useState } from 'react';
import btn1 from './Button1.module.css';
import btn2 from './Button2.module.css';
// import btn3 from './Button3.module.css';
import { useAppDispatch } from '../../../app/hooks';
import { ActionCreator } from 'redux';
import type { InputHandler } from '../../../types';

interface ButtonProps {
  type?: string;
  children: React.ReactNode;
  action?: ActionCreator<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  isActive: () => boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, action, isActive, onClick, type }) => {
  const [classes, setClasses] = useState(btn2);
  const dispatch = useAppDispatch();
  const active = isActive();
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    switch (type) {
      case 'btn-large':
        setClasses(btn2);
        break;
      default:
        setClasses(btn1);
    }
  }, [type]);

  const clickHandler: InputHandler = (event) => {
    if (!active) return;
    if (action) dispatch(action());
    if (onClick) onClick();
    event.target.blur();
    if (btnRef.current) btnRef.current.blur();
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
