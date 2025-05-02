
import React from 'react';
import style from './confirm-login.module.css';


function SlimLoginKey({ keyValue, onChange }) {

    
  return (

    <div onClick={ ()=>{ onChange(keyValue) } } className={style.slimkey}>
        {keyValue}
    </div>

  );
};


export default SlimLoginKey;
