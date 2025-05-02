
import constants from '../../constants';
import GradeCell from './cells/grade-cell';
import InputCell from './cells/input-cell';
import LabelCell from './cells/label-cell';
import SerialCell from './cells/serial-cell';
import SIDCell from './cells/sid-cell';

import React, { useMemo } from 'react';

function ColItem( { sidRef, rowIndex, rowSelected,  colIndex, colLength, columnConfig, onRowSelected, onHovered, onRowChange, onPaste } ){

    
    const cWidth = useMemo( () => getWidth(columnConfig.key) , [columnConfig.key]);

    function getWidth(key){

        var others = 41/(colLength-8);
        
        switch(key){

            //NOTE: name and remark was removed from the UI

            case "serial": return "4%";
            case "reg": return "23%";
            
            case "ca": return "8%";
            case "exam": return "8%";
            case "total": return "8%";
            case "grade": return "8%";

            default: return (others + "%");
        }
    }

    

    //update result object
    function updateResult(rowIndex, colIndex, newValue){
        //get column key for the column index
        var columnKey = constants.template[colIndex]['key'];
        constants.resultObject[rowIndex][columnKey] = newValue;
        onRowChange(rowIndex, colIndex, newValue);
    }


    //update student details: reg, name
    function updateSID(rowIndex, colIndex, newValue){
        if(constants.toggleName){
            constants.resultObject[rowIndex]['name'] = newValue;
            onRowChange(rowIndex, colIndex, newValue);
        }else{
            constants.resultObject[rowIndex]['reg'] = newValue;
            onRowChange(rowIndex, colIndex, newValue);
        }
    }


    //get a perticular value of row | usen in the html
    function getCellValue( columnKey ){
        return constants.resultObject[rowIndex][columnKey]
    }


    //get a perticular value of row | usen in the html
    function getCellValueFromIndex( rowIndex, colIndex ){
        var columnKey = constants.template[colIndex]['key'];
        return constants.resultObject[rowIndex][columnKey];
    }


    return(


            (columnConfig.key == "serial")?
            <SerialCell 
                onHovered={ (hover)=>onHovered(hover) } 

                onRowSelected={  ()=>{ onRowSelected();  } }  

                rowSelected = {rowSelected}
                rowIndex={rowIndex} 
                colIndex={colIndex} 
                width={ cWidth } 
            />

            :

            (columnConfig.key == "reg")?
            <SIDCell 
                ref={sidRef}
                onPaste={(event, dataType)=>{onPaste(event, rowIndex, colIndex, dataType)}}
                onChanged={(rowIndex, colIndex, newValue)=>{ updateSID(rowIndex, colIndex, newValue) }} 
                rowIndex={rowIndex} 
                colIndex={colIndex} 
                width={ cWidth } 
                columnConfig={columnConfig} />
            :

            (columnConfig.key == "grade")?
            <GradeCell  
                grade={ getCellValue( 'grade' ) } 
                remark={ getCellValue("remark") } 
                rowIndex={rowIndex} 
                colIndex={colIndex} 
                width={ cWidth }  
            />

            :

            (columnConfig.key == "ca" || columnConfig.key=="total")?
            <LabelCell 
                rowIndex={rowIndex} 
                colIndex={colIndex} 
                width={ cWidth } 
                columnConfig={columnConfig} 
            />

            :

            <InputCell 
                onChanged={(rowIndex, colIndex, newValue)=>{ updateResult(rowIndex, colIndex, newValue) }} 
                defaultVal={ getCellValueFromIndex(rowIndex, colIndex)}   
                rowIndex={rowIndex} 
                colIndex={colIndex} 
                width={ cWidth } 
                columnConfig={columnConfig} 
                onPaste={(event,dataType)=>{onPaste(event, rowIndex, colIndex, dataType)}}
            />
           
    )

}

export default ColItem;