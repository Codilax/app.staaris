import Tippy from '@tippyjs/react';
import constants from '../../../constants';
import Indicator from '../../grade-indicator/indicator';
import style from './gradecell.module.css'
import { useMemo } from 'react';

function GradeCell( { rowIndex, colIndex, width, grade, remark } ){

    const gradeC = useMemo(
        ()=>{
            return <Tippy theme='tomato' delay={150} content={ (remark=="IR")? "Incomplete": (remark==="")?"***" : remark }  placement='bottom'>
        
            <div id={rowIndex+""+colIndex}
    
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
    
    
            style={{ ["width" ]: width }}  className={`${style.cell} ${ colIndex==0? style.colBorder0 : style.colBorderx }`}>
    
                {
                    (remark=="IR")?
                    <label className={style.incomplete}> {remark} </label>
                    :
                    <label> {grade} </label>

                }
           
            <Indicator remark={remark} />
    
            </div>
    
            </Tippy>
        }
    )
    
    return(
        gradeC
    )

}

export default GradeCell;