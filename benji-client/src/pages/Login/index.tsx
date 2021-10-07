import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCredentials, selectAuth } from '../../store/authSlice';
import classes from './Login.module.css';
import { ReactComponent as Background } from '../../assets/Background.svg';
import { ReactComponent as Logo } from '../../assets/Logo.svg';
import Button from '../../components/Button/Button';

const DISCORD_AUTH_URL =
  'https://discord.com/api/oauth2/authorize?client_id=712958072007688232&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code&scope=identify%20guilds';

const Login = () => {
  const history = useHistory();
  const { accessToken } = useAppSelector(selectAuth);
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
    setLoading(true);
  }, [code]);

  useEffect(() => {
    if (!accessToken) return;
    history.push('/');
  }, [accessToken]);

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
          action={() => {
            window.location.href = DISCORD_AUTH_URL;
          }}
        >
          Login using Discord!
        </Button>
      </section>
    </div>
  );
};

export default Login;
