import React, { useState } from 'react';
import style from './activate.module.css';
import StepIndicators from './steps-indicator';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';

function Activate( { onClose } ){


    const [ step, setStep ] = useState( 1 );

    // const [refresh, setRefresh] = useState();
    
    // const [ alertState, setAlertState] = useState( false );
    // const [ title, setTitle] = useState( "" );
    // const [ body, setBody] = useState( "" );


    // function alertStaaris(title,body){
    //     setTitle(title);
    //     setBody(body);
    //     setAlertState(true)
    // }


    return(

        <div className={`${style.pane} `}>

            <div style={{padding:"0 10px"}} className='d-flex align-items-center'>
                <label className='dialogTitle'>Staaris Activation</label>
            </div>

            <StepIndicators steps={3} current={step} gotoStep={(i)=>{ setStep(i); } } />

            {
                step == 1?

                <Step1 onNext={()=>setStep(2)} />

                :

                step == 2? 
                
                <Step2 onNext={()=>setStep(3)} />

                :

                <Step3 onNext={()=>{
                    onClose(); 
                    setTimeout(
                        ()=>setStep(1), 1000
                    )
                }} 
                
                onBack={()=>{ setStep(2) }}
                
                />

            }
            

        </div>
    )

}
export default Activate;