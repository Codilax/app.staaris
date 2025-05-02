import style from './steps.module.css';
import { FaArrowAltCircleLeft, FaCheckCircle, FaLock, FaLockOpen, FaRegCheckCircle} from 'react-icons/fa';
import constants from '@/constants';
import GButton from '../button/generic-button';



export default function Step3({ onNext, onBack }){


    async function activate(){
        onNext();
    }


    return(
        <div className={style.stepPane}>
            
            {
                constants.activated?

                <div style={{display:"flex", flexDirection:"column", alignItems:"center", width:"100%"}}>
                <FaLockOpen size="70" style={{color:"var(--black-text)", opacity:"0.3"}} />
                <label style={{marginLeft:"8px"}}>Staaris activation is successful.</label>
                <label style={{marginLeft:"8px", marginBottom:"10px"}}>Press Okay to exit.</label>
                <GButton icon={<FaCheckCircle/>} title="Okay" onClick={()=>activate()} isFilled={true} />
            
                </div>

                :

                <div style={{display:"flex", flexDirection:"column", alignItems:"center", width:"100%"}}>
                <FaLock size="70" style={{color:"var(--black-text)", opacity:"0.3"}} />
                <label style={{marginLeft:"8px"}}>Staaris is not yet activated.</label>
                <label style={{marginLeft:"8px", marginBottom:"10px"}}>Please supply the Staaris license key.</label>
                <GButton icon={<FaArrowAltCircleLeft/>} title="Back" onClick={()=>onBack()} isFilled={true} />
            
                </div>
            
            
            }
        
            

        </div>
    )
}