import { useState, useEffect } from 'react';
import style from './access-recovery.module.css';
import { FaLockOpen} from 'react-icons/fa6'

import GButton from '../button/generic-button';
import HLine from '../num/line';
import constants from '../../constants';


export function AccessRecovery( { dialogState, id } ){

    const [ recState, setRecState] = useState( "" );
    const [ code, setCode] = useState( "" );
    
    
    useEffect(
        ()=>{
            setCode("");
            document.getElementById(id).value = "";
        },

        [dialogState]
    )

    return(

        <div className={`${style.menuItems}`} > 
           
            <div className='d-flex align-items-center mb-2'>
                <label className='dialogTitle'>Access Code Recovery</label>
            </div>

            <HLine />


            <div className={style.quest}>
                <label style={{fontWeight:"bold"}}>{constants.secureQuestion}</label>
            </div>

            <div className={style.ans}>
                <label>Enter Your Answer:</label>
                <input onMouseMove={(e)=>{e.stopPropagation()}} id={id} className={style.input} />
            </div>            


            <div className={style.recbutton}>

                <GButton  onClick={()=>{

                    setRecState("");
                    setCode("");

                    var answer = document.getElementById(id).value;

                    if( answer.trim().toLowerCase() == constants.secureAnswer.toLowerCase() ){
                        setCode(constants.secure);
                    }else{
                        setRecState("Incorrect security answer. Please try again.");
                    }
                    
                 }} title='Recover' isFilled={true} icon={<FaLockOpen/>} />


            </div>


            <div className={style.ans}>
                <label>Your Access Code:</label>
                <label className={style.access} > {code} </label>
            </div>

            {
                (recState!="")? <label className={style.rstate}> {recState} </label> : <></>
            }


        </div>

     
    )
}