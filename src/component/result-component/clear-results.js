import { useState } from 'react';
import Button from '../button/button';
import style from './clear-results.module.css'
import { FaRegSquare, FaSquareCheck} from 'react-icons/fa6'

import HLine from '../num/line';
import { Space } from '../space/space';
import constants from '../../constants';
import { Loading } from '../loading/loading';


export function ClearResults({ onFireUpdate, onClear, onClose } ){

    const [ isSNum, setisSNum] = useState( false );
    const [ isSName, setisSName] = useState( false );
    
    const [ isLoading, setIsLoading] = useState( false );


    

    function loading(state){
        setIsLoading(state);
    }



    return(

        <div className={`${style.menuItems}`} > 

        {/* <Loading state={isLoading} isCenter={true} /> */}

        <label className='dialogTitle' >Clear Result</label>
            

        <HLine />
        

        <div className={`d-flex flex-column ${style.tabBody}`} >

            <label className={`${style.label} mb-2`}>You are trying to clear this result. Are you sure about this?</label>
        
            <label className={`${style.label} mt-1`}>Do you also want to clear the following?</label>
        
            <div style={{marginTop:"2px"}} className={style.check} onClick={()=>setisSNum(!isSNum)}>
                {(isSNum)? <FaSquareCheck size={16}/> : <FaRegSquare size={16}/>}
                <label>Clear Students&apos; Number</label>
            </div>

            <div style={{marginTop:"1px"}} className={style.check} onClick={()=>setisSName(!isSName)}>
                {(isSName)? <FaSquareCheck size={16}/> : <FaRegSquare size={16}/>}
                <label>Clear Students&apos; Name</label>
            </div>
         
            <div className='mt-3 d-flex justify-content-end'>

                <Button title="Clear Result" onClick={()=>{

                    onClear(isSNum, isSName)

                    // loading(true)
                    // onClose()

                    // setTimeout(async () => {
                    //     var isDone = await onClear();
                    //     if(isDone){
                    //         loading(false)
                    //     }
                    // }, 500);



                }} />

                <Space />
                
                <Button title="Cancel" onClick={()=>{
                    onClose()
                }} />

            </div>

        </div>

        </div>
    )
}