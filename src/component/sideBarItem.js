
import React from 'react';
import style from './sideBarItem.module.css'
import { MenuContextContent } from './context-dialog-content/menu-context-content';
import constants from '../constants';

function SideBarItem({collapseState, onSelect, title, icon, index, sIndex }) {

  return (
    
    <div 
      onClick={ ()=>{ onSelect( index ) } } 
      className={`${style.sideBarItem} ${(index==sIndex)?style.selected:""} `}>

        <div className={ (index==sIndex)?style.select: style.deselect }></div>

        <div className={style.icon}> {icon} </div>

        <label className={(collapseState)?style.title: style.titleHide  }>{title}</label>

        {(!constants.menuExpandable)?<div className={( collapseState )?style.noMenu: style.contextMenu}> 
            <MenuContextContent title={title}  />
        </div>:<></>}

    </div>


  );
};

export default SideBarItem;
