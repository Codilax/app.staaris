import style from './steps.module.css';
import Button from '../button/button';
import { open } from '@tauri-apps/plugin-shell';
import constants from '@/constants';

import { Input } from '../text-boxes/input';
import ActivateButton from '../button/activate-button';
import GButton from '../button/generic-button';
import { FaLock, FaLockOpen, FaUserLock } from 'react-icons/fa';


export default function Step1({ onNext }){


    async function purchase(){
        await open(constants.activationPage );
        onNext();
    }


    return(
        <div className={style.stepPane}>
            <label className={style.stepLabel}>STEP 1</label>
            
            <label>Enter your valid email address</label>
            <Input onChange={()=>{}} onEnter={()=>{}} placeholder="Enter Email Address" />

            <label style={{marginTop:"10px", fontSize:"13px"}}>Note: The Staaris license key will be sent to your mail.</label>
            <label style={{marginBottom:"15px", fontSize:"13px"}}>Click the button below to purchase Staaris application license.</label>


            <div>

            <GButton icon={<FaLock/>} title="Purchase Activation Key" onClick={()=>purchase()} isFilled={true} />
    
            {/* <ActivateButton title="Purchase Activation Key" onClick={()=>purchase()}/> */}
            
            </div>
        </div>
    )
}