
import React, { useMemo, useState } from 'react';
import style from './signup.module.css';
import { FaCheck, FaDeleteLeft, FaLock, FaXmark } from 'react-icons/fa6';
import SignupAppBar from './signup-bar';
import KeyPad from './keypad';
import constants from '../../constants';
import HomeiCard from '../cards/home-icard';
import {  FaSave } from 'react-icons/fa';
import { FullDialogBase } from '../dialog/full-dialog-base';
import { InfoDialog } from '../dialog/dialog-contents/infoDialog';



export default function Signup({ dialogState, onSignup, onClose }) {


    const [logKey, setLogKey] = useState("");
    const [logState, setLogState] = useState( "true" );


    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [infoDialog, setInfoDialog] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    
    function hide(){
        setLogState("true") //dont show red on type
        setLogKey("");
        setQuestion("");
        setAnswer("");

        onClose();
    }


    function savePIN(){
        if(validate()){
            onSignup( logKey, question, answer );
            hide();
        }
    }


    function validate(){

        if(logKey.length != 4 ){ onInfo("Warning", "Please enter a 4-digit access code."); return false;}
        if(question.trim() == "" ){ onInfo("Warning", "Please enter security question."); return false;}
        if(answer.trim() == "" ){ onInfo("Warning", "Please enter security answer."); return false;}
        
        return true;
    }


    function disablePIN(){
        onSignup( "" );
        hide();
    }
    
    
    function onPasscode(key){

        var keys = logKey + key;

        if( logKey.length<4 ){
            setLogKey(keys);
        }

        if( keys.length >= 4){
            setLogState("true") //dont show red on type
        }else{
            setLogState( "false" )
        }

    }


    function del(){

        var k;
        if(logKey.length > 0){
            k = logKey.substring( 0, logKey.length-1 );
            setLogKey(k);
        }

        if( k.length == 4){
            setLogState("true") //dont show red on type
        }else{
            setLogState( "false" )
        }
    }


    function onInfo(title, body){
        setInfoDialog(true);
        setTitle(title);
        setBody(body);
    }


    const infoBox = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isOpaque={true} isScaleAnim="true" id="infoBoxConfig" items={ <InfoDialog title={title} body={body} /> } 
                onClose={ ()=>{ setInfoDialog(!infoDialog); } }
                dialogState={infoDialog}
            />
        }
    )



  return (

    <div id='signup' className={`${style.signupPane} ${(dialogState)? style.show:style.hide}`} >

            {infoBox}

            <SignupAppBar 

            noClose={true}
            
            onHide={
                ()=>{
                    hide();
                }
            } 
            
            onClose={
                ()=>{
                    hide();
                }
            } title={ ( constants.secure =="" )? "SIGN-UP" :  "SIGN-UP [" + constants.secure + "]" }/>
    


    <div className={style.container}>


    <div className={`${style.leftPane}`}>

    <div><FaLock size={40} className={style.icon}/></div>
    <label id='choose' className={style.choosePin}>Secure Staaris with a 4-digit Access Code</label>

    {( logKey != "" )?
    <div className={`d-flex justify-content-center align-items-center ${style.strokePane}`}> 


        {( logState=="true" )?
        
        <FaCheck size={14} color='var(--brand-color)' className={style.recover}/>

        :<div className={style.recover}></div>}


        <div className={ (logState=="true")? style.loginInput : style.loginInputWrong }> { logKey } </div>
        
        <FaDeleteLeft onClick={()=>{ del() }} size={22} className={style.delete}  />

    </div>
    : <div className={style.emptyStrokePane}></div>}
    


    <div id='signupPinArea' className={style.pinArea}>
    
    <div className='d-flex justify-content-center'>
        <KeyPad keyValue='1' onChange={ (key)=>{ onPasscode(key) } }/>
        <KeyPad keyValue='2' onChange={ (key)=>{ onPasscode(key) } }/>
        <KeyPad keyValue='3' onChange={ (key)=>{ onPasscode(key) } }/>
    </div>

    <div className='d-flex justify-content-center'>
        <KeyPad keyValue='4' onChange={ (key)=>{ onPasscode(key) } }/>
        <KeyPad keyValue='5' onChange={ (key)=>{ onPasscode(key) } }/>
        <KeyPad keyValue='6' onChange={ (key)=>{ onPasscode(key) } }/>
    </div>

    <div className='d-flex justify-content-center'>
        <KeyPad keyValue='7' onChange={ (key)=>{ onPasscode(key) } }/>
        <KeyPad keyValue='8' onChange={ (key)=>{ onPasscode(key) } }/>
        <KeyPad keyValue='9' onChange={ (key)=>{ onPasscode(key) } }/>
    </div>


    <div className='d-flex justify-content-center'>
        <KeyPad keyValue='0' onChange={ (key)=>{ onPasscode(key) } }/>
    </div>

    </div>

    </div>




    <div className={style.rightPane}>

       
        <div className={style.questions}>

            <div className={style.quest}>
                <label>Security Question:</label>
                <input className={style.input} onChange={(e)=>setQuestion(e.currentTarget.value.trim())} />
            </div>

            <div className={style.ans}>
                <label>Security Answer:</label>
                <input className={style.input} onChange={(e)=>setAnswer(e.currentTarget.value.trim())} />
            </div>
            
        </div>
        


        <div className={style.actions} >

            <div onClick={()=>{ savePIN() }}  style={{marginRight:"20px"}}>
                <HomeiCard title="Save Code" isShadow={true} icon={<FaSave size={18} />} />
            </div>

            <div onClick={()=>{ disablePIN() }} >
                <HomeiCard title="Disable" isShadow={true} icon={<FaXmark size={20} />} />
            </div> 

        </div>

        

    </div>

    

    </div>
    
    
    </div>
    

  );
};
