import { NextPage } from 'next';
import React, { useState, useEffect, ChangeEvent, } from 'react';
import classes from '../styles/Login.module.css';
import { useForm } from '../app/hooks';

interface LoginData {
  username: string;
  password: string;
}

const initialState: LoginData = {
  username: '',
  password: ''
}

const Login: NextPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const updateData = (newData: LoginData) => setData(newData);
  // const submitHandler = useForm(initialState)(updateData);

  const isUsernameValid = (username: string) => username.length > 5;
  const isPasswordValid = (password: string) => password.length > 3;

  const submitHandler = (event: ChangeEvent<HTMLFormElement>) => {};

  return (
    <div className={ classes.login_container }>
      <form className={classes.form_component} onSubmit={submitHandler}>
        <h2 className={ classes.form__title }>Login</h2>
        <div className={ classes.form__item }>
          <input name="username" type="text"/>
          <label>Username</label>
        </div>
        <div className={ classes.form__item }>
          <input name="password" type="text" />
          <label>Password</label>
        </div>
        <div>
          <input className={ classes.form__submit } type="submit" />
        </div>
      </form>
    </div>
  );
};

export default Login;