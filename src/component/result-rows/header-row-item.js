import HeaderItem from './header-item';
import style from './header-row-item.module.css'
import constants from '../../constants';
import { FaXmark } from 'react-icons/fa6';
import Tippy from '@tippyjs/react';

function HeaderRowItem( { rowIndex, selectedCol, onColumnSelected, toggleValue, onToggleName, columnConfig, onCloseResult, onPaste, presentationMode } ){

    
    var onSelect = (colIndex, columnKey, isCtrl )=>{
        //loop keys except serial, reg, name, ca, exam, total, grade, remark
        var exceptionList = ["serial", "reg", "name", "ca", "total", "grade", "remark"];
        
        if(  !exceptionList.includes(columnKey) ){
            onColumnSelected(colIndex, columnKey, isCtrl )
        }

        if(columnKey=="reg" || columnKey=="name"){
            onToggleName()
        }
    }
    

    


    return(

        <div className={`${style.rowItem} ${presentationMode? style.pMode:""}`}>


            {(!presentationMode)?<Tippy  theme='tomato' delay={150} content="Close Result" placement='bottom'>
                <div onClick={()=>{onCloseResult()}} className={style.closeResult}>
                    <FaXmark />
                </div>
            </Tippy>:<></>}


            {columnConfig.map(
                (item, index)=>{
                    if(item.key != "name" && item.key !="remark")       //remove name and remark column from the UI
                    return <HeaderItem key={index}
                                onPaste={(event, colIndex, dataType)=>onPaste(event, colIndex, dataType)}
                                selectedCol={selectedCol} 
                                toggleValue={toggleValue} 
                                onToggle={()=>onToggleName()} 
                                onSelect={(colIndex )=>onSelect(colIndex, item.key )} 
                                rowIndex={rowIndex} 
                                colIndex={index} 
                                colLength={columnConfig.length} 
                                columnConfig={item} 
                            />
                }
            )}
        </div>
    )

}

export default HeaderRowItem;