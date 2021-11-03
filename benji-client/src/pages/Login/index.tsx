import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchCredentials, selectAuth } from '../../app/authSlice';
import classes from './Login.module.css';
import { ReactComponent as Background } from '../../assets/Background.svg';
import { ReactComponent as Logo } from '../../assets/Logo.svg';
import Button from '../../components/Button/Button';

export const DISCORD_AUTH_URL = 'https://discord.com/api/oauth2/authorize?client_id=712958072007688232&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code&scope=identify%20guilds';
  //'https://discord.com/api/oauth2/authorize?client_id=712958072007688232&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code&scope=identify%20guilds';

export const BOT_INVITE_URL =
  'https://discord.com/oauth2/authorize?client_id=712958072007688232&scope=bot';

const Login = () => {
  const history = useHistory();
  const { accessToken, error } = useAppSelector(selectAuth);
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

  /**
   * Redirects user to main page if
   * access token is present
   */
  useEffect(() => {
    if (!accessToken) return;
    history.push('/');
  }, [accessToken]);

  /**
   * Handle API Errors
   */
  useEffect(() => {
    if (error) {
      // Remove invalid code from url and reset btns
      setLoading(false);
      history.push('/login');
    }
  }, [error]);

  return (
    <div className={classes.login_container}>
      <Background className={classes.background} />
      <header>
        <Logo />
        <h1>Benji.</h1>
      </header>
      <section>
        <div>
          <h1>New Here?</h1>
          <p>Start by adding Benji to your server!</p>
          <Button
            type={'button'}
            isActive={() => !loading}
            onClick={() => {
              window.location.href = BOT_INVITE_URL;
            }}
          >
            Add to Server!
          </Button>
        </div>
        <div>
          <h1>Login</h1>
          <p>Use your discord account to log into your bot</p>
          <Button
            type={'button'}
            isActive={() => !loading}
            onClick={() => {
              window.location.href = DISCORD_AUTH_URL;
            }}
          >
            Login using Discord!
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Login;
