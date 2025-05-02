import { getBattery, getRAM } from "@/utils/sysinfo";
import { useEffect, useMemo, useState } from "react";
import { FaBatteryEmpty, FaBatteryFull, FaBatteryHalf, FaBatteryQuarter, FaBatteryThreeQuarters, FaStar, FaWifi } from "react-icons/fa6";
import style from './statusbar.module.css';
import { FaMemory } from "react-icons/fa";
import Tippy from "@tippyjs/react";
import constants from "@/constants";
import TextButton from "../button/text-button";
import ActivateButton from '../button/activate-button';
import { FullDialogBase } from "../dialog/full-dialog-base";
import Activate from "../activation/activate";
import LicenseKey from '../activation/my-license-key';


export default function StatusBar(){

    const [battery, setBattery] = useState("");
    const [ram, setRAM] = useState("");
    const [time, setTime] = useState("");

    const [activateDialog, setActivateDialog] = useState(false);
    const [licenseDialog, setLicenseDialog] = useState(false);

    
    function getTime(){
        var date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes.toString().padStart(2, '0');
        let mergeTime = hours + ':' + minutes + " " + getAMPM();
        return mergeTime;
    }
    
    
      function getAMPM(){
        var date = new Date();
        let hours = date.getHours();
        let x = hours >= 12 ? 'PM' : 'AM';
        return x;
      }


    useEffect(

        ()=>{

            async function doWork() {

                setBattery( await getBattery() )
                setRAM( await getRAM() )
                setTime( getTime() )
        
                setInterval(async () => {
                    setBattery( await getBattery() )
                    setRAM( await getRAM() )
                    setTime( getTime() )
                }, 5000 )
                
            }


            doWork();
    
            return ()=>{
              clearInterval()
            }

            
        },  []
      )


      const activateDialogUI = useMemo(()=>{
        return <FullDialogBase 
            
            isCenter="true" 
            isScaleAnim={true} 
            isCloseButton={true} 
            id="activate9366485" 

            items={ 
                <Activate onClose={()=>setActivateDialog(false) }  />  
            } 

            onClose={ ()=>{ setActivateDialog(false); } }
            dialogState={ activateDialog }

        />;

      })


      const licenseDialogUI = useMemo(()=>{
        return <FullDialogBase 
            isCenter="true" 
            isScaleAnim={true} 
            isCloseButton={true} 
            id="statuslisence900846" 

            items={ 
                <LicenseKey onClose={ ()=>{ setLicenseDialog(false);setActivateDialog(true); } } /> 
            } 

            onClose={ ()=>{ setLicenseDialog(false); } }
            dialogState={ licenseDialog }
            />;
      })



    return(

        <div className={style.status}>

            {activateDialogUI}

            {licenseDialogUI}

            <Tippy  theme='tomato' delay={150} content="Battery status" placement='bottom'>
                <div  className={` ${ ( battery<=20 )?style.red:"" } ${style.c} `}> 
                    {
                      (battery<10)?<FaBatteryEmpty size="16" /> 
                    : (battery<=25)? <FaBatteryQuarter size="16" /> 
                    : (battery<=50)? <FaBatteryHalf size="16"/> 
                    : (battery<=75)? <FaBatteryThreeQuarters size="16" />
                    : (battery<=100)? <FaBatteryFull size="16" />
                    : <FaBatteryFull size="16" />
                    }
                    <label>{ battery }%</label>
                </div>
            </Tippy>
        

            <Tippy  theme='tomato' delay={150} content="RAM usage" placement='bottom'>
                <div className={`${ ( ram>80 )?style.red:"" } ${style.c}`}> 
                    <FaMemory size="16" />
                    <label>RAM: { ram }%</label>
                </div>
            </Tippy>


            <Tippy  theme='tomato' delay={150} content="System time" placement='bottom'>
                <div className={style.c}> <label> { time } </label>  </div>
            </Tippy>


        <div className={style.c}>
            { constants.activated? 
            <TextButton title={constants.activatedMessage} onClick={ ()=>{ setLicenseDialog(true); } } /> 
            : 
            <ActivateButton title="Activate" onClick={ ()=>{ setActivateDialog(true); } } /> }
        </div>


        </div>
    )
}