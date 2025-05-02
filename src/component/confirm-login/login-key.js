
import React from 'react';
import style from './confirm-login.module.css';


function LoginKey({ keyValue, onChange }) {

    
  return (

    <div onClick={ ()=>{ onChange(keyValue) } } className={style.key}>
        {keyValue}
    </div>

  );
};


export default LoginKey;
