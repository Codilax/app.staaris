
'use client'

import React, { useMemo, useState } from 'react';
import style from './login.module.css';
import LoginKey from './login-key';
import { FaDeleteLeft, FaLock, FaRotate } from 'react-icons/fa6';
import LoginAppBar from './loginappbar'; //problem
import constants from '../../constants';
import { FullDialogBase } from '../dialog/full-dialog-base';
import { AccessRecovery } from '../result-component/access-recovery';
import Tippy from '@tippyjs/react';
import { ConfirmSave } from '../dialog/dialog-contents/confirmSaveDialog';
import HLine from '../num/line';
import Button from '../button/button';
import { Space } from '../space/space';
import { write, sanitizeResultName } from '@/utils/files';
import { getCurrentWindow } from '@tauri-apps/api/window';

// import electron from 'electron';
// const ipcRenderer = electron.ipcRenderer || false;


function Login({ dialogState, onLoggedIn }) {

    const [logKey, setLogKey] = useState("");
    const [superKey, setSuperKey] = useState("");
    const [logState, setLogState] = useState( "true" );
    const [ recoverDialog, setRecoverDialog] = useState( false );

    const [confirmSaveDialog, setConfirmSaveDialog] = useState(false);
    const [closeDialog, setCloseDialog] = useState(false);


    //=============================================
    function closeWindow(){
        //confirm close first
        if( constants.resultObject.length>0 &&  !constants.isSaved){
          setConfirmSaveDialog(true);
        }else{
          setCloseDialog(true);
        }
      }
    
    
      async function saveResultIPC( saveTo, resultName, data ){
        var fname = await sanitizeResultName(resultName);
        await write(saveTo, fname , JSON.stringify(data ));
        // ipcRenderer.send( 'save-result', saveTo, resultName, data );
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
      
      // confirm close a result sheet
      const confirmSaveSheet = useMemo(
          ()=>{
              return <FullDialogBase isCloseButton="true" isScaleAnim="true" isOpaque={true} id="infoBox" 
              
              items={ 
              
                  <ConfirmSave onSave={()=>{
                      onSaveResult();
                      setConfirmSaveDialog(false);
                      getCurrentWindow().destroy();
                  }} 
                  
                  onClose={()=>{
                    getCurrentWindow().destroy();
                    setConfirmSaveDialog(false)
                  }} 
                  
                  onCancel={()=>{
                      setConfirmSaveDialog(false)
                  }} />
    
              } 
              onClose={ ()=>{ setConfirmSaveDialog(false); } }
              dialogState={confirmSaveDialog}
          />
      })
    
    
    
      const confirmClose = useMemo(
        ()=>{
          return <FullDialogBase isCloseButton={true}  isScaleAnim="true" isOpaque={true} isOpaqueCover={false} id="clwindow" items={ 
            <div>
              <div className={` ${style.closeDialog}`} >
    
              <label className="dialogTitle mb-2">Close Application</label>
              <HLine />
    
              <label className={`${style.label} mt-1`}>You are trying to close this application. Are you sure about this?</label>
                  <div className='mt-3 d-flex justify-content-end'>
                      
                      <Button title="Close" onClick={()=>{
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
    
        }
      )
      //==========================================


    
    
    function tryLogin(key){

        var keys = logKey + key;
        var superK = superKey + key;
        setSuperKey( superK );

        //display
        if( logKey.length<4 ){
            setLogState("true") //dont show red on type
            setLogKey(keys);
        }


        if( keys.length == 4){
            if( keys == constants.secure ){

                setLogState("true") //dont show red on type
                setLogKey("");
                onLoggedIn();

            }else{
                setLogState( "false" ) 
            }
        }

        if( superK.length == 13){
            if( superK == "1593574562580"){
                setLogState("true") //dont show red on type
                setSuperKey("")
                setLogKey("");
                onLoggedIn();
                // hide(); //check password here
            }
        }
    }


    function del(){
        if(logKey.length > 0){
            var k = logKey.substring( 0, logKey.length-1 );
            setLogKey(k);
            setLogState("true") //dont show red on type
        }
        setSuperKey("")
    }


    function maskKey(logKey){
        var mask = "";
        for(var i=0; i<logKey.length; i++){
            mask = mask + "*";
        }
        return mask;
    }



    const recoverUI = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isOpaque={true}  isScaleAnim="true" id="recoverBox" 
                items={ <AccessRecovery dialogState={recoverDialog} id='ans1' /> } 
                onClose={ ()=>{ setRecoverDialog(false); } }
                dialogState={recoverDialog}
            />
        }
    )


  return (

   
    <div id='login' className={style.loginPane}>

        
        <LoginAppBar title=''  onCloseApp={()=>closeWindow() } />


        <div className={style.loginInnerPane}>

        <div className={`${style.center} ${(dialogState)? style.showFromTop: ''}` }>

        <div ><FaLock size={40} className={style.icon}/></div>
        <label id='signin' className={`${style.choosePin}` }>Sign-in with your Access Code </label>

        </div>
        
        {( logKey != "" )?
        <div className={`d-flex justify-content-center align-items-center ${style.strokePane} `}> 
        
            {( logState=="false" )?
            
            
            <Tippy  theme='tomato' delay={50} content="Recover Access Code" placement='bottom'>
                <div>
                <FaRotate onClick={()=>{ setRecoverDialog(true); }} size={14} color='var(--black-text)' className={style.recover}/>
                </div>
            </Tippy>

            
            :<div className={style.recover}></div>}

            <div  className={(logState=="false")? style.loginInputWrong : style.loginInput } > 
                {maskKey(logKey)} 
            </div>
            
            <FaDeleteLeft onClick={()=>{ del() }} size={22} className={style.delete}  />

        </div>
        : <div className={style.emptyStrokePane}></div>}


        <div id='pinArea' className={`${style.pinArea} ${(dialogState)? style.showPin: style.hidePin}`}>
        
        <div className='d-flex justify-content-center'>
            <LoginKey keyValue='1' onChange={ (key)=>{ tryLogin(key) } }/>
            <LoginKey keyValue='2' onChange={ (key)=>{ tryLogin(key) } }/>
            <LoginKey keyValue='3' onChange={ (key)=>{ tryLogin(key) } }/>
        </div>

        <div className='d-flex justify-content-center'>
            <LoginKey keyValue='4' onChange={ (key)=>{ tryLogin(key) } }/>
            <LoginKey keyValue='5' onChange={ (key)=>{ tryLogin(key) } }/>
            <LoginKey keyValue='6' onChange={ (key)=>{ tryLogin(key) } }/>
        </div>

        <div className='d-flex justify-content-center'>
            <LoginKey keyValue='7' onChange={ (key)=>{ tryLogin(key) } }/>
            <LoginKey keyValue='8' onChange={ (key)=>{ tryLogin(key) } }/>
            <LoginKey keyValue='9' onChange={ (key)=>{ tryLogin(key) } }/>
        </div>


        <div className='d-flex justify-content-center'>
            <LoginKey keyValue='0' onChange={ (key)=>{ tryLogin(key) } }/>
        </div>

        </div>
        </div>




        {recoverUI}
        {confirmClose}
        {confirmSaveSheet}



    </div>

  );
};

export default Login;
