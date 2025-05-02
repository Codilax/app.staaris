
import Button from '../button/button';
import style from './rename-dialog.module.css'
import {FaTrash} from 'react-icons/fa6'

import HLine from '../num/line';
import { Space } from '../space/space';
import { useEffect, useState } from 'react';
import { Input } from '../text-boxes/input';


export function RenameDialog({id, title, subTitle, dialogState, oldName, onRename, onCancel } ){

    const [ newName, setNewName] = useState( "" );
    const [ ALERT, setALERT] = useState( "" );

    function doRename() {

        if( newName==="" || oldName.toLowerCase() === newName.toLowerCase() ){
            setALERT("Please enter a new result file name.");
        }else{
            setALERT("");
            onRename(newName);
        }
        
    }

    return(

        <div className={`${style.menuItems}`} > 
        
        <div className='d-flex flex-column'>
            <label className='dialogTitle' >{title}</label>
            <label className='subTitle' onClick={()=>document.getElementById(id).value=oldName}  >{subTitle} </label>
        </div>

        <HLine />

        <div className={`d-flex flex-column ${style.tabBody}`} >

            <label style={{marginBottom:"8px"}} className={`${style.label}`}>Enter New Name</label>

            {
                <Input 

                    id={id}
                    onEnter={()=>doRename()}
                
                    onChange={(value)=>{
                        setNewName(value);
                    }
            
                } className='input' type='text' placeholder="Enter New Name" />
            }

            <label style={{fontSize:"13px", color:"var(--black-text)", fontStyle:"italic", marginTop:"3px"}} > {ALERT} </label>
            
            <div className='mt-3 d-flex justify-content-end'>

                <Button title="Rename" onClick={()=>{

                    doRename();
                    
                }} />


                <Space />
                <Button title="Cancel" onClick={()=>{
                    onCancel();
                }} />

            </div>

        </div>

        </div>
    )
}