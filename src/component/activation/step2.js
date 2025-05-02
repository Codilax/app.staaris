import style from './steps.module.css';
import Button from '../button/button';
import { open } from '@tauri-apps/plugin-shell';
import constants from '@/constants';
import { Input } from '../text-boxes/input';
import GButton from '../button/generic-button';
import { FaLock, FaLockOpen } from 'react-icons/fa';


export default function Step2({ onNext }){


    async function activate(){
        // await open(constants.activationPage );
        onNext();
    }


    return(
        <div className={style.stepPane}>
            <label className={style.stepLabel}>STEP 2</label>
            <label>Supply the Staaris application license key.</label>
            <Input onChange={()=>{}} onEnter={()=>{}} placeholder="Enter License Key" />

            <div style={{marginTop:"15px"}}>
            <GButton icon={<FaLock/>} title="Activate" onClick={()=>activate()} isFilled={true} />
            </div>
            

        </div>
    )
}