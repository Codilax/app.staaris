import { useState } from "react";
import constants from "../../constants";
import HeaderRowItem from "../result-rows/header-row-item";

export function ResultHeader({ template, selectedCol, onColumnSelected, onToggleName, onCloseResult, onPaste, presentationMode }){
    
    const [toggle, setToggle] = useState(constants.toggleName);
    const [col, setCol] = useState(constants.selectedColumn);
    
    return(
        
        <HeaderRowItem

            presentationMode={presentationMode}
            
            onCloseResult={()=>onCloseResult()}

            onPaste={(event, col, dataType)=>{
                onPaste(event, col, dataType)
            }}


            onToggleName={
                ()=>{
                    constants.toggleName = !constants.toggleName;
                    setToggle( constants.toggleName );
                    onToggleName(constants.toggleName);
                }
            } 
            
            toggleValue={ toggle } 
            selectedCol={ constants.selectedColumn } 
            
            onColumnSelected={
                (colIndex, colKey )=>{
                    constants.selectedColumn = colIndex;
                    setCol(constants.selectedColumn);
                }
            } 
            
            rowIndex={-1} 
            columnConfig={template} 
        />
    )
}