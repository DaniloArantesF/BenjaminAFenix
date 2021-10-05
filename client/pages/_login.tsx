import { sign } from 'crypto';
import { NextPage } from 'next';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { selectAuth, setUsername, setPassword } from '../app/authSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import classes from '../styles/Login.module.css';
import { captalizeName } from '../util/util';

// https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
const PASS_RE = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{5,}$/);
// https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username/12019115
const USER_RE = new RegExp(
  /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
);

export interface FormField {
  name: string;
  value?: string;
  isValid: (pass: string) => boolean;
  errorMessage: string;
  type: string;
  handler: (e: ChangeEvent<HTMLInputElement>) => any;
}

const FormItem = ({
  name,
  type,
  handler,
  value,
  errorMessage,
  isValid,
}: FormField) => {
  return (
    <div className={classes.form__item}>
      <input name={name} type={type} value={value} onChange={handler} />
      <label className={value !== '' ? classes.filled : ''}>
        {captalizeName(name)}
      </label>
      <span className={classes.form__error}>
        {!(value === '' || isValid(value || '')) && errorMessage}
      </span>
    </div>
  );
};



const Login: NextPage = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

  const fields: FormField[] = [
    {
      name: 'username',
      isValid: (user) => user.match(USER_RE) !== null,
      errorMessage: 'Your username is not valid!',
      type: 'text',
      handler: (event) => {
        event.preventDefault();
        dispatch(setUsername(event.target.value));
      },
    },
    {
      name: 'password',
      isValid: (pass) => pass.match(PASS_RE) !== null,
      errorMessage: 'Your password is not valid!',
      type: 'password',
      handler: (event) => {
        event.preventDefault();
        dispatch(setPassword(event.target.value));
      },
    },
  ];

  // iterate calling isValid for each field then reduce to single value using AND
  const validateFields = () => {
    return fields
      .map((field, index) => {
        return field.isValid(auth[field.name] || '');
      })
      .reduce((validSoFar, curField) => validSoFar && curField);
  };

  const submitHandler = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formValid = validateFields();
    if (formValid) {
      // redirect
    }
  };

  return (
    <div className={classes.login_container}>
      <form className={classes.form_component} onSubmit={submitHandler}>
        <h2 className={classes.form__title}>Login</h2>
        {fields.map((field, index) => {
          return <FormItem key={index} value={auth[field.name]} {...field} />;
        })}

        <div>
          <input className={classes.form__submit} type="submit" />
        </div>
      </form>
    </div>
  );
};

export default Login;
