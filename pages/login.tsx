import { NextPage } from 'next';
import React, { useState, useEffect, } from 'react';
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
  const [ data, setData ] = useState<LoginData>();
  const updateData = (newData: LoginData) => setData(newData);
  const submitHandler = useForm(initialState)(updateData);

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input name="username" type="text"/>
        <input name="password" type="text" />
        <input type="submit" />
      </form>
    </div>
  );
};

export default Login;