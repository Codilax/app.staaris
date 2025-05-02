import { useState } from 'react';
import Button from '../button/button';
import style from './clear-results.module.css'
import { FaRegSquare, FaSquare, FaSquareCheck} from 'react-icons/fa6'

import HLine from '../num/line';
import { Space } from '../space/space';
import constants from '../../constants';


export function ClearSelectedResults({ onFireUpdate, onClose } ){

    const [ isSNum, setisSNum] = useState( false );
    const [ isSName, setisSName] = useState( false );

    function onClear(){

        var excemption = ["serial"];
        if(!isSNum){ excemption.push("reg") }
        if(!isSName){ excemption.push("name") }

        constants.selectedRows.forEach((row)=>{

            try{
                constants.template.forEach(
                    (template)=>{
                        if( !excemption.includes( template.key ) ){
                            if(template.key == "remark"){
                                constants.resultObject[row][template.key] = constants.incompleteResult;
                            }else{
                                constants.resultObject[row][template.key] = "";
                            }                        
                        }
                    }
                )
            }catch(e){}

        })
        
        onFireUpdate("*")
    }



    return(

        <div className={`${style.menuItems}`} > 
        <label className='dialogTitle' >Clear Selection</label>
            

        <HLine />
        

        <div className={`d-flex flex-column ${style.tabBody}`} >

        
            <label className={`${style.label} mb-2`}>You are trying to clear the selected results. Are you sure about this?</label>
        
            <label className={`${style.label} mt-1`}>Do you also want to also clear the following?</label>
        
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
                    onClear()
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