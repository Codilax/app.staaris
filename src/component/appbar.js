// import electron from 'electron';
import React from 'react';
import style from './appBar.module.css'

import {FaCircleMinus, FaCircleStop, FaCircleXmark, FaKey, FaLock} from 'react-icons/fa6'
import HBar from './bar/hbar';
import Tippy from '@tippyjs/react';

import { getCurrentWindow } from '@tauri-apps/api/window'
import StatusBar from './toolbar/statusbar';
 
// const ipcRenderer = electron.ipcRenderer || false;

function AppBar( {windowButtonOnly, customTitle, isTitleWhite, selectedMenu, onClose, onLock } ) {

  // const [message, setMessage] = React.useState('no ipc message');
  var menus = ["HOME", "RESULTS", "ARCHIVES", "ABOUT", "SETTINGS"];
  var windowState = true;
  
  const [ firstTime , setF ] = React.useState( "true" );


  async function minimizeWindow(){
    await getCurrentWindow().minimize();
  }


  async function maximizeWindow(){

    if( windowState ){
      await getCurrentWindow().maximize();
      // ipcRenderer.send('maximize-window');
      windowState = false;
    }else{
      await getCurrentWindow().unmaximize();
      // ipcRenderer.send('restore-window');
      windowState = true;
    }

  }

  
  React.useEffect(() => {
    setF("false")
  }, []);


  if( selectedMenu != -1 ){
    if( firstTime == "false" ){
        var textElement = document.getElementById('title');
        if(textElement){
          textElement.className = 'hideTitle';
          textElement.focus(); // use focus trick without setTimeOut
          textElement.className = 'showTitle';
        }
    }
  }


  return (

      <div className={`${style.appBar} `}>

        <label id='title' style={{paddingLeft:"8px"}} className={(isTitleWhite)? style.whiteTitle: style.title }> { (customTitle)? customTitle : menus[selectedMenu]} </label>
        
        <StatusBar />
        
        <div className={style.dragRegion}></div>
        <div className='d-flex align-items-center' >

        {(windowButtonOnly)?
        <></>
        :
        <Tippy  theme='tomato' delay={50} content="Lock App" placement='bottom'>
          <div>
            <FaLock size={15} className={style.controlIcons}
              onClick={
                ()=>{
                  onLock();
                }
              }
            />
          </div>
        </Tippy>

        }

        <HBar/>

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

export default AppBar;
