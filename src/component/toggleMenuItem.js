
import React from 'react';
import style from './toggleBarItem.module.css'
import { FaBars, FaBarsStaggered } from 'react-icons/fa6';

function ToggleMenuItem( {collapseState, callback} ) {

  return (

      <div className={`${style.toggleItem} `}>
        <FaBars size={20} onClick={
          ()=>{
            callback()
          }
        } className={style.icon}/>
        <label className={ (collapseState==false)? style.titleHide : style.title }>Staaris</label>
      </div>

  );
};

export default ToggleMenuItem;
