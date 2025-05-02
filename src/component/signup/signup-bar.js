// import electron from 'electron';
import React from 'react';
import style from './signupBar.module.css';
import { FaCircleMinus, FaCircleStop, FaCircleXmark} from 'react-icons/fa6'
import BackButton from '../button/back-button';
import { getCurrentWindow } from '@tauri-apps/api/window';
 
// const ipcRenderer = electron.ipcRenderer || false;

function SignupAppBar( { title, onHide, noClose } ) {

  var windowState = true;

  function closeWindow(){
    //confirm close first
    if( constants.resultObject.length>0 &&  !constants.isSaved){
      setConfirmSaveDialog(true);
    }else{
      setCloseDialog(true);
    }
  }


  async function minimizeWindow(){
    // ipcRenderer.send('minimize-window');
    await getCurrentWindow().minimize();
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

      
        <BackButton onClick={
          ()=>{
            onHide();
          }
        } title='Back to Settings'/>
      
        
        <div className={` d-flex align-items-center`}>       


        <FaCircleMinus  className={style.controlIcons}
        onClick={
          ()=>{
            minimizeWindow();
          }
        }
        />

        <FaCircleStop  className={style.controlIcons}
        onClick={
          ()=>{
            maximizeWindow();
          }
        }
        />

        <FaCircleXmark 
        
        onClick={()=>{
          if(!noClose){
            closeWindow();
          }
        }}
        
        className={ ` ${style.controlIcons } ${noClose?style.disabled:""} ` } />


        </div>
      </div>

  );
};

export default SignupAppBar;
