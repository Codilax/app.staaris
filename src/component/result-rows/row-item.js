
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import ColItem from './column-item';
import style from './row-item.module.css'
import constants from '../../constants';
import { ContextContent } from '../context-dialog-content/context-content';


const RowItem = forwardRef(( props , rowRef ) => {


    var [rowSelected, setRowSelected] = useState(false);

    var [rowHovered, setRowHovered] = useState(false);
    var [ newVal, setNewVal] = useState(false);
    var [ refresh, setRefresh] = useState("");


    useImperativeHandle( rowRef, () => ({
        refresh(){
            try{
                setRefresh(Math.random());
            }catch(e){}
        },

        })
    )


// function RowItem( {sidRef, onRowsSelected, clearSelection, rowIndex, selectedCol, columnConfig, onForceUpdate, onPaste, onDeleteRow, onAddRow } ){
    
   

    var isSelected = useCallback(
        ()=> constants.selectedRows.includes(props.rowIndex)
    )


    var setHovered = (hover)=>{
        setRowHovered(hover);
    }

    //on value update received from the row
    var onUpdate =  useCallback( ( rowIndex, colIndex ) => {

        if(colIndex != 1){ //do not recompute the result when students name or reg is changed

            //get column keys
            var columnKeys = [];
            constants.template.forEach(
                (objects)=>{ columnKeys.push(objects.key) }
            )

            //loop keys except serial, reg, name, ca, exam, total, grade, remark
            var exceptionList = ["serial", "reg", "name", "ca", "exam", "total", "grade", "remark"];

            var ca = 0;
            columnKeys.forEach( key => {
                if( !exceptionList.includes(key) ){
                    var v = cellCleaner( constants.resultObject[rowIndex][key] )
                    ca += ( v )
                }
            });

            constants.resultObject[rowIndex]['ca'] = Math.round((ca + Number.EPSILON) * 100) / 100;

            //check if the student wrote exams before updating the total
            var examScore = getExams(rowIndex);
            
            if( examScore == -1 ){
                constants.resultObject[rowIndex]['total'] = "";
                constants.resultObject[rowIndex]['grade'] = "";
                constants.resultObject[rowIndex]['remark'] = constants.incompleteResult;
            }else{
                var total = ca + examScore;
                constants.resultObject[rowIndex]['total'] = parseInt(total+""); //convert to whole number
                
                var grade = getGrade(total);
                var remark = (grade=="***")? "Invalid" : getRemark(total);

                constants.resultObject[rowIndex]['grade'] = grade;
                constants.resultObject[rowIndex]['remark'] = remark;
            }
        }
        //toggle state variable to update current row
        setNewVal( !newVal );
        props.onForceUpdate("onChange");
    }
    )


    function cellCleaner(value){
        if(value==undefined || value==="") return 0;
        try{
            var clean = parseFloat(value+"");
            if(isNaN(clean)) return 0;
            return clean;
        }catch(e){ return 0 }
    }


    function getExams(rowIndex){
        var value = constants.resultObject[rowIndex]['exam'];
        if(value==undefined || value==="") return -1; //representing no valid exam exam
        try{
            var clean = parseFloat(value+"");
            if(isNaN(clean)) return -1;
            return clean;
        }catch(e){ return -1 }
    }


    function getGrade( totalScore ){
        var grade = "***";
        for (var index=0; index<constants.gradingSystem.gradingSystem.length; index++) {
            var gradingObject = constants.gradingSystem.gradingSystem[index];     
            if( totalScore >= cleanGradeData(gradingObject.min) && totalScore <= cleanGradeData(gradingObject.max) ){
                grade = gradingObject.grade;
                return grade;
            }
        }
        return grade;
    }


    function getRemark(total){
        var remark = (total >= constants.gradingSystem.passMark && total<=constants.totalUpperBoundary )? constants.pass : constants.fail;
        return remark;
    }
    

    function cleanGradeData( val ){
        if(val=="" || val==undefined || val==null ){
            return "";
        }else{
            try{
                return parseFloat( (val+"") );
            }catch(e){
                return "";
            }
        }
    }

    const colItem = useMemo(

        ()=>{

            return props.columnConfig.map(
                
                (item, colIndex )=>{

                    if(item.key != "name" && item.key !="remark")

                    return <ColItem 
                    
                    key={colIndex}
                    sidRef={props.sidRef}
                    
                    
                    onPaste={(event, rowIndex, colIndex, dataType)=>{
                        props.onPaste(event, rowIndex, colIndex, dataType)
                    }}

                    selectedCol={props.selectedCol}
                    onHovered={ (hover)=>{ setHovered(hover) } }

                    onRowChange={( rowIndex, colIndex, newValue )=>{
                        onUpdate( rowIndex, colIndex )
                    }} 

                    rowSelected = {rowSelected}
                    onRowSelected={ ()=>{  setRowSelected(!rowSelected);  props.onRowsSelected(); } } 
                    
                    rowIndex={props.rowIndex} 
                    // rowSelected={props.rowSelected} 
                    colIndex={colIndex} 
                    colLength={props.columnConfig.length} 
                    columnConfig={item} 

                />;
            }
        )
            
        },
    )


    
    return(

        <li
            className={`${style.rowItem}  ${( isSelected()?style.selected: "" )}  ${(constants.currentFoundStudentIndex==props.rowIndex)? style.searched:""} `}

            
            onMouseLeave={ ()=>{ 
                setHovered(false) 
            } }
    
            >
            

            {    (rowHovered=="serial")?
                    <div className={style.contextMenu}> 
                        <ContextContent 
                            onAddRow={(x)=>props.onAddRow(x)}
                            onDeleteRow={()=>props.onDeleteRow()}
                        />
                    </div> : <></>
            }
            
            { colItem  }

        </li>

    ) //end of return

}

)

RowItem.displayName = "rowItem";
export default RowItem;

// export default RowItem;