import style from './labelcell.module.css'
import constants from '../../../constants';
import { useMemo } from 'react';

function LabelCell( { rowIndex, colIndex, width } ){
    
    //get a perticular value of row | usen in the html
    function getCellValue( rowIndex, colIndex ){
        var columnKey = constants.template[colIndex]['key'];
        return constants.resultObject[rowIndex][columnKey];
    }

    const labelC = useMemo(()=>{
        return <label id={rowIndex+""+colIndex}

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

        
        style={{ ["width" ]: width }} className={`${style.cell}  ${ colIndex==0? style.colBorder0 : style.colBorderx } `}
        > { getCellValue( rowIndex, colIndex ) } </label>
    })
    
    return(

        labelC
    )
}
export default LabelCell;