import { useState, useEffect, ChangeEvent, useReducer } from 'react';

const useForm =
  <FContent>(defaultValues: FContent) =>
    (handler: (content: FContent) => void) => {


    const [state, dispatch] = useReducer(reducer, defaultValues);

    function reducer(state: FContent, action: any) {
      return { ...state }
    }

    return {
      submitHandler: async (event: ChangeEvent<HTMLFormElement>) => { return null },
      changeHandler: (event: ChangeEvent<HTMLInputElement>) => {},
    }
  }