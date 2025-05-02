
import Tippy from '@tippyjs/react';
import constants from '../../constants';
import style from './header-item.module.css'
import { FaCircleDot, FaEllipsisVertical, FaToggleOff, FaToggleOn } from 'react-icons/fa6';

function HeaderItem( {rowIndex, toggleValue, onToggle, colIndex, selectedCol, colLength, columnConfig, onSelect, onPaste } ){


    function getWidth(key){

        var others = 41/(colLength-8);

        switch(key){

            //NOTE: name was removed from the UI

            case "serial": return "4%";
            case "reg": return "23%";
            
            case "ca": return "8%";
            case "exam": return "8%";
            case "total": return "8%";
            case "grade": return "8%";

            default: return (others + "%");
        }
    }

    var exceptions = ["ca", "total", "serial", "grade", "remark"]

    return(

        (columnConfig.key == "reg")?

        <Tippy theme='tomato' delay={150} content={(toggleValue)?  constants.template[2]['name'] : constants.template[1]['name'] }  placement='bottom'>

            <div 

            onContextMenu={(event)=>onPaste(event, colIndex, "sid")}           
            
            style={ { ["width" ]: getWidth( columnConfig.key ), position:"relative" } }

            className={`${style.showMore} ${ selectedCol==colIndex? style.selected:""}   ${style.header3} ${ colIndex==0? style.colBorder0 : style.colBorderx } ${getWidth( columnConfig.key )}`}

            type={ columnConfig.dataType == constants.numberColumn? "snumber":"text" }
            
            value={ columnConfig.key } > 


            { 
                <div onClick={(event)=>{
                    event.stopPropagation();
                    if(!exceptions.includes(columnConfig.key)){
                        onPaste(event, colIndex, "sid")
                    }
                    
                }} className={style.more}> {<FaEllipsisVertical/>} </div>
                
                
            }


            <div style={{display:'flex', alignItems:'center', justifyContent:"center", height:"var(--resultHeaderHeight)"}}>
                <label className={style.headerNameName}>  {(toggleValue)? constants.template[2]['name'] : constants.template[1]['name'] } </label>  
                <div onClick={()=>onToggle()} className={style.toggle}> { (toggleValue)? <FaToggleOn /> : <FaToggleOff /> }  </div>
            </div>
            

            </div>

        </Tippy>
        

        :


        <Tippy theme='tomato' delay={150} content={columnConfig.name} placement='bottom'>

            <div 
            
            onContextMenu={(event)=>{
                if(!exceptions.includes(columnConfig.key)){
                    onPaste(event, colIndex, "number")
                }
            }}
            
            onClick={  (event)=>{
                    onSelect(colIndex )
            }   } 
            
            style={ { ["width" ]: getWidth( columnConfig.key ), position:"relative" } }

            className={`${style.showMore} ${ (selectedCol==colIndex )? style.selected:""}   ${style.header} ${ colIndex==0? style.colBorder0 : style.colBorderx } ${getWidth( columnConfig.key )}`}

            type={ columnConfig.dataType == constants.numberColumn? "snumber":"text" }
            
            value={ columnConfig.key } > 


            { 
                ( !exceptions.includes(columnConfig.key) )?
                
                <div onClick={(event)=>{
                    event.stopPropagation();

                    if(!exceptions.includes(columnConfig.key)){
                        onPaste(event, colIndex, "number")
                    }

                }} className={`${ (selectedCol==colIndex )? style.moreSel: style.more }`}> {<FaEllipsisVertical/>} </div>
                
                :<></>
            }
            

            <label className={style.headerName}>  {columnConfig.name}  </label>   

            { 
                ( columnConfig.key!="serial" && columnConfig.key!="reg" && columnConfig.key!="grade" )?
                
                <div className={style.boundary}> {0 + " - " + columnConfig.max} </div>
                
                :<label></label>
            }

            </div>

        </Tippy>
            
           
    )

}

export default HeaderItem;