import Tippy from '@tippyjs/react';
import style from './context-content.module.css'
import { FaPlusCircle, FaTrashAlt } from 'react-icons/fa';
import { PiListPlusBold } from "react-icons/pi";

export function ContextContent( {onAddRow, onDeleteRow} ){
    return(
        <div className={`${style.items}`} > 

            <Tippy  theme='tomato' delay={150} content="Insert a row" placement='bottom'>
                <div className={style.control} onClick={()=>onAddRow(1)}> <FaPlusCircle /> </div>
            </Tippy>

            <Tippy  theme='tomato' delay={150} content="Insert custom rows" placement='bottom'>
                <div className={style.control} onClick={()=>onAddRow(2)}> <PiListPlusBold /> </div>
            </Tippy>

            <Tippy  theme='tomato' delay={150} content="Delete row" placement='bottom'>
                <div className={style.control} onClick={()=>onDeleteRow()}> <FaTrashAlt /> </div>
            </Tippy>

        </div>
    )
}