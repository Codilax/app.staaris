'use client';

import { useMemo, useState } from "react";
import style from './page.module.css';
import {  FaBarsStaggered, FaChartColumn, FaCirclePlus, FaFaceLaugh, FaFileLines, FaFolderOpen, FaGear, FaGears, FaListUl, FaLock, FaMicrophone, FaMoon, FaPen, FaPenToSquare, FaPerson, FaPlus, FaRegMoon, FaSpeakap, FaSquarePen, FaStar, FaUnlock } from "react-icons/fa6";
import Button from "../../component/button/button";
import Templates from "../../component/templates/templates";
import GradingSystem from "../../component/grading-system/grading-system";
import Signup from "../../component/signup/signup";
import React from 'react';

import settings from '../../constants';
// import { v4 as uid } from 'uuid';
import Switch from "../../component/checkbox/switch";
import AddGradingSystem from "../../component/settings-components/add-grading-system";
import AddTemplate from "../../component/settings-components/add-template";
import { LoginDialogBase } from "../../component/dialog/login-dialog-base";
import ConfirmLogin from "../../component/confirm-login/confirm-login";
import { FullDialogBase } from "../../component/dialog/full-dialog-base";
import ViewGradingSystem from "../../component/settings-components/view-grading-system";
import ViewTemplate from "../../component/settings-components/view-template";
import Tippy from "@tippyjs/react";

// import electron from 'electron';
import { FaCheckCircle, FaVolumeUp } from "react-icons/fa";
import GButton from "../../component/button/generic-button";
import HLine from "../../component/num/line";
import { NoData } from "../../component/no-data";
import { write } from "@/utils/files";
import constants from "../../constants";

// const ipcRenderer = electron.ipcRenderer || false;

let synthesis;

function Settings({  }) {

    const [ selectedGradingSystemName, setSelectedGradingSystemName] = useState( "" );
    const [ selectedGradingSystem, setSelectedGradingSystem] = useState( 
        {"name":"", "date": "", "ctimeMS": 0, "content": {"passMark":0,"gradingSystem":[]} }  
     );


    const [ selectedTemplateName, setSelectedTemplateName] = useState( "" );

    const [ selectedTemplate, setSelectedTemplate] = useState( 
        {"name":"", "date": "", "ctimeMS": 0, "content":[] }  
    );

    const [ initWarningDialog, setInitWarningDialog] = useState( true );
    const [ expandedState, setExpandedState ] = useState( true );

    const [ darkState, setDarkState] = useState( false );
    const [ menuExpandable, setMenuExpandable] = useState( false );
    
    const [ hapticState, setHapticState] = useState( true );
    const [ talkbackState, setTalkbackState] = useState( true );

    const [ PIN, setPIN] = useState( "" );


    const [gradeDialog, setGradeDialog] = useState(false);
    const [voicesDialog, setVoicesDialog] = useState(false);

    const [viewGradeDialog, setViewGradeDialog] = useState(false);

    const [templateDialog, setTemplateDialog] = useState(false);
    const [viewTemplateDialog, setViewTemplateDialog] = useState(false);
    
    const [signupDialog, setSignupDialog] = useState(false);
    const [confirmLoginDialog, setConfirmLoginDialog] = useState(false);

    const [voices, setVoices] = useState([]);
    const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(-1);

    React.useEffect(() => {

        synthesis = window.speechSynthesis;

        setPIN(settings.secure)
        setDarkState(settings.darkMode);
        setMenuExpandable(settings.menuExpandable);
        setInitWarningDialog(  settings.warningDialog );
        setExpandedState(settings.menuState);
        setSelectedGradingSystemName( settings.selectedGradingSystemName );
        setSelectedTemplateName( settings.selectedTemplateName );
        setHapticState(settings.haptic);
        setTalkbackState(settings.talkback);
        setSelectedVoiceIndex(settings.talkbackvoiceindex);

    }, []);


    function getVoices(){
        try{

            if(synthesis == undefined || synthesis == null){ synthesis = window.speechSynthesis; } 

            var v = synthesis.getVoices();
            setVoices(v);
            setVoicesDialog(true);

        }catch(e){ }
    }
    

    function makeSettings(){
        var DAWMSetting = {
            "darkMode" : settings.darkMode,
            "menuState" : settings.menuState,
            
            "secure" : settings.secure,      //the passkey is stored here
            "secureQuestion": settings.secureQuestion,
            "secureAnswer": settings.secureAnswer,

            "warningDialog" : settings.warningDialog,
            "selectedGradingSystem" : settings.selectedGradingSystemName,
            "selectedTemplate" : settings.selectedTemplateName,
            "haptic": settings.haptic,
            "talkback" : settings.talkback,
            "talkbackvoiceindex": settings.talkbackvoiceindex,
        }
        return DAWMSetting;
    }


    function writeSettings(){
        saveSettingsIPC();
    }


    async function saveSettingsIPC(){
        await write(constants.dir_settings, "settings", JSON.stringify(makeSettings()) );
    };
  

    function onTheme( state ){

        var root = document.documentElement;

        writeSettings();


        if( state ){        //DARK MODE

            root.style.setProperty( '--barImg', "url('/images/sideBarBgDark.png')" );
            root.style.setProperty( '--loginImg', "url('/images/loginDark.png')" );
            
            root.style.setProperty( '--bar-head-color', 'rgb(4, 157, 131)' );

            root.style.setProperty( '--base-color', 'rgb(18,30,46)' );
            root.style.setProperty( '--base-color-light', 'rgb(20, 34, 53)' );

            root.style.setProperty( '--brand-color', 'rgb(4, 157, 131)' );
            root.style.setProperty( '--brand-color-light', 'rgba(4, 157, 131, 0.8 )' );

        
            root.style.setProperty( '--brand-color-dark', 'rgb(4, 157, 131)' );

            root.style.setProperty( '--white-text', 'rgb( 255,255,255 )' );
            root.style.setProperty( '--black-text', 'rgba( 255,255,255, 0.8 )' );
            root.style.setProperty( '--shadow-color', 'rgba( 0,0,0, 0.1 )' );
            root.style.setProperty( '--hover-color', 'rgba( 0,202,170, 0.1 )' );
            root.style.setProperty( '--hover-color-dark', 'rgba( 0,202,170, 0.2 )' );

            root.style.setProperty( '--scroll-color', 'rgba( 0,202,170, 0.1 )' );

            root.style.setProperty( '--resultBorderColor', 'rgb(5,10,15)' );

            root.style.setProperty( '--pass-color', 'rgb(4, 157, 131)' );
            root.style.setProperty( '--fail-color', 'rgb(255, 125, 194)' );
            root.style.setProperty( '--dialog-color', 'rgba(255,255,255,0.1)' );

        }else{          //LIGHT MODE ACTIVATED
            
            root.style.setProperty( '--dialog-color', 'rgba(255,255,255,0.6)' );
            root.style.setProperty( '--barImg', "url('/images/sideBarBgLight.png')" );
            root.style.setProperty( '--loginImg', "url('/images/loginLight.png')" );
                
            root.style.setProperty( '--bar-head-color', 'rgb(77, 8, 107)' );
            root.style.setProperty( '--base-color', 'rgb(255,255,255)' );
            root.style.setProperty( '--base-color-light', 'rgb(255,255,255)' );
        
            root.style.setProperty( '--brand-color', 'rgb(77, 8, 107)' );
            root.style.setProperty( '--brand-color-light', 'rgba( 77, 8, 107, 0.8 )' );
            root.style.setProperty( '--brand-color-dark', 'rgb(77, 8, 107)' );

            root.style.setProperty( '--white-text', 'rgb( 255,255,255 )' );
            root.style.setProperty( '--black-text', 'rgba( 0,0,0,0.8 )' );
            root.style.setProperty( '--shadow-color', 'rgba( 100,100,100, 0.3 )' );
            root.style.setProperty( '--hover-color', 'rgba( 123,31,162, 0.1 )' );
            root.style.setProperty( '--hover-color-dark', 'rgba( 123,31,162, 0.2 )' );
            
            root.style.setProperty( '--scroll-color', 'rgba( 100,100,100, 0.2 )' );

            root.style.setProperty( '--resultBorderColor', 'rgb(200,200,200)' );

            root.style.setProperty( '--pass-color', 'rgb(77, 8, 107)' );
            root.style.setProperty( '--fail-color', 'rgb(227, 18, 129)' );

        }
    }



    const signupUI = useMemo(

        ()=><LoginDialogBase
            id="signup"
            dialogState={signupDialog}
            onClose={ ()=>{ setSignupDialog(false); } }

            items={
            
                <Signup onSignup={
                    (pin, question, answer)=>{
                        settings.secure = pin;
                        settings.secureQuestion = question;
                        settings.secureAnswer = answer;
                        writeSettings();
                        setPIN(pin); //update pin
                    }
                } 
                dialogState={signupDialog} 
                onClose={ ()=>{ setSignupDialog(false); } } 
            />
        
            }
        />, [ signupDialog ]
    )



    const voicesDialogUI = useMemo(
        ()=><FullDialogBase
            isCenter={true}
            id="voicesDial"
            isScaleAnim={true}
            dialogState={voicesDialog}
            isCloseButton={true}
            onClose={ ()=>{ setVoicesDialog(false); } }
            items={ 
                <div >
                    <div style={{margin:'30px'}} className='d-flex align-items-center mb-3 mt-3'>
                    <label className='dialogTitle'>TalkBack voice</label>
                    </div>
        
                <HLine />
                    {
                        (voices)?voices.map(
                        (item, index)=>{
                            return <div key={index} onClick={()=>{

                                if( synthesis!=null && synthesis!=undefined && !synthesis.speaking ){

                                    try{
                                        const utterance = new SpeechSynthesisUtterance( voices[ index ].name );
                                        utterance.voice = voices[ index ];
                                        synthesis.speak(utterance);

                                    }catch(e){}
    
                                    setSelectedVoiceIndex(index);
                                    settings.talkbackvoiceindex = index;
                                    writeSettings();
                                }

                            }}   className={`${style.voice} ${selectedVoiceIndex==index? style.selectedVoice:""}`}> 
                                    
                                        { selectedVoiceIndex==index? <FaCheckCircle color="var(--brand-color)" style={{marginRight:'10px'}}/> : <FaFaceLaugh  style={{marginRight:'10px'}}/> }
                                    
                                        { item.name} 
                                    
                                    </div>
                        }
                        ):

                        <NoData icon={<FaFaceLaugh size={25} />} body="No voice found on your computer." />
                    }



                    <div style={{margin:'5px 20px'}} className='d-flex align-items-center justify-content-end'>
                    <Button title="Done" onClick={()=>{ setVoicesDialog(false); }} />
                    </div>
                    

                </div>       
        }
        />
    )


    const confirmLoginUI = useMemo(
        ()=><FullDialogBase
            isCenter={true}
            id="confirmLogin"
            isScaleAnim={true}
            dialogState={confirmLoginDialog}
            isCloseButton={true}
            onClose={ ()=>{ setConfirmLoginDialog(false); } }
            items={
                <ConfirmLogin 
                    dialogState={confirmLoginDialog}
                    onConfirmed={ ()=>{ 
                        setConfirmLoginDialog(false); 
                        setSignupDialog(true); 
                    } }
                />
            }
        />, [confirmLoginDialog]
    )


    const addGradingUI = useMemo(
        ()=><FullDialogBase isCloseButton={true} isScaleAnim={true} isCenter={true} id="gradeMenu"  items={
            <AddGradingSystem dialogState={gradeDialog} onAdd={(name)=>{
                setSelectedGradingSystemName(name);
                setGradeDialog(false);
            }} />
        } 
        onClose={ ()=>{ setGradeDialog(false); } }
        dialogState={gradeDialog}
        />, [gradeDialog]
    )

    const viewGradingUI = useMemo(
        ()=><FullDialogBase 
            isCloseButton={true} 
            isScaleAnim={true} 
            isCenter={true} 
            id="viewGrade"  
        items={ 
            <ViewGradingSystem dialogState={viewGradeDialog} onUpdate={(name)=>{
                setSelectedGradingSystemName(name);
                setViewGradeDialog(false);
            }} gradeItems={selectedGradingSystem} /> 
        } 
        onClose={ ()=>{ setViewGradeDialog(false); } }
        dialogState={viewGradeDialog}
        
        />, [viewGradeDialog]
    )


    const addTemplateUI = useMemo(
        ()=><FullDialogBase isCloseButton={true}  isScaleAnim={true} isCenter={true} id="templateMenu"  items={
            <AddTemplate dialogState={templateDialog} onAdd={(name)=>{
                    setSelectedTemplateName(name);
                    setTemplateDialog(false);
                }} />
            } 
            onClose={ ()=>{ setTemplateDialog(false); } }
            dialogState={templateDialog}
        />, [templateDialog]
    )

    const viewTemplateUI = useMemo(
        ()=><FullDialogBase isCloseButton={true} isScaleAnim={true} isCenter={true} id="viewTemplate"  items={
            <ViewTemplate dialogState={viewTemplateDialog} onUpdate={(name)=>{
                    setSelectedTemplateName(name);
                    setViewTemplateDialog(false);
                }} templateItems={selectedTemplate} />
            } 
            onClose={ ()=>{ setViewTemplateDialog(false); } }
            dialogState={viewTemplateDialog}
        />, [viewTemplateDialog]
    )


    const darkModeUI = useMemo(
        ()=>
            
            <Tippy  theme='tomato' delay={50} content="Switch between light and dark theme" placement='bottom'>
        
        <div className="col-md-4">
        <div onClick={
            ()=>{

                settings.darkMode =  !darkState ;
                setDarkState( settings.darkMode );
                onTheme(  settings.darkMode  )
            }

        } className={`${style.settingItem}`}>
            <div className="d-flex align-items-center">
            <FaMoon size={20} color="var(--black-text)" style={{marginRight:"10px"}} />
            <label style={{cursor:"pointer", whiteSpace:"nowrap"}}>Dark Mode </label>
            </div>


            <Switch state={darkState} onCheck={ 
                ( state )=>{ 
                    settings.darkMode = state;
                    setDarkState( settings.darkMode );
                    onTheme( settings.darkMode )
                } 
            } />


            </div>
        </div>
        </Tippy>
    )



    
    const menuUI = useMemo(
        ()=>
            
            <Tippy  theme='tomato' delay={50} content="Enable or disable auto-expandable menu" placement='bottom'>
        
        <div className="col-md-4">
        <div onClick={
            ()=>{

                settings.menuExpandable =  !menuExpandable ;
                setMenuExpandable( settings.menuExpandable );
            }

        } className={`${style.settingItem}`}>
            <div className="d-flex align-items-center">
            <FaBarsStaggered size={20} color="var(--black-text)" style={{marginRight:"10px"}} />
            <label style={{cursor:"pointer", }}>Auto-Expandable Menu</label>
            </div>


            <Switch state={menuExpandable} onCheck={ 
                ( state )=>{ 
                    settings.menuExpandable = state;
                    setMenuExpandable( settings.menuExpandable );
                } 
            } />


            </div>
        </div>
        </Tippy>
    )




    const hapticUI = useMemo(
        ()=>
        
        <Tippy  theme='tomato' delay={50} content="Beep audio feedback" placement='bottom'>
        
        <div className="col-md-4">
        <div onClick={
            ()=>{
                settings.haptic = !hapticState;
                setHapticState( !hapticState );
                writeSettings()
            }
        } className={`${style.settingItem}`}>
            <div className="d-flex align-items-center">
            <FaVolumeUp size={20} color="var(--black-text)" style={{marginRight:"10px"}} />
            <label style={{cursor:"pointer", whiteSpace:"nowrap"}}>Audio Feedback</label>
            </div>

            <Switch state={hapticState} onCheck={ 
                ( state )=>{ 
                    setHapticState( state );
                    settings.haptic = state;
                    writeSettings()
                } 
            } />
            </div>
        </div>

        </Tippy>
    )



    const talkbackUI = useMemo(
        ()=>
        
        <Tippy  theme='tomato' delay={50} content="Read out an automatically entered score" placement='bottom'>
            
        <div className="col-md-4">
        <div onClick={
            ()=>{
                settings.talkback = !talkbackState;
                setTalkbackState( !talkbackState );
                writeSettings()
            }
        } className={`${style.settingItem}`}>
            <div className="d-flex align-items-center">
            <FaMicrophone size={20} color="var(--black-text)" style={{marginRight:"10px"}} />
            <label style={{cursor:"pointer", whiteSpace:"nowrap"}}>TalkBack</label>
            </div>

            <Switch state={talkbackState} onCheck={ 
                ( state )=>{ 
                    setTalkbackState( state );
                    settings.talkback = state;
                    writeSettings()
                } 
            } />

            </div>
        </div>
        </Tippy>
    )


    const voicesUI = useMemo(
        ()=>
        <Tippy  theme='tomato' delay={50} content="Select TalkBack voice" placement='bottom'>
        <div className="col-md-3">
        <div onClick={
            ()=>{

                getVoices();

            }
        } className={`${style.settingItem}`}>
            <div className="d-flex align-items-center">
            <FaFaceLaugh size={20} color="var(--black-text)" style={{marginRight:"10px"}} />
            <label style={{cursor:"pointer", }}>TalkBack Voice</label>
            </div>

            
            </div>
            
        </div>
        </Tippy>
    )



    const appSecurityUI = useMemo(
        ()=>
        <Tippy  theme='tomato' delay={50} content="Set or disable application's access code" placement='bottom'>
        
        <div className="col-md-5">
        <div onClick={
            ()=>{
                if( settings.secure != ""){
                    setConfirmLoginDialog(true); 
                }else{
                    setSignupDialog(true); 
                }
            }
        } className={`${style.settingItem}`}>
            <div className="d-flex align-items-center">
                {(PIN!="")?
                <FaLock size={20} color="var(--black-text)" style={{marginRight:"8px"}} />
                :
                <FaUnlock size={20} color="var(--black-text)"  style={{marginRight:"8px"}} />}

                <label style={{cursor:"pointer", }}>Application Security</label>

            </div>
            
            <GButton 
            isFilled={true}
            title='Configure'
            onClick={
                ()=>{

                    if( settings.secure != ""){
                        setConfirmLoginDialog(true); 
                    }else{
                        setSignupDialog(true); 
                    }
        
                }
            }
            icon={<FaGear/>}
            
            />

        </div>
        </div>
        </Tippy>
    )


    return(

        <div  className={` p-3 pt-0 pb-0 ${style.settingPane}`}>


            {signupUI}

            {confirmLoginUI}

            {addGradingUI}

            {viewGradingUI}


            {addTemplateUI}

            {viewTemplateUI}

            {voicesDialogUI}
            


        <div  className="row mt-1 gy-3 gx-3">
            {darkModeUI}
            {hapticUI}
            {talkbackUI}
            
        </div>

        <div className="row mt-1 gy-3 gx-3">
            {voicesUI}
            {menuUI}
            {appSecurityUI}
        </div>
    {/* END OF ROW 1 */}



    <div className={` col-12`} style={{marginTop:"38px", marginBottom:"28px"}}>
        <HLine/>
    </div>


    {/* RESULT TEMPLATE */}
    <div className={` col-12`}>
        <div className="d-flex align-items-center justify-content-between">

            <div  className="d-flex align-items-center" >
                <FaFileLines size={20} color="var(--brand-color)" className="m-1"/>
                <label className={style.heading}>Result Templates </label>
            </div>

            <Tippy  theme='tomato' delay={50} content="Add Template" placement='bottom'>
                <div>
                    <FaCirclePlus size={30} className={style.addIcon} onClick={()=>{
                        setTemplateDialog( !templateDialog );
                    }}  />
                </div>
            </Tippy>

        </div>


        <Templates selected={selectedTemplateName} onSelect={ 
            ( selected )=>{
                setSelectedTemplateName(selected.name);
                setSelectedTemplate(selected);
                settings.selectedTemplateName = selected.name;

                writeSettings();
                setViewTemplateDialog(true);
            }
        } />


    </div>


    <div className={` col-12`} style={{marginTop:"28px", marginBottom:"28px"}}>
        <HLine/>
    </div>


    {/* GRADING SYSTEM */}
    <div className={` col-12 mt-4 mb-3`}>

        <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center" >
                <FaChartColumn  size={20} color="var(--brand-color)" className="m-1"/>
                <label className={style.heading}>Grading Systems</label>
            </div>



            <Tippy  theme='tomato' delay={50} content="Add Grading System" placement='bottom'>
                <div>
                    <FaCirclePlus size={30} className={style.addIcon} onClick={()=>{
                        setGradeDialog( !gradeDialog );
                    }}/>
                </div>
            </Tippy>


        </div>


        <GradingSystem  
            selected={selectedGradingSystemName} 
            onSelect={ 
                ( selected )=>{
                    setSelectedGradingSystem(selected);
                    setSelectedGradingSystemName(selected.name);
                    settings.selectedGradingSystemName = selected.name;
                    writeSettings();
                    setViewGradeDialog(true);
                }
            }
            onDelete={(selectedName)=>{
                setSelectedGradingSystemName(selectedName);
            }}
        />

    </div>
  
    </div>

)
};

export default Settings;
