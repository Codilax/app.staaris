'use client'

import { FaArrowTurnDown, FaBroom, FaCircleXmark, FaFile, FaFileExport, FaTrash, FaXmark } from 'react-icons/fa6';
import style from './page.module.css';

import React, { useMemo, useState } from 'react';
import RowItem from '../../component/result-rows/row-item';

import constants from '../../constants';
import { useRef } from "react";
import Toolbar from '../../component/toolbar/toolbar';
import HBar from '../../component/bar/hbar';
import ResultPane from '../../component/result-pane/result-pane';

import { ResultHeader } from '../../component/result-header/result-header';
import Num2 from '../../component/num/num2';
import Tippy from '@tippyjs/react';
import { InfoDialog } from '../../component/dialog/dialog-contents/infoDialog';
import { FullDialogBase } from '../../component/dialog/full-dialog-base';
import { ResultDashboard } from '../../component/result-component/result-dashboard';
import SelectionControls from '../../component/result-component/selection-controls';

// import electron from 'electron';
import { ConfirmSave } from '../../component/dialog/dialog-contents/confirmSaveDialog';
import GButton from '../../component/button/generic-button';
import { Space } from '../../component/space/space';
import {  ConfirmPaste } from '../../component/dialog/dialog-contents/confirmPasteDialog';
import {  CutColumn } from '../../component/result-component/cut-column';
import { AddToColumn } from '../../component/result-component/add-to-column';
import { ClearSelectedResults } from '../../component/result-component/clear-selected-results';
import { ExportSelectedResult } from '../../component/result-component/export-selected-result';
import { InsertRow } from '../../component/result-component/insert-row';
import { ConfirmNoStudent } from '../../component/settings-components/confirm-no-student';
import HLine from '../../component/num/line';
import { NoData } from '../../component/no-data';
import Button from '../../component/button/button';
import { AIConnect } from '../../component/result-component/ai-connect';
// import QR from 'qrcode';
import { AddRow } from '../../component/result-component/add-row';
import { MapDimension } from '../../component/result-component/map-dimension';
import { OpenResult } from '../../component/result-component/open-result';
import { ExportResult } from '../../component/result-component/export-result';
import NewResult from '../../component/result-component/new-result';
import { deleteFile, sanitizeResultName, write } from '@/utils/files';
import ConfirmDialog from '@/component/settings-components/confirm-dialog';
let synthesis;


function speak(text){
    try{
        if( text!=="" ){

            if(synthesis == undefined || synthesis == null){ synthesis = window.speechSynthesis; }

            var voices = synthesis.getVoices();
            const utterance = new SpeechSynthesisUtterance(text);
            if(constants.talkbackvoiceindex>=0 && constants.talkbackvoiceindex<voices.length){
                utterance.voice = voices[ constants.talkbackvoiceindex ];
            }
            synthesis.speak(utterance);
        }
    }catch(e){}
}


function Result({  }) {

    var [selectedCol, setSelectedCol] = useState(-1);

    const toolbarRef = useRef(null);
    const selectionControlsRef = useRef(null);

    // var [aiDialogState, setAiDialogState] = useState(true);
    
    // var [forceRowUpdate, setForceRowUpdate] = useState("");
    // var [isShowContextMenu, setIsShowContextMenu] = useState(false);


    const [refreshSheet, setRefreshSheet] = useState("");

    const [replaceDialog, setReplaceDialog] = useState(false);

    const [infoDialog, setInfoDialog] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    
    const [oldValue, setOldValue] = useState("");
    const [newValue, setNewValue] = useState("");

    const [pos, setPos] = useState( [0,0] );
    const [isPasteMenu, setIsPasteMenu] = useState(false);
    const [pasteDetails, setPasteDetails] = useState( {"row":0, "col":1,"dataType":""} );
    const [pos2, setPos2] = useState( [0,0] );

    const [insertIndex, setInsertIndex] = useState( -1 );
    const [rowToDelete, setRowToDelete] = useState( -1 );

    const [searchedStudent, setSearchedStudent] = useState("");
    const [searchedScore, setSearchedScore] = useState("");
    const [pMode, setPMode] = useState(false);

    const [connectDialog, setConnectDialog] = useState(false);
    const [ src, setSRC] = useState( "" );
    const [ip, setIP] = useState( "" );
    const [addRowDialog, setAddRowDialog] = useState(false);


    function setIsSaved(value){
        constants.isSaved = value;
        try{
            toolbarRef.current.onSave();
        }catch(e){}
    }


   

    
    function onKeyDown(event){
      
        if( event.keyCode == 116 ) //F5
        {
            event.preventDefault();
            event.stopPropagation();

            if(constants.resultObject.length>0){
                setPresentation( true );
                var root = document.documentElement;
                root.style.setProperty( '--presentationDragMargin', '22px' );
                root.style.setProperty( '--presentationDragHeight', '1px' );
            }
            
        }
        else if( (event.ctrlKey || event.metaKey) && event.keyCode==83 ){ //ctrl+s

            event.preventDefault();
            event.stopPropagation();

            onSaveResult();

        }else if( (event.ctrlKey || event.metaKey) && event.keyCode==79 ){ //ctrl+O

            event.preventDefault();
            event.stopPropagation();

            setOpenDialog(true);
    
        }else if( (event.ctrlKey || event.metaKey) && (event.keyCode==69||event.keyCode==80) ){ //ctrl+E or ctrl+P

            event.preventDefault();
            event.stopPropagation();

            if(constants.resultObject.length>0){
                setExportDialog(true);
            }
    
        }else if( (event.ctrlKey || event.metaKey) && event.keyCode==78 ){ //ctrl+N

            event.preventDefault();
            event.stopPropagation();

            setNewRDialog(true);
    
        }else if( (event.ctrlKey || event.metaKey) && event.keyCode==187 ){ //ctrl++

            event.preventDefault();
            event.stopPropagation();

            if(constants.resultName !=""){
                setAddRowDialog2(true);
            }
    
        }else if( (event.ctrlKey || event.metaKey) && event.keyCode==65 ){ //ctrl+A

                event.preventDefault();
                event.stopPropagation();

                if(constants.resultObject.length>0){

                    constants.selectedRows = [];

                    for(var i=0; i<constants.resultObject.length;i++){
                        constants.selectedRows.push(i);
                    }
    
                    showSelectionControls(true);
                    onRefreshRows();
                }
        
        }else if( ((event.ctrlKey || event.metaKey) && event.keyCode==27) || event.keyCode==27 ){ //esc
        
            event.preventDefault();
            event.stopPropagation();

            if( constants.selectedRows.length > 0 ){                
                clearSelection();
                showSelectionControls(false);
            }
           
            if(constants.duplicateStudents.length>0){
                clearDuplicateResultHighlight();
            }


            setPresentation(false);
            var root = document.documentElement;
            root.style.setProperty( '--presentationDragMargin', '7px' );
            root.style.setProperty( '--presentationDragHeight', '35px' );


            setReplaceDialog(false);
        

        }else if( (event.ctrlKey || event.metaKey || event.shiftKey) && ( event.keyCode==37 || event.keyCode==38 || event.keyCode==39 || event.keyCode==40 ) ){ //ctrl + arrows keys: left, top, right, bottom
            
            event.preventDefault();
            event.stopPropagation();
            
            //current row
            var cRow = constants.currentRow;
            var cCol = constants.currentCol;

            var rowDir = getRowArrowDirection(event.keyCode);
        
            var iRow = rowChecks(cRow, rowDir);

            var newRow = cRow + rowDir;

            var fRow = rowChecks(newRow, rowDir);

            var zone = inSelectedZone(iRow, fRow);

            //check and select current row if wihtin the bounds
            if(rowDir==1){ //arrow down
                if(zone){
                    onRowSelectRemove(iRow)
                }else{
                    onRowSelectAdd(iRow) //select/unselect initial row before adding or subtracting
                    onRowSelectAdd(fRow)
                }
            }else{ //arrow up
                if(zone){
                    onRowSelectRemove(iRow)
                }else{
                    onRowSelectAdd(fRow)
                    onRowSelectAdd(iRow) //previous
                }
            }
            moveFocus(fRow, cCol);
            constants.currentRow = fRow;
            showSelectionControls( true );
        }
        else if( event.keyCode==37 || event.keyCode==38 || event.keyCode==39 || event.keyCode==40 ){ //arrows keys: left, top, right, bottom
            
            event.preventDefault();
            event.stopPropagation();
            
            var cRow = constants.currentRow;
            var cCol = constants.currentCol;

            var rowDir = getRowArrowDirection(event.keyCode);
            var newRow = cRow + rowDir;

            var colDir =  getColArrowDirection(event.keyCode);
            var newCol = cCol + colDir;

            var fRow = rowChecks(newRow, rowDir);
            var fCol = colChecks(newCol, colDir);

            moveFocus(fRow, fCol);

            constants.currentRow = fRow;
            constants.currentCol = fCol;
        }
    }



      const [openDialog, setOpenDialog] = useState(false);
      const openResult = useMemo(
        
        ()=>{
        return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="homeopenResult" items={ 
        <OpenResult 
    
          openTrigger={Math.random()} 
          onClose={()=>{ setOpenDialog(false)}} 
          onFireUpdate={(mode)=>{  

            setTimeout(()=>{ 
                if(mode=="*") onRefreshSheet();
                if(mode=="recompute") onRecomputeResult();
                if(mode=="refresh") onRefreshRows();
            }, 800) 

          }} 
    
        />} 
        onClose={ ()=>{ setOpenDialog(false); } }
        dialogState={openDialog}
    
      />;
      }, [openDialog] )


      const [exportDialog, setExportDialog] = useState(false);
      const exportResult = useMemo(()=>{
          return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="homeexport" items={ <ExportResult resultName={constants.resultName} onExportFinished={()=>setExportDialog(false)} /> } 
                onClose={ ()=>{ setExportDialog(false); } }
                dialogState={exportDialog}
              />
       }, [exportDialog] )


       const [newRDialog, setNewRDialog] = useState(false);

       const newResult = useMemo(()=>{
           return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="homenewResult" items={ <NewResult onClose={()=>setNewRDialog(false)}  onFireUpdate={(mode)=>{ 
            
                setTimeout(()=>{ 
                    if(mode=="*") onRefreshSheet();
                    if(mode=="recompute") onRecomputeResult();
                    if(mode=="refresh") onRefreshRows();
                }, 800) 
        
            }} />  } 

           onClose={ ()=>{ setNewRDialog(false); } }
           dialogState={newRDialog}

         />;
         }, [newRDialog] )

    
         const [addRowDialog2, setAddRowDialog2] = useState(false);
         const addRow = useMemo(()=>{
             return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="homeaddRow" items={ <AddRow onClose={()=>setAddRowDialog2(false)} pid="homeAddRInfo"  onFireUpdate={(mode)=>{ 
                
                setTimeout(()=>{ 
                    if(mode=="*") onRefreshSheet();
                    if(mode=="recompute") onRecomputeResult();
                    if(mode=="refresh") onRefreshRows();
                }, 800)   

            }}  /> } 

             onClose={ ()=>{ setAddRowDialog2(false); } }
             dialogState={addRowDialog2}
           />
        }, [addRowDialog2] )


    function inSelectedZone(row1, row2){
        return (constants.selectedRows.includes(row1)&&constants.selectedRows.includes(row2))
    }


    function onRowSelectAdd(cRow){
        if( !constants.selectedRows.includes(cRow)){
            constants.selectedRows.push(cRow);
        }
        // onRefreshRows();
        onRefreshGivenRows( [cRow] )
    }

    function onRowSelectRemove(cRow){
        if( constants.selectedRows.includes(cRow)){
            constants.selectedRows.splice( constants.selectedRows.indexOf(cRow), 1 );
        }
        onRefreshGivenRows( [ cRow ]);
    }


    function rowChecks(row, direction){
        if(row < 0) return constants.resultObject.length-1; //loop back
        if(row>constants.resultObject.length-1) return 0; //loop back
        return row;
    }

    function colChecks(col, direction){
        if(col==2 ) return col + direction;
        if(col==constants.template.length-5) return col + direction;
        if(col<1) return constants.template.length-4; //loop back
        if(col>constants.template.length-4) return 1; //loop back
        return col;
    }


    function moveFocus(row, col){
        if(col == 1){ //name or reg column
            if(constants.toggleName){
                var e = document.getElementById("name"+row+""+col);
                if(e !=null ) document.getElementById('name'+row+""+col).focus();
            }else{
                var e = document.getElementById("reg"+row+""+col);
                if(e !=null ) document.getElementById('reg'+row+""+col).focus();
            }
        }else{
            var e = document.getElementById(row+""+col);
            if(e !=null ){
                document.getElementById(row+""+col).focus();
            }
        }
    }


    function getRowArrowDirection(keyCode){
        switch (keyCode) {
            case 37: return 0;
            case 38: return -1;
            case 39: return 0;
            case 40: return 1;
                
            default: return -1;
        }
    }

    function getColArrowDirection(keyCode){
        switch (keyCode) {
            case 37: return -1;
            case 38: return 0;
            case 39: return 1;
            case 40: return 0;
                
            default: return -1;
        }
    }


    //====================================================================
    async function saveResultIPC( resultName, data ){
        var fname = sanitizeResultName(resultName);
        await write( constants.saveToFolder, fname, JSON.stringify( data ) );
        // ipcRenderer.send( 'save-result', constants.saveToFolder, resultName, data );
    };


    function makeDate(d,m,y){
        return getMonthString(m) + " " + d + ", " + y;
    }

    function getMonthString(month){
        switch(month){

            case 0: return "Jan";
            case 1: return "Feb";
            case 2: return "March";
            case 3: return "April";
            case 4: return "May";
            case 5: return "June";
            case 6: return "July";
            case 7: return "Aug";
            case 8: return "Sept";
            case 9: return "Oct";
            case 10: return "Nov";
            case 11: return "Dec";
        
            default: return "Jan";
          }
    }


    function onSaveResult(){

        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth();
        var d = date.getDate();


        var resultData = {
            "dateCreated": makeDate(d,m,y),
            "templateName": constants.templateName,
            "template": constants.template,
            "passMark": constants.gradingSystem.passMark,
            "gradingSystemName": constants.gradingSystemName,
            "gradingSystem": constants.gradingSystem.gradingSystem,
            "selectedColumn": constants.selectedColumn,
            "currentFoundStudentIndex": constants.currentFoundStudentIndex,
            "resultName": constants.resultName,
            "resultObject": constants.resultObject,
        }

        //save result to file system
        saveResultIPC( constants.resultName, resultData );

        
        setIsSaved(true); //triggger change on saved, to change save button to normal
    }


    //======================================================================

    var beep = null;
    var error = null;


    function playError(){
        if(error == null){ error = new Audio('err.wav'); }
        if(constants.haptic){
            if(error!=null){error.play()}
        }
    }


    function playBeep(){
        if(beep == null){ beep = new Audio('beep.wav'); }
        if(constants.haptic){
            if(beep!=null){beep.play()}
        }
    }


    var onAIData = (event, data ) => {


        //hide AI assist dialog
        setConnectDialog(false);



        //split into reg, raw, and result
        var parts = data.split(constants.SEPARATOR);
        if( data.startsWith(constants.CODE_SECURE) ){

            if(parts.length==4){

                var aiStudent = parts[1]; //reg
                var aiValue = parts[2] //sum
    
                //step 1: find all student
                constants.indicesFound = [];
                constants.resultObject.forEach(
                    ( row, index )=>{
                        if( row.reg.toLowerCase().includes(aiStudent.toLowerCase()) ){
                            constants.indicesFound.push(index);
                        }
                    }
                )
    
                var foundIndex = (constants.indicesFound.length>0)? constants.indicesFound[0] : -1;
                constants.currentFoundStudentIndex = foundIndex;
                doInsertInto( foundIndex, aiStudent, aiValue );
    
            }else{
                playError();
                setInfo(true, "Warning", "Invalid value intercepted.");
            }

        }else{
            playError();
            setInfo(true, "Warning", "Unauthorized source intercepted.");
        }
    }


    React.useEffect(() => {
        synthesis = window.speechSynthesis;
    }, [] );
    

    // React.useEffect(() => {
    //     ipcRenderer.on('aiassist', onAIData ) //receive from node
    //     return () => {
    //         ipcRenderer.removeListener('aiassist', onAIData)
    //     };
    // }, [] );


    React.useEffect(() => {

        document.addEventListener("keydown", onKeyDown );
        return () => {
            document.removeEventListener("keydown", onKeyDown);  
        };

    }, [] );

  


    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    async function deleteResultFile(){

        await deleteFile( constants.saveToFolder, constants.resultName + ".staaris" )
        // ipcRenderer.send('delete-result', constants.saveToFolder, constants.resultName+".staaris" );
       
        constants.shouldRefreshResultFileList = true;

        constants.currentCol = -1;
        constants.currentFoundStudentIndex = -1;
        constants.currentRow = -1;
        constants.hoveredRow = -1;
        constants.indicesFound = [];
        constants.resultName = "";
        constants.resultObject = [];
        constants.selectedColumn = -1;
        constants.selectedRows = [];

    
        setIsSaved(true);

      
        setConfirmDelRFile(false);
        showSelectionControls(false);

    }



    function deleteSelection(){

        var objectsToDelete = [];
        constants.selectedRows.forEach((row)=>{
            objectsToDelete.push(constants.resultObject[row])
        })

            objectsToDelete.forEach(
                (toDelete)=>{
                    if(toDelete != undefined)
                        constants.resultObject.splice(  constants.resultObject.indexOf(toDelete), 1 )
                }
            )
        

            constants.selectedRows = [];

            setConfirmDelSelection(false)
            showSelectionControls(false);
           
            setIsSaved(false);
           
            onRefreshSheet();
        
    }


    function deleteRow(){
        if(rowToDelete>=0){
            var toDelete = constants.resultObject[rowToDelete];
            if(toDelete != undefined){
                constants.resultObject.splice(  constants.resultObject.indexOf(toDelete), 1 )
                setConfirmDelRow(false);


                constants.selectedRows = [];
                showSelectionControls(false);
                
                setIsSaved(false);
                
                onRefreshSheet();
            }
        }
    }


    function isRowBounded(rowIndex){
        if ( rowIndex>-1 && rowIndex<constants.resultObject.length ){
            return true;
        }
        return false;
    }


    function doInsertInto( foundIndex, aiStudent, aiValue ){

        var newV = isClean(aiValue);

        //check column selection
        if(constants.selectedColumn>0){

        if(isRowBounded(foundIndex)){ //check if student is found

                scrollToRow( foundIndex - 2 );
                
                if( newV >= 0 ){

                    var colName = constants.template[constants.selectedColumn]['key'];
                    var oldV = constants.resultObject[foundIndex][colName];

                    setOldValue(oldV);
                    setNewValue(aiValue);

                    if(  oldV+"".trim() == "" || oldV==undefined ){ //empty, fine
                        insertResultOnSearch( foundIndex, constants.selectedColumn, newV );
                    }
                    else{ //field is not empty, show replace box
                        playError();
                        setReplaceDialog(true);
                    }

                }else{ 
                    playError(); 
                    setInfo(true, "Value Error", "The value you are supplying is not a valid number."); }
                

        }else{ //student not found

            if( !constants.doNotShowExistingStudentDialog){ playError();}

            setSearchedStudent(aiStudent);
            if(newV>=0){ setSearchedScore(newV); }else{ setSearchedScore(""); }            

            if(aiStudent.trim() != ""){
                if(constants.doNotShowExistingStudentDialog){
                    addNewStudent(aiStudent, newV)
                }else{ setaddNonExistingStudent(true) }
            }
            else{
                setInfo(true, "Find Student", "The Student ID is not valid. Please cross-check and try again.");
            }

        }



        }else{ 
            playError(); 
            setInfo(true, "Column Selection", "Please select a column to enter your score."); 
        }


    }//end of method



    //the entire sheet will be reconstructed : DONE
    function onRefreshSheet(){
        setRefreshSheet(Math.random()+""+Math.random());         //Helps in switching results e.g. open new result
        try{
            resultPaneRef.current.refreshSheet();
        }catch(e){}
    }


     //TODO
     function onRefreshRows(){
        try{
            resultPaneRef.current.refreshRows();
        }catch(e){}
    }

    function onRefreshGivenRows( rows ){
        try{
            resultPaneRef.current.refreshGivenRows( rows );
        }catch(e){}
    }


    // setIsShowContextMenu
    function showSelectionControls( value ){

        if(constants.selectedRows.length>0){
            try{
                selectionControlsRef.current.onDisplay();
            }catch(e){  }
        }else{
            try{
                selectionControlsRef.current.onClose();
            }catch(e){ }
        }

        

    }


    function setInfo(state, title, body){
        setInfoDialog(state);
        setTitle(title);
        setBody(body);
    }


    function getPasteLength(startIndex, pastLength, resultLength ){
        var len = ( (startIndex + pastLength-1 ) > resultLength-1 )? resultLength-1 : (startIndex + pastLength-1 );
        return len;
    }


    function validatePasteCellValue(value){
        if( value === "" ) return "";
        try{
            var clean = parseFloat( value );
            if(isNaN(clean)) return "ignore";
            return clean;
        }catch(e){ return "ignore" }
    }
    


    async function doPasteData(row, col, dataType){

        const text = await navigator.clipboard.readText();
        
        var colData = text.split("\n");

        var columnData = (colData.length>1 && colData[colData.length-1].length==0)? colData.slice(0,colData.length-1 ) : colData;

        var columnKey = constants.template[col]['key'];
        var stop = getPasteLength(row, columnData.length,constants.resultObject.length );
        var countOfBadData = 0;
        var countOfGoodData = 0;

        if(dataType == "number"){

            for(var i=row; i<=stop; i++){
                var clean = validatePasteCellValue( columnData[i-row].replace(/(\r)/gm,"").trim() );
                if(clean!="ignore"){
                    constants.resultObject[i][columnKey] =  clean;
                    countOfGoodData++;
                }else{ countOfBadData++ }
            }

        }else{

            for(var i=row; i<=stop; i++){

                if(constants.toggleName){
                    constants.resultObject[i]['name'] = (columnData[i-row]).replace(/(\r)/gm,"").trim();
                }else{
                    constants.resultObject[i]['reg'] = (columnData[i-row]).replace(/(\r)/gm,"").trim();
                }
                countOfGoodData++;
            }
        }


        //if data was actually pasted
        if(countOfGoodData>0){
            
            setIsSaved(false);
            setInfo(true, "Success", `${countOfGoodData} ${countOfGoodData>1? "rows were":"row was"} updated.` )
            if(dataType == "number"){
                onRecomputeResult();
            }else{
                onRefreshSheet();
            }
        }

        if(countOfBadData>0) setInfo(true, "Warning", `${countOfBadData} ${countOfBadData>1? "rows of bad values were":"row of bad value was"} ingored!`)
    }


    const virtuosoRef = useRef(null); //used to scroll resultsheet
    const resultPaneRef = useRef(null); //used to call functions in the result pane

    function scrollToRow(rowIndex){
        try{
            virtuosoRef?.current.scrollToIndex(
                {
                    index: rowIndex,
                    align: "start",
                    behavior: constants.resultObject.length>150? "auto" : "smooth",
                }
            
            );
        }catch(e){setInfo(true, "Warning", "Scrolling not active at the moment.")}

    }
        



    function makeBlankResultObject( index, template ){
            var rowData = {};
            template.forEach(
                (item)=>{
                    rowData[item.key] = "";
                }
            )
            constants.resultObject.splice( index, 0, rowData );
    }



    function onInsertBlank(index){
    
        if( (index>=0 && index < constants.resultObject.length) ){

            makeBlankResultObject( index, constants.template );

            // if(autoSave){

            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth();
            var d = date.getDate();

            var resultData = {
                "dateCreated": makeDate(d,m,y),
                "templateName": constants.templateName,
                "template": constants.template,
                "passMark": constants.gradingSystem.passMark,
                "gradingSystemName": constants.gradingSystemName,
                "gradingSystem": constants.gradingSystem.gradingSystem,
                "selectedColumn": constants.selectedColumn,
                "currentFoundStudentIndex": constants.currentFoundStudentIndex,
                "resultName": constants.resultName,
                "resultObject": constants.resultObject,
            }

            //save result to file system
            saveResultIPC(constants.resultName, resultData );
            
            setIsSaved(true);


            setInsertRowDialog(false);

            constants.selectedRows = [];
            showSelectionControls(false);
            
            onRefreshSheet(); 

        }
    }


    

    // const getRowItem = useMemo(

    //     ()=>{

    //        const resultRow = ({ index, style }) => 

    //             (
    //             <div  style={style}>
    //                 {

    //                     <RowItem 
    //                         key={index}
    //                         rowIndex={index}  

    //                         onAddRow={(x)=>{

    //                             setInsertIndex(index);

    //                             if(x==1){
    //                                 onInsertBlank(index);    //insert one blank row
    //                             }else{
    //                                 setInsertRowDialog(true);   //insert multiple
    //                             }
                                
    //                         }}

    //                         onDeleteRow={()=>{
    //                             setRowToDelete(index)
    //                             setConfirmDelRow(true);
    //                         }}

    //                         onPaste={(event, rowIndex, colIndex, dataType)=>{
    //                             setPasteDetails({"row":rowIndex, "col":colIndex,"dataType":dataType});
    //                             if(dataType == "number")constants.selectedColumn = colIndex;
    //                             var diff = window.innerHeight - event.clientY;
    //                             var comSize = 70;
    //                             var y = (diff > comSize)? event.clientY : event.clientY-(comSize-diff) ;
    //                             setPos([event.clientX, y])
    //                             setIsPasteMenu(true);
    //                         }}

    //                         selectedCol={selectedCol}  
    //                         columnConfig={constants.template} 

    //                         // forceRowUpdate={ forceRowUpdate } //TODO

    //                         onForceUpdate={(param)=>{ 

    //                             if(param.startsWith("show-context")){
    //                                 showSelectionControls( true );
    //                                 onRefreshRows(); //allows the length to get updated

    //                             }else if(param.startsWith("hide")){
    //                                 showSelectionControls(false);
    //                                 setReplaceDialog(false);

    //                             }else if(param.startsWith('onChange')){
                                    
    //                                 setIsSaved( false );

    //                             }else if(param == "*"){
    //                                 onRefreshSheet()

    //                             }else if(param=="refresh"){

    //                                 onRefreshRows();
    //                             }

    //                         }}
    //                     />


    //                 }
    //             </div>
    //         );

    //         resultRow.displayName = "StaarisResultRow";
    //         return resultRow;

    //     }, [ refreshSheet ]
    // )


    function insertResultOnSearch(row, col, result){

        if(col != 1){
            var e = document.getElementById(row+""+col);
            if(e !=null ){

                var columnKeys = [];
                constants.template.forEach(
                    (objects)=>{ columnKeys.push(objects.key) }
                )

                e.value = result;
                constants.resultObject[row][ columnKeys[col] ] = result;
                onRecomputeRow( row, col );
                
                setIsSaved(false);


                if( constants.talkback && result!=="" ){
                    speak( result +"" );
                }else{
                    playBeep();
                }
                
            }
        }
    }



    //return false or a parsed value
    function isClean(value){
        if(value+"".trim() == "" || value == undefined) return false;
        try{
            var clean = parseFloat(value+"");
            if(isNaN(clean)) return false;
            return clean;
        }catch(e){ return false }
    }



    //============================= RECOMPUTE RESULT ============================
    //if value is empty or bad, return zero
    function cellCleaner(value){
        if(value+"".trim() == "" || value == undefined) return 0;
        try{
            var clean = parseFloat(value+"");
            if(isNaN(clean)) return 0;
            return clean;
        }catch(e){ return 0 }
    }
    

    function onRecomputeResult(  ){

            //get column keys
            var columnKeys = [];
            constants.template.forEach(
                (objects)=>{ columnKeys.push(objects.key) }
            )

            //loop keys except serial, reg, name, ca, exam, total, grade, remark
            var exceptionList = ["serial", "reg", "name", "ca", "exam", "total", "grade", "remark"];

            constants.resultObject.forEach(
                (resultRow)=>{

                    var ca = 0;

                    columnKeys.forEach( key => {
                        if( !exceptionList.includes(key) ){
                            ca += ( cellCleaner(resultRow[key]) )
                        }
                    });

                    resultRow['ca'] = Math.round((ca + Number.EPSILON) * 100) / 100;

                    //check if the student wrote exams before updating the total
                    if( resultRow['exam']+"".trim()  == "" ){
                        resultRow['total'] = "";
                        resultRow['grade'] = "";
                        resultRow['remark'] = constants.incompleteResult;
                    }else{

                        var total = ca + cellCleaner(resultRow['exam']);

                        resultRow['total'] = parseInt(total+""); //convert to whole number
                        
                        var grade = getGrade(total);
                        var remark = (grade+"".trim() == "***")? "Invalid" : getRemark(total);
        
                        resultRow['grade'] = grade;
                        resultRow['remark'] = remark;
                    }

                }
            )

        onRefreshSheet();
    }
    
    
    
    //on value update received from the row
    function onRecomputeRow( rowIndex, colIndex ){

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
            if( examScore === -1 ){
                constants.resultObject[rowIndex]['total'] = "";
                constants.resultObject[rowIndex]['grade'] = "";
                constants.resultObject[rowIndex]['remark'] = constants.incompleteResult;
            }else{
                var total = ca + examScore;
                constants.resultObject[rowIndex]['total'] = parseInt(total+""); //convert to whole number
                
                var grade = getGrade(total);
                var remark = (grade+"".trim() == "***")? "Invalid" : getRemark(total);

                constants.resultObject[rowIndex]['grade'] = grade;
                constants.resultObject[rowIndex]['remark'] = remark;
            }
        }
        onRefreshRows();
    }



    function getExams(rowIndex){
        var value = constants.resultObject[rowIndex]['exam'];
        if( value+"".trim() == "" || value==undefined ) return -1; //representing no valid exam exam
        try{
            var clean = parseFloat(value+"");
            if(isNaN(clean)) return -1;
            return clean;
        }catch(e){ return -1 }
    }


    function getGrade( totalScore ){
        var grade = "***";
        constants.gradingSystem.gradingSystem.forEach(
            (gradingObject)=>{
                if( totalScore >= cleanGradeData(gradingObject.min) && totalScore <= cleanGradeData(gradingObject.max)){
                    grade = gradingObject.grade;
                    return grade;
                }
            }
        )
        return grade;
    }


    function getRemark(total){
        var remark = (total >= constants.gradingSystem.passMark && total<=constants.totalUpperBoundary )? constants.pass : constants.fail;
        return remark;
    }
    
    function cleanGradeData( val ){
        if(val+"".trim() == "" || val==undefined || val==null ){
            return "";
        }else{
            try{
                return parseFloat( val+"" );
            }catch(e){
                return "";
            }
            
        }
    }


    function closeResult(){
        constants.currentCol = -1;
        constants.currentFoundStudentIndex = -1;
        constants.currentRow = -1;
        constants.hoveredRow = -1;
        constants.indicesFound = [];
        constants.resultName = "";
        constants.resultObject = [];
        constants.selectedColumn = -1;
        constants.selectedRows = [];
        setIsSaved(true);
        onRefreshSheet();
    }


    //clears selected results and refresh the screen
    function clearSelection(){
        try{
            resultPaneRef.current.clearSelection();
        }catch(e){}
        
    }


     //clears selected results and refresh the screen
     function clearDuplicateResultHighlight(){
        try{
            resultPaneRef.current.clearDuplicate();
        }catch(e){}

    }



    async function cutColumn(colIndex){

        var cutData = "";
        var colKey = constants.template[colIndex]['key'];

        constants.resultObject.forEach(
            (resultRow)=>{
                if(colKey==="reg"){
                    var key = (constants.toggleName)? "name" : "reg";
                    cutData += ( resultRow[key]+"\n" )
                    resultRow[key] = "";
                    
                }else{
                    cutData += ( resultRow[colKey]+"\n" )
                    resultRow[colKey] = "";
                }
            }
        )

        await navigator.clipboard.writeText( cutData );

       
        setIsSaved(false);
        onRecomputeResult();
    }


    async function copyColumn(colIndex){

        var copyData = "";
        var colKey = constants.template[colIndex]['key'];

        constants.resultObject.forEach(
            (resultRow)=>{
                if(colKey==="reg"){
                    var key = (constants.toggleName)? "name" : "reg";
                    copyData += ( resultRow[key]+"\n" )
                    // resultRow[key] = "";
                }else{
                    copyData += ( resultRow[colKey]+"\n" )
                    // resultRow[colKey] = "";
                }
            }
        )

        await navigator.clipboard.writeText( copyData );
    }


    function getUBounded(value, colIndex){
        return ( value>constants.template[colIndex]['max'] )? constants.template[colIndex]['max'] : value;
    }

    function getLBounded(value){
        if(value<0) return 0;
        return value;
    }


    function getLUBounded(value, colIndex){
        if(value<0) return 0;
        return ( value>constants.template[colIndex]['max'] )? constants.template[colIndex]['max'] : value;
    }
    
    function addSubtractColumn(colIndex, operator, preventOverflow, marks){
        var colKey = constants.template[colIndex]['key'];
        var score = cellCleaner(marks);
        
        // if(score>=0){
            constants.resultObject.forEach(
                (resultRow)=>{

                    if(operator==="Add"){
                        var fValue = (preventOverflow)? getUBounded( cellCleaner( resultRow[colKey] ) + score, colIndex ) : cellCleaner( resultRow[colKey] ) + score;
                        resultRow[colKey] = fValue;
                    }else if(operator==="Subtract"){
                        var fValue = (preventOverflow)? getLBounded( cellCleaner( resultRow[colKey] ) - score ) : cellCleaner( resultRow[colKey] ) - score;
                        resultRow[colKey] = fValue;
                    }else if(operator==="Multiply"){
                        var fValue = (preventOverflow)? getLUBounded( cellCleaner( resultRow[colKey] ) * score, colIndex ) : cellCleaner( resultRow[colKey] ) * score;
                        resultRow[colKey] = parseInt(fValue+"");  //convert to whole number
                    }

                }
            )
            
            setIsSaved(false);
            onRecomputeResult();
        // }
    }


    function mapColumn(colIndex, fromRange, toRange ){
        var colKey = constants.template[colIndex]['key'];
        var conversionRatio = cellCleaner(toRange) / cellCleaner(fromRange);
        constants.resultObject.forEach(
            (resultRow)=>{
                var fValue = cellCleaner( resultRow[colKey] ) * conversionRatio;
                resultRow[colKey] = parseInt(fValue+""); //convert to whole number
            }
        )
        
        setIsSaved(false);
        onRecomputeResult();
    }



    function getSelectedColKey(){
        var colName = "";
        if(constants.selectedColumn>2){
            try{
                colName = constants.template[constants.selectedColumn]['key'];
            }catch(e){colName = "";}
        }
        return colName;
    }



    //used to add non-existing student from AI-Assist
    function addNewStudent(studentID, score){

            var rowData = {};

            var colName = getSelectedColKey();

            constants.template.forEach(
                (item)=>{
                    if(item.key == "reg"){
                        rowData[item.key] = studentID.trim();
                    }else if(item.key == colName){
                        rowData[item.key] = score;
                    }
                    else{ rowData[item.key] = ""; }
                }
            )

            setaddNonExistingStudent(false);
            constants.resultObject.push(rowData);
            
            setIsSaved(false);
            setSearchedStudent("");

            //select new student: last item
            constants.currentFoundStudentIndex = constants.resultObject.length - 1;


            constants.selectedRows = [];
            showSelectionControls(false); //hide selection box
            setReplaceDialog(false)
            

            //recompute current row
            if(constants.currentFoundStudentIndex>=0 && constants.selectedColumn>0){
                onRecomputeRow( constants.currentFoundStudentIndex, constants.selectedColumn  );
                
                if(constants.talkback && score!==""){
                    speak( score +"" );
                }else{
                    playBeep();
                }

            }

            onRefreshRows(); //refresh

    }



    function onConnectDialog(){

        // ipcRenderer.send("get-connection");
    
        // ipcRenderer.once('on-get-connection', (event, data) => {
        //   setIP(data);
        //   if(data!="" && data!="127.0.0.1"){
        //     QR.toDataURL( data ).then((imgSrc)=>setSRC(imgSrc))
        //   }
        //   setConnectDialog(true);
        // });
    
    }


    //====================== END OF RECOMPUTE RESULT ROW ============================

    const aiconnectUI = useMemo(()=>{
        return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="aiconnect" items={ 
          <AIConnect psrc={src} pip={ip} /> 
        } 
        onClose={ ()=>{ setConnectDialog(!connectDialog); } }
        dialogState={connectDialog}
      />
      }, [connectDialog] )


      const addRowUI = useMemo(()=>{
        return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="addRow2" items={ 
        
            <AddRow  
                pid="NoRow"
                onClose={()=>setAddRowDialog(false)}
                onFireUpdate={
                        (mode)=>{ 
                            setAddRowDialog(false);  

                            // setTimeout(()=>{ 
                            //     // onRefreshSheet(); 
                            // }, 500)

                        }}  
            /> } 

        onClose={ ()=>{ setAddRowDialog(false); } }
        dialogState={addRowDialog}

      />
      }, [addRowDialog] )


    
    const toolbar = useMemo(
        ()=>{
            return <Toolbar 

                        ref={toolbarRef}

                        onAIDialog={
                            ()=>{
                                onConnectDialog();
                            }
                        }

                        studentNum={ constants.resultObject.length } 
                        columnConfig={constants.template}

                        onMenuOpen={()=>{

                            if( constants.selectedRows.length>0 ){ 
                                clearSelection();
                             }

                            showSelectionControls(false);
                            setReplaceDialog(false);

                        }}
                        
                        //used for duplicate check
                        onGoto={(index)=>{ 
                            scrollToRow( index );
                            onRefreshRows(); //why?
                            showSelectionControls(true);
                        }}

                        onSelectDuplicates={()=>{
                            onRefreshRows();  //why?
                            showSelectionControls(true);
                        }}

                        isPresentation={()=>{
                            setPresentation( true );
                            var root = document.documentElement;
                            root.style.setProperty( '--presentationDragMargin', '22px' );
                            root.style.setProperty( '--presentationDragHeight', '1px' );
                        }}
                        
                        //update from menus
                        onFireUpdate={(mode)=>{
                            if(mode=="*") onRefreshSheet()
                            if(mode=="recompute") onRecomputeResult();
                            if(mode=="refresh") onRefreshRows()
                        }}

                        // onSaveResult={()=>{
                        //     onSaveResult();
                        // }}

                        onInsertValue={( valueToInsert )=>{

                            setNewValue(valueToInsert);

                            if(constants.selectedColumn<0){
                                playError();
                                setInfo(true, "Column Selection", "Please select a column to enter your score.");
                                return;
                            }

                            var newV = isClean(valueToInsert);

                            if( newV >= 0 ){

                                if( constants.currentFoundStudentIndex>-1 && constants.currentFoundStudentIndex<constants.resultObject.length ){
                                    
                                    var colName = constants.template[constants.selectedColumn]['key'];
                                    var oldV = constants.resultObject[constants.currentFoundStudentIndex][colName];
                                    
                                    setOldValue(oldV);
                                    setNewValue(valueToInsert);
    
                                    if( oldV+"".trim() == "" ||  oldV==undefined ){
                                        insertResultOnSearch( constants.currentFoundStudentIndex, constants.selectedColumn, newV );
                                    }else{ //field is not empty, show replace box
                                        playError();
                                        setReplaceDialog(true);
                                    }
                                }

                            }else{ //check value
                                
                                playError();
                                setInfo(true, "Value Error", "The value you are supplying is not a valid number.");
                            }
                        }}
                        

                        onFindStudent={(student)=>{
                            //scroll to the first occurence of found student, select a field for result entry
                            if( constants.currentFoundStudentIndex>-1 && constants.currentFoundStudentIndex<constants.resultObject.length ){
                                
                                scrollToRow( constants.currentFoundStudentIndex - 2 );
                                onRefreshRows();
                            }else{ //student not found

                                if( !constants.doNotShowExistingStudentDialog){ playError();}

                                setSearchedStudent(student);
                                setSearchedScore("");

                                if(student.trim() != ""){
                                    if(constants.doNotShowExistingStudentDialog){
                                        addNewStudent(student, "");
                                    }else{ setaddNonExistingStudent(true) }
                                }
                                else{
                                    setInfo(true, "Find Student", "The Student ID is not valid. Please cross-check and try again.");
                                }

                            }
                        }}

                    />;
        }, [refreshSheet ]
    )


    const infoBox = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isCenter="true" isScaleAnim="true" id="informationBox" items={ <InfoDialog title={title} body={body} /> } 
                onClose={ ()=>{ setInfoDialog(!infoDialog); } }
                dialogState={infoDialog}
            />
        }, [infoDialog]
    )


    const [addNonExistingStudent, setaddNonExistingStudent] = useState(false); 
    const addNonExistingStudentUI = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isCenter="true" isScaleAnim="true" id="addNonExistingStudent" 
                items={ 
                    <ConfirmNoStudent 
                        title="Find Student" 
                        body={"The Student '" + searchedStudent +"' is not found, do you want to add this Student?"}
                        negative="Cancel" 
                        positive="Add Student ID" 
                        onNegative={()=>setaddNonExistingStudent(false)} 
                        onPositive={()=>{ 
                            addNewStudent(searchedStudent, searchedScore); 
                        }} 
                    />
                } 

                onClose={ ()=>{ setaddNonExistingStudent(false); } }
                dialogState={addNonExistingStudent}
        />
    }, [addNonExistingStudent] )



    const [confirmDelSelection, setConfirmDelSelection] = useState(false); 
    const confirmDelSelectionUI = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isCenter="true" isScaleAnim="true" id="confirmDelSelection" 
                items={ 
                    <ConfirmDialog 
                        title="Delete Selection" 
                        subTitle=""
                        body="You are trying to the delete selected rows. Are you sure about this?" 
                        
                        negative="Cancel" 
                        positive="Delete" 
                        onNegative={()=>setConfirmDelSelection(false)} 
                        onPositive={()=>{ 

                            deleteSelection(); 
                        
                        }} />  
                    } 

                onClose={ ()=>{ setConfirmDelSelection(false); } }
                dialogState={confirmDelSelection}
        />
    }, [confirmDelSelection] )




    const [confirmDelRFile, setConfirmDelRFile] = useState(false); 
    const deleteRFileUI = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isCenter="true" isScaleAnim="true" id="confirmDelRFile" 
                items={ 
                    <ConfirmDialog 
                        title="Delete All" 
                        subTitle=""
                        body="All rows will be deleted. This result will also be deleted from file. Are you sure about this?" 
                        negative="Cancel" 
                        positive="Delete" 
                        onNegative={()=>setConfirmDelRFile(false)} 
                        onPositive={()=>{ deleteResultFile(); }} />  
                    } 

                onClose={ ()=>{ setConfirmDelRFile(false); } }
                dialogState={confirmDelRFile}
        />
    }, [confirmDelRFile] )



    const [confirmClearSelection, setConfirmClearSelection] = useState(false); 
    const confirmClearSelectionUI = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isCenter="true" isScaleAnim="true" id="confirmClearSelection" 
                items={ 
                    <ClearSelectedResults 
                        onFireUpdate={(mode)=>{
                                
                                setConfirmClearSelection(false);

                                constants.selectedRows = [];
                                showSelectionControls(false);

                                setIsSaved(false);
                                onRefreshSheet();

                            }
                        }

                        onClose={()=>{ setConfirmClearSelection(false); }}
                    />
                } 
                onClose={ ()=>{ setConfirmClearSelection(false); } }
                dialogState={confirmClearSelection}
        />
    }, [confirmClearSelection] )


    const [confirmExportSelection, setConfirmExportSelection] = useState(false); 
    const confirmExportSelectionUI = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isCenter="true" isScaleAnim="true" id="confirmExportSelection" 
                items={ 
                    <ExportSelectedResult
                        onExportFinished={()=>{

                                
                                setConfirmExportSelection(false);
                                
                            }
                        }

                        onClose={()=>{ setConfirmExportSelection(false); }}
                    />
                } 
                onClose={ ()=>{ setConfirmExportSelection(false); } }
                dialogState={confirmExportSelection}
        />
    }, [confirmExportSelection] )




    const [confirmDialog, setConfirmDialog] = useState(false); 
    //confirm close a result sheet
    const confirmCloseSheet = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isCenter="true" isScaleAnim="true" id="closeSheetBox" items={ <ConfirmDialog title="Close Sheet" subTitle="" body="You are trying to close this result sheet. Are you sure about this?" negative="Cancel" positive="Close Sheet" onNegative={()=>setConfirmDialog(false)} onPositive={()=>{ 
                    
                    constants.selectedRows = [];
                    // onRefreshRows();
                    showSelectionControls(false);
                    setReplaceDialog(false)
                
                    setConfirmDialog(false); 
                    closeResult()
            
                }} />  } 

                onClose={ ()=>{ setConfirmDialog(false); } }
                dialogState={confirmDialog}
        />
    }, [confirmDialog] )


    const [insertRowDialog, setInsertRowDialog] = useState(false); 
    const insertRowUI = useMemo(()=>{
        return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="addInsertRo" 
        
            items={ <InsertRow  
                        onFireUpdate={(mode)=>{
                            setInsertRowDialog(false);

                            constants.selectedRows = [];
                            showSelectionControls(false);

                            
                            onRefreshSheet();                             
                        }} 
                        insertIndex={insertIndex} 
                    /> 
                } 

        onClose={ ()=>{ setInsertRowDialog(false); } }
        dialogState={insertRowDialog}
      />
      }, [insertRowDialog] )




    const [confirmSaveDialog, setConfirmSaveDialog] = useState(false); 
    //confirm close a result sheet
    const confirmSaveSheet = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isCenter="true" isScaleAnim="true" id="sheetSaveBox" 
            
            items={ 
            
                <ConfirmSave onSave={()=>{

                    constants.selectedRows = [];
                    // onRefreshRows();
                    showSelectionControls(false);
                    setReplaceDialog(false)

                    onSaveResult();
                    setConfirmSaveDialog(false);
                    closeResult();
                }} 
                
                onClose={()=>{

                    constants.selectedRows = [];
                    // onRefreshRows();
                    showSelectionControls(false);
                    setReplaceDialog(false)

                    closeResult();
                    setConfirmSaveDialog(false)
                }} 
                
                onCancel={()=>{
                    setConfirmSaveDialog(false)
                }} />

            } 

            onClose={ ()=>{ setConfirmSaveDialog(false); } }
            dialogState={confirmSaveDialog}

        />
    }, [confirmSaveDialog] )




    const [confirmPasteDialog, setConfirmPasteDialog] = useState(false); 
    const confirmPasteUI = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isCenter="true" isScaleAnim="true" id="gConfirm" 
            
            items={ 
            
                <ConfirmPaste 
                
                pasteInfo={pasteDetails}
                
                onPaste={()=>{
                    if(pasteDetails.row>=0 && pasteDetails.col>=0 && pasteDetails.dataType!=""){
                        doPasteData(pasteDetails.row, pasteDetails.col, pasteDetails.dataType)
                    }else{
                        setInfo(true, "Warning","Please copy and paste only a column data." )
                    }
                    
                    setConfirmPasteDialog(false);
                }} 
                
                
                onCancel={()=>{
                    setConfirmPasteDialog(false)
                }} />

            } 

            onClose={ ()=>{ setConfirmPasteDialog(false); } }
            dialogState={confirmPasteDialog}

        />
    }, [confirmPasteDialog] )




    const [confirmDelRow, setConfirmDelRow] = useState(false); 
    const delRowUI = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isCenter="true" isScaleAnim="true" id="confirmDelRow" 
                items={ 
                    <ConfirmDialog 
                        title={"Delete Row " + (rowToDelete+1) } 
                        subTitle=""
                        body={"You are trying to the delete row "+ (rowToDelete+1) +". Are you sure about this?"} 
                        negative="Cancel" 
                        positive="Delete" 
                        onNegative={()=>setConfirmDelRow(false)} onPositive={()=>{ deleteRow(); }} />  
                    } 

                onClose={ ()=>{ setConfirmDelRow(false); } }
                dialogState={confirmDelRow}
        />
    }, [confirmDelRow] )





    const replaceValueDialog = useMemo(
        ()=>{
            return <div className={` ${style.boxCover } ${(replaceDialog )?style.reveal:style.conceal} `}>

                    <div className={` ${style.boxContent } `} >
                    <label style={{marginRight:"10px"}}>Do you want to replace {oldValue} with {newValue}?</label>
                    
                    <GButton icon={<FaArrowTurnDown/>} isFilled={true} title="Replace" onClick={()=>{
                        if( !isNaN(newValue) && constants.currentFoundStudentIndex>-1 && constants.currentFoundStudentIndex<constants.resultObject.length ){
                                insertResultOnSearch( constants.currentFoundStudentIndex, constants.selectedColumn, newValue );
                                setReplaceDialog(false);
                            }
                    }} />

                    <Tippy  theme='tomato' delay={150} content="Close" placement='bottom'>
                        <div  className={style.closeR} onClick={()=>{
                            setReplaceDialog(false);  
                        }}> <FaCircleXmark/> </div>
                    </Tippy>
                    </div>
                   </div>
        }, [replaceDialog]
    )



    const resultHeader = useMemo(
        ()=>{
            return <ResultHeader 

                presentationMode={pMode}

                onPaste={(event, colIndex, dataType)=>{
                    if(constants.resultObject.length > 0 ){
                        setPasteDetails({"row":0, "col":colIndex,"dataType":dataType});
                        if(dataType=="number")constants.selectedColumn = colIndex;

                        var diff = window.innerHeight - event.clientY;
                        var comSize = 200;
                        var y = (diff > comSize)? event.clientY : event.clientY-(comSize-diff) ;

                        setPos2([event.clientX, y])
                        setIsHeaderContext(true);
                    }
                }}


                template={constants.template} 
                selectedCol={selectedCol} 

                onCloseResult={()=>{
                    if(constants.isSaved){
                        setConfirmDialog(true);
                    }else{
                        setConfirmSaveDialog(true);
                    }
                }}

                onToggleName={
                    ()=>{ 
                        try{
                            resultPaneRef.current.toggleName();
                        }catch(e){}
                    }
                }

            />;
        },
    )




    const resultPane = useMemo(

        ()=>{ return <ResultPane 

                        isRebuild = {""} //TODO

                        ref={ resultPaneRef }

                        virtuosoRef={virtuosoRef}                         

                        onAddRow={ (x, index) => {
                            setInsertIndex(index);
                            if(x==1){
                                onInsertBlank(index);       //insert one blank row
                            }else{
                                setInsertRowDialog(true);   //insert multiple
                            }
                        }}


                        onDeleteRow={
                            (index)=>{
                                setRowToDelete(index)
                                setConfirmDelRow(true);
                            }
                        }

                        
                        //trickers when a row is selected or deselected, use this to show and hide context menu
                        onRowsSelected={ ()=>{
                            if(constants.selectedRows.length>0){
                                try{
                                    selectionControlsRef.current.onDisplay();
                                }catch(e){  }
                            }else{
                                try{
                                    selectionControlsRef.current.onClose();
                                }catch(e){ }
                            }
                        } }


                        sendMessage={ ( action )=>{

                        } }


                        onForceUpdate={
                            (param)=>{
                                if(param.startsWith("show-context")){
                                    showSelectionControls( true );
                                    onRefreshRows(); //allows the length to get updated
                                }else if(param.startsWith("hide")){
                                    showSelectionControls(false);
                                    setReplaceDialog(false);
                                }else if(param.startsWith('onChange')){
                                    setIsSaved( false );
                                }else if(param == "*"){
                                    onRefreshSheet()
                                }else if(param=="refresh"){
                                    onRefreshRows();
                                }
                            }
                        }


                        onPaste={(event, rowIndex, colIndex, dataType)=>{
                            setPasteDetails({"row":rowIndex, "col":colIndex,"dataType":dataType});
                            if(dataType == "number")constants.selectedColumn = colIndex;
                            var diff = window.innerHeight - event.clientY;
                            var comSize = 70;
                            var y = (diff > comSize)? event.clientY : event.clientY-(comSize-diff) ;
                            setPos([event.clientX, y])
                            setIsPasteMenu(true);
                        }}


                    />; 

                }, [ refreshSheet ] //provide a property that will be used to refresh the entire sheet
    )



    
    const pasteMenuUI = useMemo(
        ()=>{
            return <div onClick={()=>{setIsPasteMenu(false);}} onContextMenu={()=>setIsPasteMenu(false)} className={` ${style.contextCover} ${(isPasteMenu)?style.showPMenu:style.hidePMenu}` }>
                
                <div
                
                onClick={(event)=>event.stopPropagation()}

                className={style.contextMenu} style={{
                left:`${pos[0]}px`,
                top:`${pos[1]}px`,
                }}>

                <div className={style.contextItem} onClick={()=>{

                    setIsPasteMenu(false);
                    setConfirmPasteDialog(true);

                }}>Paste</div>


            </div>
            </div>
        }, [pos, isPasteMenu]
    )



    const [isHeaderContext, setIsHeaderContext] = useState(false);
    const headerContextUI = useMemo(
        ()=>{
            return <div onClick={()=>{setIsHeaderContext(false);}} onContextMenu={()=>setIsHeaderContext(false)} className={` ${style.contextCover} ${(isHeaderContext)?style.showPMenu:style.hidePMenu}` }>
                <div
                
                onClick={(event)=>event.stopPropagation()}
                
                className={style.contextMenu} style={{
                
                left:`${pos2[0]}px`,
                top:`${pos2[1]}px`,
                }}>

                <div className={style.contextItem} onClick={()=>{
                    setIsHeaderContext(false);
                    setIsClearCol(true);
                }}>Cut</div>


                <div className={style.contextItem} onClick={()=>{
                    setIsHeaderContext(false);
                    copyColumn(pasteDetails.col)
                }}>Copy</div>


                <div className={style.contextItem} onClick={()=>{
                    setIsHeaderContext(false);
                    setConfirmPasteDialog(true);
                }}>Paste</div>

                {
                    (pasteDetails.dataType=="number")?
                    <div className={style.contextItem} onClick={()=>{
                        setIsHeaderContext(false);
                        setIsMapDimension(true);
                    }}>Map to Dimension</div>:<></>
                }


                {
                    (pasteDetails.dataType=="number")? <HLine /> : <></>
                }


                {
                    (pasteDetails.dataType=="number")?
                        <div className={style.contextItem} onClick={()=>{
                            setIsHeaderContext(false);
                            setIsAddToCol(true);
                        }}>Add, Subtract or Multiply</div>:<></>
                }

            </div>
            </div>
        }, [pos2, pasteDetails, isHeaderContext]
    )



    const [isClearCol, setIsClearCol] = useState(false);
    const clearColumnUI = useMemo(()=>{
        return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="clearCol" items={ 
            <CutColumn
                pasteInfo={pasteDetails}
                onClose={()=>setIsClearCol(false)} 
                onCutColumn={()=>{
                    setIsClearCol(false);
                    cutColumn(pasteDetails.col)
                }} 
            /> 
        } 
        onClose={ ()=>{ setIsClearCol(false); } }
        dialogState={isClearCol}
      />
    }, [isClearCol] )


    const [isAddToCol, setIsAddToCol] = useState(false);
    const addToColumnUI = useMemo(()=>{
        return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="addToCol" items={ 
            <AddToColumn
                pasteInfo={pasteDetails}
                onClose={()=>setIsAddToCol(false)} 
                onAddSubtract={(colIndex, operator, preventOverflow, marks)=>{
                    setIsAddToCol(false);
                    addSubtractColumn(colIndex, operator, preventOverflow, marks)
                }}
            /> 
        } 
        onClose={ ()=>{ setIsAddToCol(false); } }
        dialogState={isAddToCol}
      />
    }, [isAddToCol] )



    const [isMapDimension, setIsMapDimension] = useState(false);
    const mapDimensionUI = useMemo(()=>{
        return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="mapDimension" items={ 
            <MapDimension
                pasteInfo={pasteDetails}
                onClose={()=>setIsMapDimension(false)} 
                onMapRange={(colIndex, fromRange, toRange )=>{
                    setIsMapDimension(false);
                    mapColumn(colIndex, fromRange, toRange );
                }}
            /> 
        } 
        onClose={ ()=>{ setIsMapDimension(false) } }
        dialogState={isMapDimension}
      />
    }, [isMapDimension] )



    const dashboard = useMemo(
        ()=>{
            return <ResultDashboard 
            onFireUpdate={
                (mode)=>{ 
                    if(mode=="*"){onRefreshSheet()} 
                }
            }
            />
        }
    )


    // const contextBox = useMemo(

    //     ()=>{

    //         return <div className={` ${ style.boxCover } } ${(isShowContextMenu)?style.reveal:style.conceal} `}> 

    //         <div className={` ${style.boxContent } `} >

    //             <div className={style.controlX}><Num2 tooltipText="Number Selected" num={constants.selectedRows.length} />  </div>
    //             <HBar />

    //             <GButton onClick={()=>{

    //                 var objectsToDelete = [];
    //                 constants.selectedRows.forEach((row)=>{
    //                     objectsToDelete.push(constants.resultObject[row])
    //                 })

    //                 // if(objectsToDelete.length == constants.resultObject.length){
    //                 //     setConfirmDelRFile(true);
    //                 // }else{
    //                 //     setConfirmDelSelection(true)
    //                 // }

    //                 setConfirmDelSelection(true);

    //             }}  tooltip="Delete Selection" title='Delete' icon={<FaTrash size={12} />} />
                
    //             <Space/>
    //             <GButton onClick={()=>setConfirmClearSelection(true)}  tooltip="Clear Selection" title='Clear'  icon={<FaBroom size={13} />} />
    //             <Space/>
    //             <GButton  onClick={()=>setConfirmExportSelection(true)}  tooltip="Export Selection" title='Export'  icon={<FaFileExport size={13} />} />
                
    //             <Tippy  theme='tomato' delay={150} content="Close" placement='bottom'>
    //             <div  className={style.close} onClick={()=>{
    //                 constants.selectedRows.splice(0);
    //                 showSelectionControls(false);
    //                 onRefreshRows()
    //             }}> <FaCircleXmark/> </div>
    //             </Tippy>

    //         </div>

    //         </div>
    //     }, 
    // )


    function setPresentation(value){
        setPMode(value);
        try{
            resultPaneRef.current.setPresentation( value );
        }catch(e){ }
    }


    return(
            <div className={ style.pane }>


            {addNonExistingStudentUI}
            {deleteRFileUI}
            {delRowUI}
            {insertRowUI}
            {confirmExportSelectionUI}
            {confirmClearSelectionUI}
            {confirmDelSelectionUI}
            {addToColumnUI}
            {clearColumnUI}
            {headerContextUI}
            {pasteMenuUI}
            {confirmPasteUI}
            {mapDimensionUI}
            {confirmCloseSheet}
            {confirmSaveSheet}
            {infoBox}
            {replaceValueDialog}
            {aiconnectUI}
            { addRowUI }

            {/* {contextBox}        */}

            {openResult}
            {exportResult}
            {newResult}
            {addRow}

            <SelectionControls 
                ref={selectionControlsRef}
                onCloseSelection = { ()=>{ 
                    resultPaneRef.current.clearSelection();
                 } }
            />

            {/* TOOLBAR */}
            {( constants.resultName != "" )? toolbar : <></>}

            {
                ( constants.resultName != ""  )?
            
                <div className={ (pMode)?style.pMode:style.offPMode }>

                {(pMode)? 
                    <div className={style.pModeCover}>
                    <div className={style.pModeControl} onClick={()=>{ 
                            setPresentation(false);
                            var root = document.documentElement;
                            root.style.setProperty( '--presentationDragMargin', '7px' );
                            root.style.setProperty( '--presentationDragHeight', '35px' );
                        }}>
                        <FaXmark />
                    </div> 
                    </div> : <></>
                }


                {/* RESULT HEADER */}
                {resultHeader}

                {/* RESULT ROWS */}
                {
                
                    (constants.resultObject.length>0)? 

                        resultPane 

                        : 

                        <div className={style.empty} style={{paddingTop:"15vh", display:"flex", flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                            
                            <NoData icon={<FaFile size={70}/> } body='No rows to display at the moment. Please add rows.' />
                            
                            <div style={{ display:"flex", justifyContent:'center', alignItems:'center'}}>
                        
                            <Button onClick={()=>setAddRowDialog(true) } title='Add Rows' /> 
                            <Space/>
                            <Button onClick={()=>onConnectDialog() } title='Add via AI Assist' />

                            </div>

                        </div>
                        
                }

            </div>
            
            : <></>
            
            }

            {( constants.resultName === "" )?dashboard:<></>}

            </div>

)
};

export default Result;
