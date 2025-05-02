import { useMemo, useState } from 'react';
import constants from '../../../constants';
import style from './inputcell.module.css'

function InputCell( { rowIndex, colIndex, width, defaultVal, columnConfig, onChanged, onPaste } ){
    
    function updateResult(newValue){
        onChanged( rowIndex, colIndex, newValue );
    }


    function checkValidity( rowIndex ){
        var columnKey = constants.template[colIndex]['key'];
        var val = constants.resultObject[rowIndex][columnKey];
        if(val=="" || (val+"").startsWith("e") || val==undefined || val==null ){
            return "empty";
        }else{
            var v = parseFloat( val+"" );
            if(v>=0 && v<=columnConfig.max){
                return "yes";
            }else{ return "no" }
        }
    }


    const inputC = useMemo(()=>{
        return <input id={rowIndex+""+colIndex}
            
        style={{ ["width" ]: width }}
        
        className={`${style.cell}  ${ colIndex==0? style.colBorder0 : style.colBorderx }  ${ (constants.selectedColumn==colIndex && constants.currentFoundStudentIndex==rowIndex)?style.searched:"" }  ${( checkValidity( rowIndex )=='no' )? style.invalid : "" } `}
        min={0}
        max={columnConfig.max}
        defaultValue={ defaultVal }
        type={ (columnConfig.dataType==constants.numberColumn)? "number":"text" }

        onClick={(event)=>{

            // if( (event.ctrlKey || event.metaKey) ){
            //     if(constants.selectedRows.includes(rowIndex)){
            //         constants.selectedRows.splice(constants.selectedRows.indexOf(rowIndex), 1)
            //     }else{ constants.selectedRows.push(rowIndex) }
            // }else{
            //     constants.selectedRows.splice(0);
            // }

            constants.currentRow = rowIndex;
            constants.currentCol = colIndex;
        }}

        onChange={ (event)=>{ 
            updateResult(event.target.value)
        } }


        onContextMenu={
            (event)=>onPaste(event,"number")
        }


    />
    })

    return(

        inputC
    )

}

export default InputCell;