// import electron from 'electron';
import React from 'react';
import style from './confirm-loginappBar.module.css'

// import {FaUser, FaWindowClose, FaWindowMaximize, FaWindowMinimize, FaWindowRestore} from 'react-icons/fa'
import {FaCircleMinus, FaCircleStop, FaCircleXmark, FaKey, FaLock} from 'react-icons/fa6'
import { getCurrentWindow } from '@tauri-apps/api/window';
 
// const ipcRenderer = electron.ipcRenderer || false;

function ConfirmLoginAppBar( { title, onClose } ) {

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

        <div>



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

        <FaCircleXmark className={style.controlIcons}
        onClick={
          ()=>{
            onClose()
          }
        }
        />
        </div>
      </div>

  );
};

export default ConfirmLoginAppBar;
