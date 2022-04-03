import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  clearCredentials,
  fetchCredentials,
  selectAuth,
  selectError,
} from "../../app/authSlice";
import classes from "./Login.module.css";
import { ReactComponent as Background } from "../../assets/Background.svg";
import { ReactComponent as Logo } from "../../assets/Logo.svg";
import Button from "../../components/ui/Button/Button";

if (!process.env.REACT_APP_HOSTNAME) {
  console.error("Hostname is not defined!");
}

const redirectURI = encodeURIComponent(process.env.REACT_APP_HOSTNAME!);
export const DISCORD_AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=712958072007688232&permissions=8&redirect_uri=${redirectURI}/login&response_type=code&scope=identify%20guilds`;

export const BOT_INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=712958072007688232&scope=bot";

const Login = () => {
  const history = useHistory();
  const { token } = useAppSelector(selectAuth);
  const error = useAppSelector(selectError);
  const dispatch = useAppDispatch();
  const [code, setCode] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window) return;
    const param = new URLSearchParams(window.location.search).get("code");
    if (param) {
      setCode(param);
    }
  }, []);

  useEffect(() => {
    if (!code) return;
    dispatch(fetchCredentials(code));
    setLoading(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  /**
   * Redirects user to main page if
   * access token is present
   */
  useEffect(() => {
    if (!token) return;
    history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /**
   * Handle API Errors
   */
  useEffect(() => {
    if (error) {
      // Remove invalid code from url and reset btns
      console.error(error);
      dispatch(clearCredentials());
      setLoading(false);
      history.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            type={"btn-large"}
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
            type={"btn-large"}
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
