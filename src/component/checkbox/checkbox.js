
import { FaSquare, FaSquareCheck }  from 'react-icons/fa6'
import React from 'react';
import style from './checkbox.module.css'
import constants from '../../constants';

function CheckBox({ state, rowIndex, onCheck }){

    var isSelected = ()=>{
        return constants.selectedRows.includes(rowIndex);
    }

    return(
         <div className={style.box} onClick={ 
            ()=>{ 
                    var newState = !state;
                    onCheck( newState );
                } 
            } 
            >
                

            {(state==true || isSelected() )?
                <FaSquareCheck size={15} color="var(--brand-color-dark)"/>
                  :
                <FaSquare size={15} color="var(--brand-color-dark)"/>
            }
            
        </div>
    )
};

export default CheckBox;