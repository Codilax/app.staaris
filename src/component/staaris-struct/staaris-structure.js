'use client'

import AppBar from "../appbar";
import SideBar from "../sideBar";
import style from './staaris-structure.module.css'
import React, { useEffect, useMemo, useState } from 'react';

import settings from '../../constants'
import { FullDialogBase } from "../dialog/full-dialog-base";
import Button from "../button/button";
import { Space } from "../space/space";
import { ConfirmSave } from "../dialog/dialog-contents/confirmSaveDialog";
import constants from "../../constants";
import HLine from "../num/line";

import { getCurrentWindow } from '@tauri-apps/api/window'
import { write } from "@/utils/files";
import {usePathname, useSearchParams, useRouter} from 'next/navigation'

export function StaarisStructure( { onLockCalled, children } ) {

  const [ selectedMenu, setSelectMenu] = useState( 0 );
  const [closeDialog, setCloseDialog] = React.useState(false);

  const [isNoLockDialog, setIsNoLockDialog] = React.useState(false);
  
  const router = useRouter();
  const pathname = usePathname()
  

  useEffect(() => {
    var index = pathToIndex(pathname);
    setSelectMenu( index );
  }, [pathname]);



  function gotoPage(route){
    router.push(route, undefined, {shallow:true});  
  }



  function closeWindow(){
    //confirm close first
    if( constants.resultObject.length>0 &&  !constants.isSaved){
      setConfirmSaveDialog(true);
    }else{
      setCloseDialog(true);
    }
  }


  function pathToIndex(path){

    switch (path) {
      case undefined: return 0;
      case "/": return 0;
      case '/home': return 0;
      case '/results': return 1;
      case '/archives': return 2;
      case '/about': return 3;
      case '/settings': return 4;
      default: return 0;
    }
  }


  function loadPage( index ){

    if(index==0){
      gotoPage('/')
    }else if(index==1){
      gotoPage('/results')
    }else if(index==2){
      gotoPage('/archives')
    }else if(index==3){
      gotoPage('/about')
    }else if(index==4){
      gotoPage('/settings')
    }
    
  }
  

    //====================================================================

    async function saveResultIPC( saveTo, resultName, data ){
      await write(saveTo, resultName, JSON.stringify(data));
    };

    function makeDate(d,m,y){
        return getMonthString(m) + " " + d + ", " + y;
    }

    function getMonthString(month){
        switch(month){

            case 0: return "Jan";
            case 1: return "Feb";
            case 2: return "March";
            case 3: return "April";
            case 4: return "May";
            case 5: return "June";
            case 6: return "July";
            case 7: return "Aug";
            case 8: return "Sept";
            case 9: return "Oct";
            case 10: return "Nov";
            case 11: return "Dec";
        
            default: return "Jan";
          }
    }


    function onSaveResult(){

        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth();
        var d = date.getDate();

        var resultData = {
            "dateCreated": makeDate(d,m,y),
            "templateName": constants.templateName,
            "template": constants.template,
            "passMark": constants.gradingSystem.passMark,
            "gradingSystemName": constants.gradingSystemName,
            "gradingSystem": constants.gradingSystem.gradingSystem,
            "selectedColumn": constants.selectedColumn,
            "currentFoundStudentIndex": constants.currentFoundStudentIndex,
            "resultName": constants.resultName,
            "resultObject": constants.resultObject,
        }

        //save result to file system
        saveResultIPC( constants.saveToFolder, constants.resultName, resultData );
        
    }

  //======================================================================



  const [confirmSaveDialog, setConfirmSaveDialog] = useState(false); 
  //confirm close a result sheet
  const confirmSaveSheet = useMemo(
      ()=>{
          return <FullDialogBase isCloseButton="true" isCenter="true" isScaleAnim="true" id="infoBox" 
          
          items={ 
          
              <ConfirmSave onSave={()=>{
                  onSaveResult();
                  setConfirmSaveDialog(false);
                  getCurrentWindow().destroy();
                  // ipcRenderer.send('close-window');
              }} 
              
              onClose={()=>{
                  getCurrentWindow().destroy();
                  // ipcRenderer.send('close-window');
                  setConfirmSaveDialog(false)
              }} 
              
              onCancel={()=>{
                  setConfirmSaveDialog(false)
              }} />

          } 

          onClose={ ()=>{ setConfirmSaveDialog(false); } }
          dialogState={confirmSaveDialog}

      />
  }, [confirmSaveDialog] )




  const isLoggedUI = useMemo(
    ()=>{
      return <FullDialogBase
      isCenter={true}
      id="noLock"
      isCloseButton={true}
      dialogState={isNoLockDialog}
      onClose={()=>{ setIsNoLockDialog(false) }}
      items={
        <div className={`${style.noLock}`}>

          <label className="dialogTitle mb-2">Access Code</label>
          <HLine />

          <label onClick={()=>{ 
            
              setSelectMenu(4);
              setIsNoLockDialog(false);
              loadPage(4);
              
              }} className={style.goto} >You have not created an Access Code.<br />Go to &apos;Settings&apos; {">"} &apos;Application Security&apos;.</label>
          
        </div>
      }
    
    />
    }, [isNoLockDialog]
  )



  const closeAppUI = useMemo(
    ()=>{
      return <FullDialogBase isCenter={true} isCloseButton={true} isTransparent={false} isOpaqueCover={false} id="coseWindow" items={ 
        <div>
          <div className={` ${style.closeDialog}`} >

          <label className="dialogTitle mb-2">Close Application</label>
          <HLine />

          <label className={`${style.label} mt-1`}>You are trying to close this application. Are you sure about this?</label>
              <div className='mt-3 d-flex justify-content-end'>
                  
                  <Button title="Close App" onClick={()=>{
                      getCurrentWindow().destroy();
                  }} />

                  <Space />

                  <Button title="Cancel" onClick={()=>{
                      setCloseDialog(false);
                  }} />
                  


              </div>
          </div>
        </div>

     } 
      onClose={ ()=>{ setCloseDialog(!closeDialog); } }
      dialogState={closeDialog}
    />
    }, [closeDialog]
  )

    
    return (

        <div style={{ display:"flex" }} className='baseBGLight' >

          { isLoggedUI }
          { closeAppUI }
          { confirmSaveSheet }

          <SideBar 
            selectedMenu={selectedMenu}
            onSelect={
              ( index )=>{
                  setSelectMenu(index);
                  loadPage(index);
              }
            } 
          />


          <div className={style.rightPane}>

          <AppBar

          onClose={
            ()=>{
              closeWindow();
            }
          }

          onLock={
            ()=>{
              if( settings.secure != "" ){
                onLockCalled();
              }else{
                setIsNoLockDialog(true);
              }
            }
          }

          selectedMenu={selectedMenu}/>

          <div className={style.contentArea}>
            { children }
          </div>

          </div>

        </div>
  
    );

  }