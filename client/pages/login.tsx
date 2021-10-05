import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchCredentials } from '../app/authSlice';
import classes from '../styles/Login.module.css';

const Login = () => {
  const dispatch = useAppDispatch();
  const [code, setCode] = useState<string>();

  useEffect(() => {
    if (!window) return;
    const param = new URLSearchParams(window.location.search).get('code');

    if (param) {
      setCode(param);
    }
  }, []);

  useEffect(() => {
    if (!code) return;
    dispatch(fetchCredentials(code))
  }, [code]);

  return (
    <div className={classes.login_container}>

    </div>
  );
};

export default Login