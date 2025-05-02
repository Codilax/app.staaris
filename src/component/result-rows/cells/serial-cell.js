
import style from './serialcell.module.css'
import constants from '../../../constants';
import { useCallback, useMemo, useState } from 'react';
import { FaSquare, FaSquareCheck } from 'react-icons/fa6';

function SerialCell( { rowIndex, colIndex, width, onRowSelected, onHovered } ){

    // const [touched, setTouch] = useState(constants.selectedRows.includes(rowIndex));
    const [refresh, setRefresh] = useState("");

    var isChecked = useCallback(
        ()=>constants.selectedRows.includes(rowIndex)
    )

    function onRefresh(){
        setRefresh(Math.random())
    }


    const serialC = useMemo(()=>{

        return <div       
        
        onMouseEnter={()=>onHovered("serial")}
        
        style={{ ["width" ]: width,  }} className={`${style.cell} ${ colIndex==0? style.colBorder0 : style.colBorderx } ${isChecked()?style.checked:""} ${(constants.duplicateStudents.includes(rowIndex))?style.duplicate:""} `}>

            <label style={{position:'absolute'}}> {rowIndex+1} </label>

            <div style={{position:'absolute'}} onClick={ 
            (event)=>{
                    
                    if(constants.selectedRows.includes(rowIndex)){
                        constants.selectedRows.splice( constants.selectedRows.indexOf(rowIndex), 1 )
                    }else{
                        constants.selectedRows.push(rowIndex);
                    }

                    onRowSelected();
                    
                } 
            } 
            >
                
            {( isChecked() )?
                <FaSquareCheck size={15} color="var(--brand-color-dark)"/>
                :
                <FaSquare size={15} color="var(--brand-color-dark)"/>
                
            }
            
        </div>

        </div>
        
    })

    return(

        serialC
    )
}

export default SerialCell;