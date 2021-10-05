import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchCredentials } from '../app/authSlice';
import classes from '../styles/Login.module.css';
import Background from '../assets/lava.svg';
import Logo from '../assets/BenjaminAFenix.svg';
import Button from '../components/Button/Button';

const Login = () => {
  const dispatch = useAppDispatch();
  const [code, setCode] = useState<string>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!window) return;
    const param = new URLSearchParams(window.location.search).get('code');

    if (param) {
      setCode(param);
    }
  }, []);

  useEffect(() => {
    if (!code) return;
    dispatch(fetchCredentials(code));
  }, [code]);

  return (
    <div className={classes.login_container}>
      <Background className={classes.background} />
      <header>
        <Logo />
        <h1>Benji.</h1>
      </header>
      <section>
        <h1>Login</h1>
        <p>Use your discord account to log into your bot</p>
        <Button
          isActive={() => !loading}
          action={() => { console.log("click") }}
        >Login using Discord!</Button>
      </section>
    </div>
  );
};

export default Login;
