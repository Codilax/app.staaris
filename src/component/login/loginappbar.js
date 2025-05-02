
import React, { useMemo, useState } from 'react';
import style from './loginappBar.module.css'

import {FaCircleMinus, FaCircleStop, FaCircleXmark, FaKey, FaLock} from 'react-icons/fa6'
import { getCurrentWindow } from '@tauri-apps/api/window';


// import electron from 'electron';
// const ipcRenderer = electron.ipcRenderer || false;

function LoginAppBar( { title, onCloseApp } ) { 

  var windowState = true;

  async function minimizeWindow(){
    await getCurrentWindow().minimize();
    // ipcRenderer.send('minimize-window');
  }

  async function maximizeWindow(){

    if( windowState ){
      // ipcRenderer.send('maximize-window');
      await getCurrentWindow().maximize();
      windowState = false;
    }else{
      // ipcRenderer.send('restore-window');
      await getCurrentWindow().unmaximize();
      windowState = true;
    }
    
  }


  
  
  return (


      <div className={`${style.appBar} `}>
  

        <label className={style.title }> { title } </label>

        <div className={style.dragRegion}></div>

        <div style={{marginRight:"0px"}}>


        <FaCircleMinus className={style.controlIcons}
        onClick={
          ()=>{
            minimizeWindow();
          }
        }
        />

        <FaCircleStop className={style.controlIcons}
        onClick={
          ()=>{
            maximizeWindow();
          }
        }
        />

      
        <FaCircleXmark 
        onClick={
          ()=>{
            onCloseApp();
          }
        }
        className={style.controlIcons}  />


        </div>

        

      </div>

  );
};

export default LoginAppBar;
