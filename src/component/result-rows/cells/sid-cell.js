import style from './sidcell.module.css'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import 'tippy.js/dist/svg-arrow.css';
import constants from '../../../constants';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';


const SIDCell = forwardRef(( props , sidRef ) => {

    const [refresh, setRefresh] = useState("");

     useImperativeHandle( sidRef, () => ({
    
            refresh(){
              try{
                setRefresh(Math.random())
              }catch(e){}
            }

        }
    ))


// function SIDCell( {onChanged, rowIndex, colIndex, width, columnConfig, onPaste } ){

    const [reg, setReg] = useState( constants.resultObject[props.rowIndex]['reg'] );
    
    //get a perticular value of row | usen in the html
    function getRegValue( rowIndex){
        var v = constants.resultObject[rowIndex]['reg'];
        return v.trim();
    }

    function getNameValue( rowIndex ){
        var v = constants.resultObject[rowIndex]['name'];
        return v.trim();
    }

    function getTipValue(rowIndex){
        if( constants.toggleName ){
            var v = getRegValue(rowIndex);
            return (v=="")? "***" : v ;
        }else{
            var v = getNameValue(rowIndex);
            return  (v=="")? "***" : v ;
        }
    }


    const input = useMemo(
        ()=>{
            return (constants.toggleName)? <input autoComplete='off'
            
            id={ ("name"+props.rowIndex+""+props.colIndex) }         
            
            style={{ ["width" ]: props.width }}
            className={`${style.cell} ${ props.colIndex==0? style.colBorder0 : style.colBorderx }`}
            min={0}
            max={props.columnConfig.max}
            defaultValue={ getNameValue(props.rowIndex) }
            
            type='text'

            onClick={(event)=>{
                // if( (event.ctrlKey || event.metaKey) ){
                //     if(constants.selectedRows.includes(props.rowIndex)){
                //         constants.selectedRows.splice(constants.selectedRows.indexOf(props.rowIndex), 1)
                //     }else{ constants.selectedRows.push(props.rowIndex) }
                // }else{
                //     constants.selectedRows.splice(0);
                // }
                
                constants.currentRow = props.rowIndex;
                constants.currentCol = props.colIndex;
            }}

            onChange={ 
                (event)=>{ 
                    props.onChanged(props.rowIndex, props.colIndex, event.target.value) 
                } 
            }

            onContextMenu={
                (event)=>props.onPaste(event,"id")
            }
        />
        
        :

        <div style={{ ["width" ]: props.width }} className={style.regContainer} > 

            <div className={style.regLength}> <div>{ reg.length }</div> </div>
            
            <input autoComplete='off' id={ ("reg"+props.rowIndex+""+props.colIndex) }         
            
            style={{ ["width" ]: "100%" }}

            className={`${style.cell} ${ props.colIndex==0? style.colBorder0 : style.colBorderx }`}
            min={0}
            max={props.columnConfig.max}
            defaultValue={ getRegValue(props.rowIndex) }
            
            type='text'

            onClick={(event)=>{
                // if( (event.ctrlKey || event.metaKey) ){
                //     if(constants.selectedRows.includes(props.rowIndex)){
                //         constants.selectedRows.splice(constants.selectedRows.indexOf(props.rowIndex), 1)
                //     }else{ constants.selectedRows.push(props.rowIndex) }
                // }else{
                //     constants.selectedRows.splice(0);
                // }

                constants.currentRow = props.rowIndex;
                constants.currentCol = props.colIndex;
            }}

            onChange={ 
                (event)=>{ 
                    setReg(event.target.value);
                    props.onChanged(props.rowIndex, props.colIndex, event.target.value) 
                } 
            }

            onContextMenu={
                (event)=>props.onPaste(event,"id")
            }

            
            />

        </div>
        

        }, [refresh, reg]
    )



    return(

        <Tippy theme='tomato' delay={150} content={  getTipValue( props.rowIndex ) } placement='bottom'>
            {
                input
            }
        </Tippy>

    )

}
)

SIDCell.displayName = "sidcell";
export default SIDCell;

// export default SIDCell;