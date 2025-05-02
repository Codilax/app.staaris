
import Button from '../button/button';
import style from './confirm-dialog.module.css'
import {FaRegSquare, FaSquareCheck, FaTrash} from 'react-icons/fa6'

import HLine from '../num/line';
import { Space } from '../space/space';
import { useState } from 'react';
import constants from '../../constants';


export function ConfirmNoStudent({title, subTitle, body, negative, positive, onNegative, onPositive} ){

    const [isShow, setIsShow] = useState("");

    return(

        <div className={`${style.menuItems}`} > 
        
        <div className='d-flex flex-column mb-1'>
            <label className='dialogTitle' >{title}</label>
            <label className='subTitle' >{subTitle}</label>
        </div>

        <HLine />

        <div className={`d-flex flex-column ${style.tabBody}`} >

            <label className={`${style.label} mt-1`}>{body}</label>

            <div onClick={ ()=>{ 
                
                constants.doNotShowExistingStudentDialog = !constants.doNotShowExistingStudentDialog;
                setIsShow(Math.random())

             } } className={`${style.isShow} `}>
            { ( constants.doNotShowExistingStudentDialog )? <FaSquareCheck /> : <FaRegSquare />  }
            <label>Do not show this dialog again</label>
            </div>
        
            <div className='mt-3 d-flex justify-content-end'>

                <Button title={positive} onClick={()=>{
                   onPositive();
                }} />

                <Space />

                <Button title={negative} onClick={()=>{
                    onNegative();
                }} />


            </div>

        </div>

        </div>
    )
}