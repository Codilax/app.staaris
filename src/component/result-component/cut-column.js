import { useState } from 'react';
import Button from '../button/button';
import style from './clear-results.module.css'
import { FaRegSquare, FaSquare, FaSquareCheck} from 'react-icons/fa6'

import HLine from '../num/line';
import { Space } from '../space/space';
import { FaCheckSquare } from 'react-icons/fa';
import constants from '../../constants';



export function CutColumn({pasteInfo, onCutColumn, onClose } ){


    return(

        <div className={`${style.menuItems}`} > 
        <label className='dialogTitle' >Clear Column</label> 

        <HLine />
        

        <div className={`d-flex flex-column ${style.tabBody}`} >

        
            <label className={`${style.label} mb-2`}>
                
            You are trying to cut 
            {(pasteInfo.dataType=="number")? " '" +constants.template[pasteInfo.col]['name'] +"'" : ( constants.toggleName)? " 'Student Name'" : " 'Student ID'"  }.
            Are you sure about this?
                
            </label>
        
         
            <div className='mt-3 d-flex justify-content-end'>

                <Button title="Cut Column" onClick={()=>{
                    onCutColumn(  )
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