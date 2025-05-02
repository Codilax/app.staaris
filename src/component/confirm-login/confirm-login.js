
import React, { useMemo, useState } from 'react';
import style from './confirm-login.module.css';
import SlimLoginKey from './slim-login-key';
import { FaDeleteLeft, FaLock, FaRotate } from 'react-icons/fa6';
import constants from '../../constants';
import { FullDialogBase } from '../dialog/full-dialog-base';
import { AccessRecovery } from '../result-component/access-recovery';
import Tippy from '@tippyjs/react';


function ConfirmLogin({ onConfirmed, dialogState }) {

    const [logKey, setLogKey] = useState("");
    const [superKey, setSuperKey] = useState("");
    const [logState, setLogState] = useState( "true" );

    const [ recoverDialog, setRecoverDialog] = useState( false );
    
    
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
                // onClose();

                onConfirmed();

            }else{
                setLogState( "false" ) 
            }
        }

        if( superK.length == 13){
            if( superK == "1593574562580"){
                setLogState("true") //dont show red on type
                setSuperKey("")
                setLogKey("");
                // onClose();
                onConfirmed();
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
                items={ <AccessRecovery dialogState={recoverDialog} id='ans2' /> } 
                onClose={ ()=>{ setRecoverDialog(false); } }
                dialogState={recoverDialog}
            />
        }
    )


  return (

    <div style={{padding:"15px 0 0 0", maxHeight:"85vh", overflowY:"scroll", overflowX:"hidden"}}>

        {recoverUI}


    <div id='confirmLogin' className={`${style.headArea} ${(dialogState)? style.showFromTop: ''}` }>
        <FaLock size={40} className={style.icon}/>
        <label  className={`${style.choosePin} }` }>
            Sign-in to modify or disable access code.
        </label>
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


    <div className={`${style.pinArea} ${(dialogState)? style.showPin: "" }`}>
    
    <div className='d-flex justify-content-center'>
        <SlimLoginKey keyValue='1' onChange={ (key)=>{ tryLogin(key) } }/>
        <SlimLoginKey keyValue='2' onChange={ (key)=>{ tryLogin(key) } }/>
        <SlimLoginKey keyValue='3' onChange={ (key)=>{ tryLogin(key) } }/>
    </div>

    <div className='d-flex justify-content-center'>
        <SlimLoginKey keyValue='4' onChange={ (key)=>{ tryLogin(key) } }/>
        <SlimLoginKey keyValue='5' onChange={ (key)=>{ tryLogin(key) } }/>
        <SlimLoginKey keyValue='6' onChange={ (key)=>{ tryLogin(key) } }/>
    </div>

    <div className='d-flex justify-content-center'>
        <SlimLoginKey keyValue='7' onChange={ (key)=>{ tryLogin(key) } }/>
        <SlimLoginKey keyValue='8' onChange={ (key)=>{ tryLogin(key) } }/>
        <SlimLoginKey keyValue='9' onChange={ (key)=>{ tryLogin(key) } }/>
    </div>


    <div className='d-flex justify-content-center'>
        <SlimLoginKey keyValue='0' onChange={ (key)=>{ tryLogin(key) } }/>
    </div>

    </div>

    
    </div>

    
  );
};

export default ConfirmLogin;
