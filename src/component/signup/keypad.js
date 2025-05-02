
import React from 'react';
import style from './signup.module.css';


function KeyPad({ keyValue, onChange }) {

    
  return (
    <div onClick={ ()=>{ onChange(keyValue) } } className={style.key}>
        {keyValue}
    </div>
  );
};


export default KeyPad;
