import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import style from './toolbar.module.css'
import Tippy from '@tippyjs/react';


import { FaBrain, FaBuffer, FaChartColumn, FaCirclePlus, FaClone,  FaDisplay,  FaDownload,  FaFileExport,FaFolderClosed,FaFolderOpen, FaLock, FaPlus, FaPlusMinus,  FaScaleBalanced, FaSort, FaStar, FaTableList, FaTrash} from 'react-icons/fa6'
import DialogBase from '../dialog/dialog-base';
import Num2 from '../num/num2';
import SmartPanel from '../smart-entry/smart-panel';
import MenuIcon from '../menu-icon/menu-icon';
import HLine from '../num/line';
import NewResult from '../result-component/new-result';
import { OpenResult } from '../result-component/open-result';
import { SortResult } from '../result-component/sort-result';
import { AddRow } from '../result-component/add-row';
import { ClearResults } from '../result-component/clear-results';
import { ExportResult } from '../result-component/export-result';
import { SummaryResults } from '../result-component/summary-results';
import { GradingSystem } from '../result-component/grading-system';
import constants from '../../constants';
import { FullDialogBase } from '../dialog/full-dialog-base';
import { MapColDialog } from '../dialog/dialog-contents/map-columns';
import { DuplicateCheck } from '../result-component/duplicate-check';
import Sum from '../num/sum';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { RenameDialog } from '../settings-components/rename-dialog';
import { InfoDialog } from '../dialog/dialog-contents/infoDialog';
import { ConfirmSave } from '../dialog/dialog-contents/confirmSaveDialog';
import { Loading } from '../loading/loading';
import SaveButton from '../button/save-button';
import { fileExist, getBaseName, openBox, readExt, removeExtension, renameFile, sanitizeResultName, write } from '@/utils/files';
import ConfirmDialog from '../settings-components/confirm-dialog';

// const ipcRenderer = electron.ipcRenderer || false;



const Toolbar = forwardRef((props, ref) => {

  // const [refresh, setRefresh] = useState("");
  const saveButtonRef = useRef(null);

  const [oDialog, setODialog] = useState(false);//app right menu

  const [operator, setOperator] = useState("+");
  const [operatorDialog, setOperatorDialog] = useState(false);

  const [newRDialog, setNewRDialog] = useState(false); //new result dialog
  const [openDialog, setOpenDialog] = useState(false); //new result dialog
  const [duplicateDialog, setDuplicateDialog] = useState(false);

  const [sortDialog, setSortDialog] = useState(false); //new result dialog
  const [addRowDialog, setAddRowDialog] = useState(false); //new result dialog
  const [clearDialog, setClearDialog] = useState(false); //new result dialog
  const [exportDialog, setExportDialog] = useState(false); //new result dialog
  const [summaryDialog, setSummaryDialog] = useState(false); //new result dialog
  const [gradingSystemDialog, setGradingSystemDialog] = useState(false); //new result dialog
  
  // const [connectDialog, setConnectDialog] = useState(false); //new result dialog


  const [gstat, setGStat] = useState({}); //new result dialog
  const [sstat, setSStat] = useState({}); //new result dialog


  const [ mapColDialog, setMapColDialog] = useState( false );
  const [mappedColumn, setMappedColumn] = useState({});
  const [loadedColumns, setLoadedColumns] = useState({});
  const [currentColumns, setCurrentColumns] = useState({});

  const [newResultObject, setNewResultObject] = useState([]);

  const [unique, setUnique] = useState([]);
  const [duplicate, setDuplicate] = useState([]);

  const [sum, setSum] = useState();
  const [confirmRename, setConfirmRename] = useState(false);
  
  const [ infoDialog, setInfoDialog] = useState( false );
  const [ title, setTitle] = useState( "" );
  const [ body, setBody] = useState( "" );

  const [ isLoading, setIsLoading] = useState( false );

  const [ src, setSRC] = useState( "" );
  const [ip, setIP] = useState( "" );
  
  

  useImperativeHandle(ref, () => ({
    onSave(){
      try{
        saveButtonRef.current.onSaved();
      }catch(e){}
    }
   }));



  function onNew(){
    setODialog(false);
    setNewRDialog(!newRDialog);
  }

  function onOpen(){
    setODialog(false);
    setOpenDialog(!openDialog);
  }

  function onSort(){
    setODialog(false);
    setSortDialog(!sortDialog);
  }

  function onPresentation(){
    setODialog(false);
    setTimeout(()=>{ props.isPresentation() }, 500)    
  }

  function onAddRow(){
    setODialog(false);
    setAddRowDialog(!addRowDialog);
  }

  function onClearResult(){
    setODialog(false);
    setClearDialog(!clearDialog);
  }

  function onExportResult(){
    setODialog(false);
    setExportDialog(!exportDialog);
  }


    //=================================================

    function getStat(){

      var totalStudent = constants.resultObject.length;
      var totalPresent = 0;
      var totalAbsent = 0;    //empty exams
      var totalPass = 0;
      var totalFail = 0;

      var gradeStat = {};
      constants.gradingSystem.gradingSystem.forEach( //init
          (item)=>{
              gradeStat[item.grade] = 0;
          }
      )

      constants.resultObject.forEach( //row
          (rowData, index)=>{
              if( (rowData['exam']+"").trim()==""){
                  totalAbsent = totalAbsent + 1;
              }else{
                  totalPresent = totalPresent + 1;
                  if( cleanValue( rowData['total'] ) >= constants.gradingSystem.passMark){
                      totalPass = totalPass + 1;
                  }else{
                      totalFail = totalFail + 1;
                  }

                  var whatGrade = rowData['grade'];
                  if( whatGrade!="" && whatGrade!="IR" ){
                      gradeStat[whatGrade] = ( cleanGValue( gradeStat[whatGrade] ) + 1 );
                  }
              }
          }
      )


      var passPercent = (totalPresent>0)? (totalPass/totalPresent)*100 : 0;
      var failPercent = (totalPresent>0)? (totalFail/totalPresent)*100 : 0;

      var studentStat = {
          "Total No. of Students": totalStudent,
          "Number Present": totalPresent  + " of " + totalStudent + " (" + ((totalPresent/totalStudent)*100) + "%)",
          "Number Absent": totalAbsent  + " of " + totalStudent + " (" + (((totalAbsent/totalStudent)*100)) + "%)",
          "Total Pass": totalPass + " of " + totalPresent + " (" + passPercent + "%)",
          "Total Fail": totalFail + " of " + totalPresent + " (" + failPercent + "%)",
      }

      setGStat(gradeStat);
      setSStat(studentStat);
  }



  function cleanValue(val){
      try{
          var v = parseFloat(val+"");
          return v;
      }catch(e){ return -1; }
  }

  function cleanGValue(val){
      try{
          if(val == undefined || val ==null || isNaN(val)){
              return 0;
          }else{
              var v = parseInt(val+"");
              return v;
          }
          
      }catch(e){ return 0; }
  }


  function cleanMValue(val){
    try{
        if(val == undefined || val == null || isNaN(val)){
            return "";
        }else{
            return val;
        }
    }catch(e){ return ""; }
  }
//============================================


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


function updateSaveButtonUI(){
  try{
    saveButtonRef.current.onSaved();
  }catch(e){}
}

async function onSaveResult(){

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

        constants.isSaved = true;
        updateSaveButtonUI();
    }

    async function saveResultIPC( resultName, data ){
        var fname = sanitizeResultName(resultName);
        await write( constants.saveToFolder, fname, JSON.stringify( data ) );
    };


  function onSummaryResult(){
    setODialog(false);
    getStat();
    setSummaryDialog(!summaryDialog);
  }

  function onGradingSystem(){
    setODialog(false);
    setGradingSystemDialog(!gradingSystemDialog);
  }



  //NO LONGER USED
  // function onConnectDialog(){

  //   ipcRenderer.send("get-connection");

  //   setODialog(false);

  //   ipcRenderer.once('on-get-connection', (event, data) => {
  //     setIP(data);
  //     if(data!="" && data!="127.0.0.1"){
  //       QR.toDataURL( data ).then((imgSrc)=>setSRC(imgSrc))
  //     }
  //     setConnectDialog(true);
  //   });

  // }



  
      async function onImportResult(){
  
          var path = await openBox(".staaris", "staaris" );
          if(path){
  
              var importedName = await getBaseName(path);
              var fname = await sanitizeResultName( importedName );
  
              var isDuplicate = await fileExist( constants.dir_results, fname );
  
              if(!isDuplicate){
  
                  try{
  
                      var data = JSON.parse( await readExt( path ) );
                      var rName = await removeExtension(importedName);

  
                      constants.template = data.template;
                      constants.templateName = data.templateName;

                      constants.gradingSystem = {"passMark":data.passMark, "gradingSystem":data.gradingSystem};
                      constants.gradingSystemName = data.gradingSystemName;

                      constants.resultName = rName;
                      constants.resultObject = data.resultObject;
                      constants.dateCreated = data.dateCreated;

                      //neutralize selections
                      constants.currentCol = -1;
                      constants.currentFoundStudentIndex = -1;
                      constants.currentRow = -1;
                      constants.selectedColumn = data.selectedColumn;
                      constants.currentFoundStudentIndex = data.currentFoundStudentIndex;
                      constants.selectedRows = [];

                      constants.shouldRefreshResultFileList = true;
                      constants.saveToFolder = "results";

                      await onSaveResult();

                      props.onFireUpdate("*"); //fire cell reconstruction for import

  
                  }catch(e){
                      onInfo("Import Error", "Imported staaris file could not be parsed. Please make sure that this file is valid." );
                  }
  
              }else{
                  onInfo("Import Error", "Duplicate detected. A result with the same name already exist. Delete the existing result or modify the imported file name." );
              }
  
          }
  
  
  
          // ipcRenderer.send( 'import-staaris' );
  
          // ipcRenderer.once('on-import-staaris', (event, fileName, data) => {
  
          // if( Object.keys(data).length > 3 ){
  
          //     ipcRenderer.send("is-duplicate", "results",  fileName );
  
          //     ipcRenderer.once('on-is-duplicate', (event, isDuplicate ) => {
  
          //         var rName = fileName.substring(0, fileName.lastIndexOf("."))
  
          //         if(!isDuplicate){
  
                      // constants.template = data.template;
                      // constants.templateName = data.templateName;
  
                      // constants.gradingSystem = {"passMark":data.passMark, "gradingSystem":data.gradingSystem};
                      // constants.gradingSystemName = data.gradingSystemName;
  
                      // constants.resultName = rName;
                      // constants.resultObject = data.resultObject;
                      // constants.dateCreated = data.dateCreated;
  
                      // //neutralize selections
                      // constants.currentCol = -1;
                      // constants.currentFoundStudentIndex = -1;
                      // constants.currentRow = -1;
                      // constants.selectedColumn = data.selectedColumn;
                      // constants.currentFoundStudentIndex = data.currentFoundStudentIndex;
                      // constants.selectedRows = [];
  
                      // constants.shouldRefreshResultFileList = true;
                      // constants.saveToFolder = "results";
                      // onSaveResult(); //fire cell reconstruction for import
                      // onFireUpdate("*");
  
          //             // rName = rName + "-" + new Date().getTime();
          //             // onInfo("Warning", "Result imported successfully, but the name was modified to avoid overriding an existing result." );
  
                  // }else{
                  //     onInfo("Import Error", "Duplicate detected. A result with the same name already exist. Delete the existing result or modify the imported file name." );
                  // }
  
                  
          //     })
              
          // }
          
          // });
  
      }
  

  

  async function appendResult(newResultObject, newCols){

    //loop newly loaded result
    newResultObject.forEach(
      (newResult)=>{
        var rowData = {};
        constants.template.forEach(
          (template)=>{
            if( newCols.includes( template.key ) ){
              rowData[template.key] = cleanMValue( newResult[ template.key ] )
            }else{
              rowData[template.key] = "";
            }
          }
        )//end of inner loop
        constants.resultObject.push(rowData);
      }//end of outer loop
    )

    constants.isSaved = false;
    props.onFireUpdate("recompute");

    return true;

  }//end of method



  
  //should recompute
  async function appendMappedResult(){

    var newCols = Object.keys(mappedColumn); //keys only

    //loop newly loaded result
    newResultObject.forEach(
      (newResult)=>{
        var rowData = {};
        constants.template.forEach(
          (template)=>{
            if( newCols.includes( template.key ) ){
              rowData[template.key] = cleanMValue( newResult[ mappedColumn[template.key] ] )
            }else{
              rowData[template.key] = "";
            }
          }
        )//end of inner loop
        constants.resultObject.push(rowData);
      }//end of outer loop
    )
    constants.isSaved = false;
    props.onFireUpdate("recompute");

    return true;

  }//end of method



  function updateMappedColumn(key, value) {
    const mCol = {...mappedColumn};
    mCol[key] = value;
    setMappedColumn(mCol);
  }
 


  function onMergeResult(){

    setConfirmMerge(false);

    //clear data
    setMappedColumn({});
    setLoadedColumns({});
    setCurrentColumns({});
    setNewResultObject({})

      // ipcRenderer.send( 'import-staaris' );

      // ipcRenderer.once('on-import-staaris', (event, path, data) => {

      //   if( Object.keys(data).length > 3 ){

      //     var loadedCol = {};
      //     data.template.forEach(
      //       (item)=>{
      //         loadedCol[item.key] = item.name;
      //       }
      //     )

      //     setLoadedColumns(loadedCol);
      //     var colKeys = Object.keys(loadedCol);

      //     if( checkCompatibility(colKeys) ){

      //       loading(true)
      //       setTimeout(async () => {
      //           var isDone = await appendResult(data.resultObject, colKeys);
      //           if(isDone){
      //               loading(false)
      //           }
      //       }, 500);           

      //     }else{

      //       var currentCol = {};
      //       var mCol = {};
      //       constants.template.forEach(
      //         (item)=>{
      //           mCol[item.key] = item.key;
      //           currentCol[item.key] = item.name;
      //         }
      //       )

      //       setCurrentColumns(currentCol);
      //       setMappedColumn(mCol);
      //       setNewResultObject(data.resultObject);

      //       //map columns before appending
      //       setMapColDialog(true);

      //     }

      //   }
      // }
      // )

  }


  



  async function checkDuplicate()
  {

      var duplicates = [];
      var uniques = [];
      var duplicateIndices = [];

      setUnique([])
      setDuplicate([])

      constants.resultObject.forEach(( existingResult, index )=>{

        if( existingResult['reg']+"".trim() != "" ){
          if(uniques.includes( existingResult['reg'].trim() )){
            duplicates.push( {"index": index+1, "reg": existingResult['reg'] } );
            duplicateIndices.push(index);
          }else{
              uniques.push(existingResult['reg'].trim())
          }
        }
          
      })

      setUnique(uniques);
      setDuplicate(duplicates)
      constants.duplicateStudents = duplicateIndices;

  
      setDuplicateDialog(true);
      props.onFireUpdate("refresh");

      return true;

  }




  function checkCompatibility(loadedColumns){

    if(constants.template.length != loadedColumns.length){
      return false;
    }

    for(var i=0; i<constants.template.length;i++){
      if( !loadedColumns.includes(constants.template[i]['key']) ){
        return false;
      }
    }

    return true;

  }



  async function onChooseOperator(op) {
    setOperatorDialog(false);
    setOperator(op);   
  }



//   function makeDate(d,m,y){
//     return getMonthString(m) + " " + d + ", " + y;
// }

// function getMonthString(month){
//     switch(month){

//         case 0: return "Jan";
//         case 1: return "Feb";
//         case 2: return "March";
//         case 3: return "April";
//         case 4: return "May";
//         case 5: return "June";
//         case 6: return "July";
//         case 7: return "Aug";
//         case 8: return "Sept";
//         case 9: return "Oct";
//         case 10: return "Nov";
//         case 11: return "Dec";
    
//         default: return "Jan";
//       }
// }



function onInfo(title,body){
  setTitle(title);
  setBody(body);
  setInfoDialog(true)
}




    async function onRenameResult(oldName, newName){

      var oldSanitized = sanitizeResultName(oldName);
      var suppliedName = sanitizeResultName(newName);
        
        var isDuplicate = await fileExist(constants.dir_results, suppliedName );

        if(!isDuplicate){

          await renameFile( constants.dir_results, oldSanitized,  suppliedName )

          constants.shouldRefreshResultFileList = true;
          constants.resultName = newName;

          setConfirmRename(false);
    
          }else{
            onInfo("Warning", "Sorry, there is a result with the same name. Please choose a different name.")
          }



      }



  async function onClear( isSNum, isSName ){

    var excemption = ["serial"];
    if(!isSNum){ excemption.push("reg") }
    if(!isSName){ excemption.push("name") }
    
    for(var row=0; row<constants.resultObject.length; row++){
        constants.template.forEach(
            (template)=>{

                if( !excemption.includes( template.key ) ){
                    if(template.key =="remark"){
                        constants.resultObject[row][template.key] = constants.incompleteResult;
                    }else{
                        constants.resultObject[row][template.key] = "";
                    }                        
                }

            }
        )
    }

    constants.isSaved = false;
    props.onFireUpdate("*")

    return true;

}


function canDo( callback, onError ){
  if( constants.resultObject.length>0 ){
     callback();
  }else{
     onInfo("Warning", onError);
  }
}

function onCheckDuplicate(){
  loading(true)
  setODialog(false);

  setTimeout(async () => {
      var isDone = await checkDuplicate();
      if(isDone){
          loading(false)
      }
  }, 500);
}



  const infoBox = useMemo(
    ()=>{
        return <FullDialogBase isCloseButton="true" isCenter="true" isScaleAnim="true" id="toolInfoBox" items={ 
          <InfoDialog title={title} body={body} /> 
        } 
            onClose={ ()=>{ setInfoDialog(false); } }
            dialogState={infoDialog}
        />
    }, [infoDialog]
  )


  //============================================ DIALOGS ===================================

  const menus = useMemo(()=>{

    return <DialogBase id="toolmenu" position={{"top":-20,"left":'right'}} items={

      <div className={style.menuItems}>

        <li onClick={ ()=>{ onNew() } } >  <FaPlus className={style.micon} /> <label className={style.grow}>New</label> <label className={style.fade}>Ctrl+N</label> </li>
        <li onClick={ ()=>{ onOpen() } } >  <FaFolderOpen className={style.micon} /> <label className={style.grow}>Open</label> <label className={style.fade}>Ctrl+O</label> </li>

          
          <li  onClick={ ()=>{ 

            setODialog(false);
            if(constants.isSaved){
              onImportResult()
            }else{
              setConfirmSave(true)
            }

            } } >  <FaDownload className={style.micon} /> <label>Import </label> 

          </li>

        

        <li onClick={ ()=>{ canDo( ()=>onExportResult(), "No result to export. Please add rows." ); } } >  <FaFileExport className={style.micon} /> <label className={style.grow}>Export <FaLock className={style.star} /> </label> <label className={style.fade}>Ctrl+E</label> </li>
         
        
        
        <HLine />
        

        <li onClick={ ()=>{ onAddRow() } } >  <FaCirclePlus className={style.micon} /> <label className={style.grow}>Add Rows</label> <label className={style.fade}>Ctrl++</label> </li>
        

        <div className={style.group}>
          <li onClick={ ()=>{ canDo( ()=>onSort(), "No result to sort. Please add rows." ) } } >  <FaSort className={style.micon} /> <label>Sort </label> </li>
          <li onClick={ ()=>{ canDo( ()=>onPresentation(), "No result at the moment. Please add rows." ) } } >  <FaDisplay className={style.micon} /> <label>Present</label> <label style={{marginLeft:"5px"}} className={style.fade}>(F5)</label> </li>
        </div>


        

        <li onClick={ ()=>{ canDo( ()=>onCheckDuplicate(), "No result at the moment. Please add rows." );  } } >  <FaClone className={style.micon} /> <label>Check Duplicates<FaLock className={style.star} /> </label> </li>
       

        <div className={style.group}>

          <li onClick={ ()=>{ setODialog(false); setConfirmMerge(true); } } >  <FaBuffer className={style.micon} /> <label>Merge</label> </li>
          
          <li onClick={ ()=>{ 
            
            canDo( ()=>onClearResult(), "No result to clear. Please add rows." );
            
            } } >  <FaTrash className={style.micon} /> <label>Clear</label> </li>
         </div>


         <HLine />


        <div className={style.group}>

          <li onClick={ ()=>{ setODialog(false); props.onAIDialog() } } >  <FaBrain className={style.micon} /> <label>AI Assist<FaLock className={style.star} /></label> </li>

          <li onClick={ ()=>{ setODialog(false); setConfirmRename(true) } } >  <MdDriveFileRenameOutline className={style.micon} /> <label>Rename</label> </li>
        </div>


        <HLine />
        
        <li onClick={ ()=>{ canDo( ()=>onSummaryResult(), "No result at the moment. Please add rows." ); } } >  <FaChartColumn className={style.micon} /> <label>Summary<FaLock className={style.star} /></label> </li>
        <li onClick={ ()=>{ onGradingSystem() } } >  <FaScaleBalanced className={style.micon} /> <label>Grading System </label> </li>
        <li onClick={ ()=>{ setODialog(false); setOperatorDialog(true); } } >  <FaPlusMinus className={style.micon} /> <label>Change Operator</label> </li>

        
      </div>
      } 
      onClose={ ()=>{ setODialog(false); } }
      dialogState={oDialog}
    />;
  }, [oDialog] )



  const renameUI = useMemo(()=>{
    return <FullDialogBase isCloseButton="true"  isCenter={true} isScaleAnim="true" id="toolrenameR" 
    items={ 
        <RenameDialog
            title="Rename Result"
            id="toolrenam0330912"
            subTitle={constants.resultName}
            oldName={constants.resultName}
            dialogState={confirmRename}
            onCancel={()=>{ setConfirmRename(false); }}
            onRename={(newName)=>{ 
                if(newName.length>0 && constants.resultName!=newName){
                    onRenameResult(constants.resultName, newName);
                }
              }}
        /> 
      } 
      onClose={ ()=>{ setConfirmRename(false); } }
      dialogState={confirmRename}
    />

}, [confirmRename] )




  const mapColumnUI = useMemo(
    ()=>{

        return <FullDialogBase isCenter={true} isCloseButton={true} isOpaqueCover={false}  isScaleAnim="true" id="toolChooseCol" items={ 
                 
            <MapColDialog 

                loadedColumns={loadedColumns}
                currentColumns={currentColumns}

                onClose={()=>setMapColDialog(false)} 

                onChanged={(key, value)=>{
                    var newValue = (value=="Not applicable")? key : value;
                    updateMappedColumn(key, newValue);
                  }
                }

                onAccept={()=>{
                  loading(true)
                  setMapColDialog(false);
                  setTimeout(async () => {
                      var isDone = await appendMappedResult();
                      if(isDone){
                          loading(false)
                      }
                  }, 500); 
                }}
                
            /> 
            } 

            onClose={ ()=>{ setMapColDialog(false); } }
            dialogState={mapColDialog}
        />
    }
)



const operatorDialogUI = useMemo(()=>{
  return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolop"  items={
      <div>

          <label style={{marginLeft:"16px", marginBottom:"5px"}} className='dialogTitle'>Change Operator</label>

          <HLine/>

          <div className={style.opItems}>
            <li className={(operator=="+")?style.selected: ""} onClick={()=>onChooseOperator("+")}>   <label>Addition</label> <span> + </span> </li>
            <li className={(operator=="*")?style.selected: ""} onClick={()=>onChooseOperator("*")}>   <label>Multiplication</label> <span> * </span> </li>
            <li className={(operator=="/")?style.selected: ""} onClick={()=>onChooseOperator("/")}>   <label>Division</label> <span> / </span> </li>
            <li className={(operator=="-")?style.selected: ""} onClick={()=>onChooseOperator("-")}>   <label>Subtraction</label>  <span> - </span> </li>
          </div>

      </div>
    
  } 
  onClose={ ()=>{
    setOperatorDialog(false); 
    } }
  dialogState={operatorDialog}
/>
}, [operatorDialog])



  const newResult = useMemo(()=>{
    return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolnewResult" items={ <NewResult onClose={()=>setNewRDialog(false)} onFireUpdate={(mode)=>{ setTimeout(()=>{props.onFireUpdate(mode);}, 500)  }} />  } 
    onClose={ ()=>{ setNewRDialog(false); } }
    dialogState={newRDialog}
  />;
  }, [newRDialog])


  const openResult = useMemo(()=>{
    return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolopenResult" items={ 
    <OpenResult 

      openTrigger={Math.random()} 
      onClose={()=>{ setOpenDialog(false)}} 
      
      onFireUpdate={(mode)=>{  
        setTimeout(()=>{ props.onFireUpdate(mode) }, 500) 
      }} 

    />} 
    onClose={ ()=>{ setOpenDialog(!openDialog); } }
    dialogState={openDialog}

  />;
  }, [openDialog])

  const sortResult = useMemo(()=>{
    return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolsortResult" items={ <SortResult onFireUpdate={(mode)=>{props.onFireUpdate(mode);setSortDialog(false);}} columnConfig={props.columnConfig} /> } 
    onClose={ ()=>{ setSortDialog(false); } }
    dialogState={sortDialog}
  />
  }, [sortDialog])

  const addRow = useMemo(()=>{
    return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="tooladdRow" items={ <AddRow onClose={()=>setAddRowDialog(false)} pid="toolAddRInfo"  onFireUpdate={(mode)=>{ setTimeout(()=>{props.onFireUpdate(mode);}, 500)  }}  /> } 
    onClose={ ()=>{ setAddRowDialog(false); } }
    dialogState={addRowDialog}
  />
  }, [addRowDialog])


  const clearResult = useMemo(()=>{

    return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolclearResult" items={ 

      <ClearResults 

        onClose={()=>setClearDialog(false)} 

        onClear={(isSNum, isSName)=>{

          loading(true);
          setClearDialog(false);

          setTimeout(async () => {
              var isDone = await onClear(isSNum, isSName);
              if(isDone){
                  loading(false)
              }
          }, 500);

        }}

        
        /> } 

      onClose={ ()=>{ setClearDialog(false); } }
      dialogState={clearDialog}
  />
  }, [clearDialog])



  //used to confirm save before importing a new result
  const [confirmSave, setConfirmSave] = useState(false);
  const confirmSaveUI = useMemo(()=>{
    return <FullDialogBase isCenter="true" isOpaque={true} isScaleAnim={true} isCloseButton={true} id="toolSave" 
    items={ 

        <ConfirmSave onSave={()=>{
            onSaveResult();
            setConfirmSave(false);
            setTimeout(()=>{ onImportResult(); }, 500)
        }} 
        
        onClose={()=>{
            setConfirmSave(false);
            setTimeout(()=>{ onImportResult() }, 500)
        }} 
        
        onCancel={()=>{
            setConfirmSave(false);
        }} />
 
    } 
    onClose={ ()=>{ setConfirmSave(false); } }
    dialogState={confirmSave}
  />
  }, [confirmSave] )





  const [confirmMerge, setConfirmMerge] = useState(false);
  const confirmMergeUI = useMemo(()=>{
    return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolmerge" 
    items={ 
      <ConfirmDialog 
        title='Merge Result'
        subTitle=""
        body='The newly loaded result will be appended to the current result. Is this what you want?'
        negative='Cancel'
        positive='Yes, continue'
        onNegative={()=>{ setConfirmMerge(false); }}
        onPositive={()=>{ onMergeResult() }} 
      /> 
    } 
    onClose={ ()=>{ setConfirmMerge(false); } }
    dialogState={confirmMerge}
  />
  }, [confirmMerge])




  const duplicateUI = useMemo(()=>{
    return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="tooldui" 
    items={ 
    
      <DuplicateCheck 
        duplicateList={duplicate} 
        onGoto={(index)=>{ 

          constants.selectedRows = [];
          constants.selectedRows.push( index - 1 );

          props.onGoto( index - 1 ) 
        
        }}

        onSelectDuplicates={()=>{

          setDuplicateDialog(false);

          constants.selectedRows = [];
          duplicate.forEach(
            (object)=>{
              constants.selectedRows.push( object.index - 1 )
            }
          )

          props.onSelectDuplicates()

        }}
      />  
    
    } 

    onClose={ ()=>{ setDuplicateDialog(false); } }
    dialogState={duplicateDialog}
  />
  }, [duplicateDialog])




  const summary = useMemo(()=>{
    return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolsummary" items={ <SummaryResults gstat={gstat} sstat={sstat} /> } 
    onClose={ ()=>{ setSummaryDialog(!summaryDialog); } }
    dialogState={summaryDialog}
  />
  }, [summaryDialog])

  const exportResult = useMemo(()=>{
    return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolexport" items={ <ExportResult resultName={constants.resultName} onExportFinished={()=>setExportDialog(false)} /> } 
          onClose={ ()=>{ setExportDialog(!exportDialog); } }
          dialogState={exportDialog}
        />
  }, [exportDialog])


  const gradingUsed = useMemo(()=>{
    return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolgradingSystem" items={ <GradingSystem resultName="" /> } 
    onClose={ ()=>{ setGradingSystemDialog(!gradingSystemDialog); } }
    dialogState={gradingSystemDialog}
  />
  }, [gradingSystemDialog])

  const smartPanel = useMemo(()=>{
    return <div className={`${style.scrollX} slimScroll` }> 
    <SmartPanel 
      
      operator={operator}

      onFindStudent={ (student)=>{
          props.onFindStudent(student) //just for scrolling update
      } } 

      onInsertValue={(newValue)=>{
        props.onInsertValue(newValue)
      }}

      onSumReady={(sum)=>{
        setSum(sum)
      }}
      
    />
</div>
  })



  const rightItemsUI = useMemo(()=>{
    return <div className={style.rPane}> 

    <Sum num={( !isNaN(sum) )? sum : "***" } />

    <Tippy  theme='tomato' delay={150} content={ `${constants.resultName} - ${constants.dateCreated} ${(constants.saveToFolder=="archives")?"(archived)":""}` } placement='bottom'>
      <div className={style.rName}> {(constants.saveToFolder=="archives")? <FaFolderClosed size={11} style={{marginRight:"3px", minWidth:"12px", minHeight:"12px"}}/> : <FaTableList size={11} style={{marginRight:"3px", minWidth:"12px", minHeight:"12px" }}/> } {  constants.resultName}</div>
    </Tippy>


    <SaveButton ref={saveButtonRef} title="Save" onClick={()=>{ onSaveResult() }} />

   
    <div style={{marginRight:"4px"}}></div>

    <Num2 num={props.studentNum} tooltipText="Number of rows" />
    <MenuIcon onMenu={()=>{

        props.onMenuOpen();
        setODialog(true)
      
      }} />

  </div>
  } )


  // const aiconnect = useMemo(()=>{
  //   return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolaiconnect2" items={ 
  //     <AIConnect psrc={src} pip={ip} /> 
  //   } 
  //   onClose={ ()=>{ setConnectDialog(!connectDialog); } }
  //   dialogState={connectDialog}
  // />
  // })

  function loading(state){
    setIsLoading(state);
  }





  return (
    <div  className={`${style.toolbar}`}>
      <Loading state={isLoading} />
      {menus}
      {confirmSaveUI}
      {renameUI}
      {operatorDialogUI}
      {newResult}
      {openResult}
      {sortResult}
      {addRow}
      {clearResult}
      {summary}
      {exportResult}
      {gradingUsed}
      {/* {aiconnect} */}
      {confirmMergeUI}
      {duplicateUI}

      {/* {confirmUpdateUI} */}
      
      {mapColumnUI}
      {smartPanel}
      {rightItemsUI}
      {infoBox}
    </div>
  );



 })
 
 Toolbar.displayName = "toolbar";
 
 export default Toolbar;





// function Toolbar( { onAIDialog, studentNum, columnConfig, onFindStudent, onInsertValue, onFireUpdate, isPresentation, onGoto, onSelectDuplicates, onMenuOpen } ) {

//   const [oDialog, setODialog] = useState(false);//app right menu

//   const [operator, setOperator] = useState("+");
//   const [operatorDialog, setOperatorDialog] = useState(false);

//   const [newRDialog, setNewRDialog] = useState(false); //new result dialog
//   const [openDialog, setOpenDialog] = useState(false); //new result dialog
//   const [duplicateDialog, setDuplicateDialog] = useState(false);

//   const [sortDialog, setSortDialog] = useState(false); //new result dialog
//   const [addRowDialog, setAddRowDialog] = useState(false); //new result dialog
//   const [clearDialog, setClearDialog] = useState(false); //new result dialog
//   const [exportDialog, setExportDialog] = useState(false); //new result dialog
//   const [summaryDialog, setSummaryDialog] = useState(false); //new result dialog
//   const [gradingSystemDialog, setGradingSystemDialog] = useState(false); //new result dialog
  
//   // const [connectDialog, setConnectDialog] = useState(false); //new result dialog


//   const [gstat, setGStat] = useState({}); //new result dialog
//   const [sstat, setSStat] = useState({}); //new result dialog


//   const [ mapColDialog, setMapColDialog] = useState( false );
//   const [mappedColumn, setMappedColumn] = useState({});
//   const [loadedColumns, setLoadedColumns] = useState({});
//   const [currentColumns, setCurrentColumns] = useState({});

//   const [newResultObject, setNewResultObject] = useState([]);

//   const [unique, setUnique] = useState([]);
//   const [duplicate, setDuplicate] = useState([]);

//   const [sum, setSum] = useState();
//   const [confirmRename, setConfirmRename] = useState(false);
  
//   const [ infoDialog, setInfoDialog] = useState( false );
//   const [ title, setTitle] = useState( "" );
//   const [ body, setBody] = useState( "" );

//   const [ isLoading, setIsLoading] = useState( false );

//   const [ src, setSRC] = useState( "" );
//   const [ip, setIP] = useState( "" );
  
//   const [refresh, setRefresh] = useState("");


//   function onNew(){
//     setODialog(false);
//     setNewRDialog(!newRDialog);
//   }

//   function onOpen(){
//     setODialog(false);
//     setOpenDialog(!openDialog);
//   }

//   function onSort(){
//     setODialog(false);
//     setSortDialog(!sortDialog);
//   }

//   function onPresentation(){
//     setODialog(false);
//     setTimeout(()=>{ isPresentation() }, 500)    
//   }

//   function onAddRow(){
//     setODialog(false);
//     setAddRowDialog(!addRowDialog);
//   }

//   function onClearResult(){
//     setODialog(false);
//     setClearDialog(!clearDialog);
//   }

//   function onExportResult(){
//     setODialog(false);
//     setExportDialog(!exportDialog);
//   }


//     //=================================================

//     function getStat(){

//       var totalStudent = constants.resultObject.length;
//       var totalPresent = 0;
//       var totalAbsent = 0;    //empty exams
//       var totalPass = 0;
//       var totalFail = 0;

//       var gradeStat = {};
//       constants.gradingSystem.gradingSystem.forEach( //init
//           (item)=>{
//               gradeStat[item.grade] = 0;
//           }
//       )

//       constants.resultObject.forEach( //row
//           (rowData, index)=>{
//               if( (rowData['exam']+"").trim()==""){
//                   totalAbsent = totalAbsent + 1;
//               }else{
//                   totalPresent = totalPresent + 1;
//                   if( cleanValue( rowData['total'] ) >= constants.gradingSystem.passMark){
//                       totalPass = totalPass + 1;
//                   }else{
//                       totalFail = totalFail + 1;
//                   }

//                   var whatGrade = rowData['grade'];
//                   if( whatGrade!="" && whatGrade!="IR" ){
//                       gradeStat[whatGrade] = ( cleanGValue( gradeStat[whatGrade] ) + 1 );
//                   }
//               }
//           }
//       )


//       var passPercent = (totalPresent>0)? (totalPass/totalPresent)*100 : 0;
//       var failPercent = (totalPresent>0)? (totalFail/totalPresent)*100 : 0;

//       var studentStat = {
//           "Total No. of Students": totalStudent,
//           "Number Present": totalPresent  + " of " + totalStudent + " (" + ((totalPresent/totalStudent)*100) + "%)",
//           "Number Absent": totalAbsent  + " of " + totalStudent + " (" + (((totalAbsent/totalStudent)*100)) + "%)",
//           "Total Pass": totalPass + " of " + totalPresent + " (" + passPercent + "%)",
//           "Total Fail": totalFail + " of " + totalPresent + " (" + failPercent + "%)",
//       }

//       setGStat(gradeStat);
//       setSStat(studentStat);
//   }



//   function cleanValue(val){
//       try{
//           var v = parseFloat(val+"");
//           return v;
//       }catch(e){ return -1; }
//   }

//   function cleanGValue(val){
//       try{
//           if(val == undefined || val ==null || isNaN(val)){
//               return 0;
//           }else{
//               var v = parseInt(val+"");
//               return v;
//           }
          
//       }catch(e){ return 0; }
//   }


//   function cleanMValue(val){
//     try{
//         if(val == undefined || val == null || isNaN(val)){
//             return "";
//         }else{
//             return val;
//         }
//     }catch(e){ return ""; }
//   }
// //============================================


// function makeDate(d,m,y){
//   return getMonthString(m) + " " + d + ", " + y;
// }

// function getMonthString(month){
//   switch(month){

//       case 0: return "Jan";
//       case 1: return "Feb";
//       case 2: return "March";
//       case 3: return "April";
//       case 4: return "May";
//       case 5: return "June";
//       case 6: return "July";
//       case 7: return "Aug";
//       case 8: return "Sept";
//       case 9: return "Oct";
//       case 10: return "Nov";
//       case 11: return "Dec";
  
//       default: return "Jan";
//     }
// }

// async function onSaveResult(){

//         var date = new Date();
//         var y = date.getFullYear();
//         var m = date.getMonth();
//         var d = date.getDate();


//         var resultData = {
//             "dateCreated": makeDate(d,m,y),
//             "templateName": constants.templateName,
//             "template": constants.template,
//             "passMark": constants.gradingSystem.passMark,
//             "gradingSystemName": constants.gradingSystemName,
//             "gradingSystem": constants.gradingSystem.gradingSystem,
//             "selectedColumn": constants.selectedColumn,
//             "currentFoundStudentIndex": constants.currentFoundStudentIndex,
//             "resultName": constants.resultName,
//             "resultObject": constants.resultObject,
//         }

//         //save result to file system
//         saveResultIPC( constants.resultName, resultData );

//         constants.isSaved = true;
//         setRefresh(Math.random()); //triggger change on saved to update the save button
//     }

//     async function saveResultIPC( resultName, data ){
//         var fname = sanitizeResultName(resultName);
//         await write( constants.saveToFolder, fname, JSON.stringify( data ) );
//     };


//   function onSummaryResult(){
//     setODialog(false);
//     getStat();
//     setSummaryDialog(!summaryDialog);
//   }

//   function onGradingSystem(){
//     setODialog(false);
//     setGradingSystemDialog(!gradingSystemDialog);
//   }



//   //NO LONGER USED
//   // function onConnectDialog(){

//   //   ipcRenderer.send("get-connection");

//   //   setODialog(false);

//   //   ipcRenderer.once('on-get-connection', (event, data) => {
//   //     setIP(data);
//   //     if(data!="" && data!="127.0.0.1"){
//   //       QR.toDataURL( data ).then((imgSrc)=>setSRC(imgSrc))
//   //     }
//   //     setConnectDialog(true);
//   //   });

//   // }



  
//       async function onImportResult(){
  
//           var path = await openBox(".staaris", "staaris" );
//           if(path){
  
//               var importedName = await getBaseName(path);
//               var fname = await sanitizeResultName( importedName );
  
//               var isDuplicate = await fileExist( constants.dir_results, fname );
  
//               if(!isDuplicate){
  
//                   try{
  
//                       var data = JSON.parse( await readExt( path ) );
//                       var rName = await removeExtension(importedName);

  
//                       constants.template = data.template;
//                       constants.templateName = data.templateName;

//                       constants.gradingSystem = {"passMark":data.passMark, "gradingSystem":data.gradingSystem};
//                       constants.gradingSystemName = data.gradingSystemName;

//                       constants.resultName = rName;
//                       constants.resultObject = data.resultObject;
//                       constants.dateCreated = data.dateCreated;

//                       //neutralize selections
//                       constants.currentCol = -1;
//                       constants.currentFoundStudentIndex = -1;
//                       constants.currentRow = -1;
//                       constants.selectedColumn = data.selectedColumn;
//                       constants.currentFoundStudentIndex = data.currentFoundStudentIndex;
//                       constants.selectedRows = [];

//                       constants.shouldRefreshResultFileList = true;
//                       constants.saveToFolder = "results";

//                       await onSaveResult();

//                       onFireUpdate("*"); //fire cell reconstruction for import

  
//                   }catch(e){
//                       onInfo("Import Error", "Imported staaris file could not be parsed. Please make sure that this file is valid." );
//                   }
  
//               }else{
//                   onInfo("Import Error", "Duplicate detected. A result with the same name already exist. Delete the existing result or modify the imported file name." );
//               }
  
//           }
  
  
  
//           // ipcRenderer.send( 'import-staaris' );
  
//           // ipcRenderer.once('on-import-staaris', (event, fileName, data) => {
  
//           // if( Object.keys(data).length > 3 ){
  
//           //     ipcRenderer.send("is-duplicate", "results",  fileName );
  
//           //     ipcRenderer.once('on-is-duplicate', (event, isDuplicate ) => {
  
//           //         var rName = fileName.substring(0, fileName.lastIndexOf("."))
  
//           //         if(!isDuplicate){
  
//                       // constants.template = data.template;
//                       // constants.templateName = data.templateName;
  
//                       // constants.gradingSystem = {"passMark":data.passMark, "gradingSystem":data.gradingSystem};
//                       // constants.gradingSystemName = data.gradingSystemName;
  
//                       // constants.resultName = rName;
//                       // constants.resultObject = data.resultObject;
//                       // constants.dateCreated = data.dateCreated;
  
//                       // //neutralize selections
//                       // constants.currentCol = -1;
//                       // constants.currentFoundStudentIndex = -1;
//                       // constants.currentRow = -1;
//                       // constants.selectedColumn = data.selectedColumn;
//                       // constants.currentFoundStudentIndex = data.currentFoundStudentIndex;
//                       // constants.selectedRows = [];
  
//                       // constants.shouldRefreshResultFileList = true;
//                       // constants.saveToFolder = "results";
//                       // onSaveResult(); //fire cell reconstruction for import
//                       // onFireUpdate("*");
  
//           //             // rName = rName + "-" + new Date().getTime();
//           //             // onInfo("Warning", "Result imported successfully, but the name was modified to avoid overriding an existing result." );
  
//                   // }else{
//                   //     onInfo("Import Error", "Duplicate detected. A result with the same name already exist. Delete the existing result or modify the imported file name." );
//                   // }
  
                  
//           //     })
              
//           // }
          
//           // });
  
//       }
  

  

//   async function appendResult(newResultObject, newCols){

//     //loop newly loaded result
//     newResultObject.forEach(
//       (newResult)=>{
//         var rowData = {};
//         constants.template.forEach(
//           (template)=>{
//             if( newCols.includes( template.key ) ){
//               rowData[template.key] = cleanMValue( newResult[ template.key ] )
//             }else{
//               rowData[template.key] = "";
//             }
//           }
//         )//end of inner loop
//         constants.resultObject.push(rowData);
//       }//end of outer loop
//     )

//     constants.isSaved = false;
//     onFireUpdate("recompute");

//     return true;

//   }//end of method



  
//   //should recompute
//   async function appendMappedResult(){

//     var newCols = Object.keys(mappedColumn); //keys only

//     //loop newly loaded result
//     newResultObject.forEach(
//       (newResult)=>{
//         var rowData = {};
//         constants.template.forEach(
//           (template)=>{
//             if( newCols.includes( template.key ) ){
//               rowData[template.key] = cleanMValue( newResult[ mappedColumn[template.key] ] )
//             }else{
//               rowData[template.key] = "";
//             }
//           }
//         )//end of inner loop
//         constants.resultObject.push(rowData);
//       }//end of outer loop
//     )
//     constants.isSaved = false;
//     onFireUpdate("recompute");

//     return true;

//   }//end of method



//   function updateMappedColumn(key, value) {
//     const mCol = {...mappedColumn};
//     mCol[key] = value;
//     setMappedColumn(mCol);
//   }
 


//   function onMergeResult(){

//     setConfirmMerge(false);

//     //clear data
//     setMappedColumn({});
//     setLoadedColumns({});
//     setCurrentColumns({});
//     setNewResultObject({})

//       // ipcRenderer.send( 'import-staaris' );

//       // ipcRenderer.once('on-import-staaris', (event, path, data) => {

//       //   if( Object.keys(data).length > 3 ){

//       //     var loadedCol = {};
//       //     data.template.forEach(
//       //       (item)=>{
//       //         loadedCol[item.key] = item.name;
//       //       }
//       //     )

//       //     setLoadedColumns(loadedCol);
//       //     var colKeys = Object.keys(loadedCol);

//       //     if( checkCompatibility(colKeys) ){

//       //       loading(true)
//       //       setTimeout(async () => {
//       //           var isDone = await appendResult(data.resultObject, colKeys);
//       //           if(isDone){
//       //               loading(false)
//       //           }
//       //       }, 500);           

//       //     }else{

//       //       var currentCol = {};
//       //       var mCol = {};
//       //       constants.template.forEach(
//       //         (item)=>{
//       //           mCol[item.key] = item.key;
//       //           currentCol[item.key] = item.name;
//       //         }
//       //       )

//       //       setCurrentColumns(currentCol);
//       //       setMappedColumn(mCol);
//       //       setNewResultObject(data.resultObject);

//       //       //map columns before appending
//       //       setMapColDialog(true);

//       //     }

//       //   }
//       // }
//       // )

//   }


  



//   async function checkDuplicate()
//   {

//       var duplicates = [];
//       var uniques = [];
//       var duplicateIndices = [];

//       setUnique([])
//       setDuplicate([])

//       constants.resultObject.forEach(( existingResult, index )=>{

//         if( existingResult['reg']+"".trim() != "" ){
//           if(uniques.includes( existingResult['reg'].trim() )){
//             duplicates.push( {"index": index+1, "reg": existingResult['reg'] } );
//             duplicateIndices.push(index);
//           }else{
//               uniques.push(existingResult['reg'].trim())
//           }
//         }
          
//       })

//       setUnique(uniques);
//       setDuplicate(duplicates)
//       constants.duplicateStudents = duplicateIndices;

  
//       setDuplicateDialog(true);
//       onFireUpdate("refresh");

//       return true;

//   }




//   function checkCompatibility(loadedColumns){

//     if(constants.template.length != loadedColumns.length){
//       return false;
//     }

//     for(var i=0; i<constants.template.length;i++){
//       if( !loadedColumns.includes(constants.template[i]['key']) ){
//         return false;
//       }
//     }

//     return true;

//   }



//   async function onChooseOperator(op) {
//     setOperatorDialog(false);
//     setOperator(op);   
//   }



// //   function makeDate(d,m,y){
// //     return getMonthString(m) + " " + d + ", " + y;
// // }

// // function getMonthString(month){
// //     switch(month){

// //         case 0: return "Jan";
// //         case 1: return "Feb";
// //         case 2: return "March";
// //         case 3: return "April";
// //         case 4: return "May";
// //         case 5: return "June";
// //         case 6: return "July";
// //         case 7: return "Aug";
// //         case 8: return "Sept";
// //         case 9: return "Oct";
// //         case 10: return "Nov";
// //         case 11: return "Dec";
    
// //         default: return "Jan";
// //       }
// // }



// function onInfo(title,body){
//   setTitle(title);
//   setBody(body);
//   setInfoDialog(true)
// }




//     async function onRenameResult(oldName, newName){

//       var oldSanitized = sanitizeResultName(oldName);
//       var suppliedName = sanitizeResultName(newName);
        
//         var isDuplicate = await fileExist(constants.dir_results, suppliedName );

//         if(!isDuplicate){

//           await renameFile( constants.dir_results, oldSanitized,  suppliedName )

//           constants.shouldRefreshResultFileList = true;
//           constants.resultName = newName;

//           setConfirmRename(false);
    
//           }else{
//             onInfo("Warning", "Sorry, there is a result with the same name. Please choose a different name.")
//           }



//       }



//   async function onClear( isSNum, isSName ){

//     var excemption = ["serial"];
//     if(!isSNum){ excemption.push("reg") }
//     if(!isSName){ excemption.push("name") }
    
//     for(var row=0; row<constants.resultObject.length; row++){
//         constants.template.forEach(
//             (template)=>{

//                 if( !excemption.includes( template.key ) ){
//                     if(template.key =="remark"){
//                         constants.resultObject[row][template.key] = constants.incompleteResult;
//                     }else{
//                         constants.resultObject[row][template.key] = "";
//                     }                        
//                 }

//             }
//         )
//     }

//     constants.isSaved = false;
//     onFireUpdate("*")

//     return true;

// }


// function canDo( callback, onError ){
//   if( constants.resultObject.length>0 ){
//      callback();
//   }else{
//      onInfo("Warning", onError);
//   }
// }

// function onCheckDuplicate(){
//   loading(true)
//   setODialog(false);

//   setTimeout(async () => {
//       var isDone = await checkDuplicate();
//       if(isDone){
//           loading(false)
//       }
//   }, 500);
// }



//   const infoBox = useMemo(
//     ()=>{
//         return <FullDialogBase isCloseButton="true" isCenter="true" isScaleAnim="true" id="toolInfoBox" items={ 
//           <InfoDialog title={title} body={body} /> 
//         } 
//             onClose={ ()=>{ setInfoDialog(false); } }
//             dialogState={infoDialog}
//         />
//     }
//   )


//   //============================================ DIALOGS ===================================

//   const menus = useMemo(()=>{

//     return <DialogBase id="toolmenu" position={{"top":-20,"left":'right'}} items={

//       <div className={style.menuItems}>

//         <li onClick={ ()=>{ onNew() } } >  <FaPlus className={style.micon} /> <label className={style.grow}>New</label> <label className={style.fade}>Ctrl+N</label> </li>
//         <li onClick={ ()=>{ onOpen() } } >  <FaFolderOpen className={style.micon} /> <label className={style.grow}>Open</label> <label className={style.fade}>Ctrl+O</label> </li>

          
//           <li  onClick={ ()=>{ 

//             setODialog(false);
//             if(constants.isSaved){
//               onImportResult()
//             }else{
//               setConfirmSave(true)
//             }

//             } } >  <FaDownload className={style.micon} /> <label>Import </label> 

//           </li>

        

//         <li onClick={ ()=>{ canDo( ()=>onExportResult(), "No result to export. Please add rows." ); } } >  <FaFileExport className={style.micon} /> <label className={style.grow}>Export</label> <label className={style.fade}>Ctrl+E</label> </li>
         
        
        
//         <HLine />
        

//         <li onClick={ ()=>{ onAddRow() } } >  <FaCirclePlus className={style.micon} /> <label className={style.grow}>Add Rows</label> <label className={style.fade}>Ctrl++</label> </li>
        

//         <div className={style.group}>
//           <li onClick={ ()=>{ canDo( ()=>onSort(), "No result to sort. Please add rows." ) } } >  <FaSort className={style.micon} /> <label>Sort </label> </li>
//           <li onClick={ ()=>{ canDo( ()=>onPresentation(), "No result at the moment. Please add rows." ) } } >  <FaDisplay className={style.micon} /> <label>Present</label> <label style={{marginLeft:"5px"}} className={style.fade}>(F5)</label> </li>
//         </div>


        

//         <li onClick={ ()=>{ canDo( ()=>onCheckDuplicate(), "No result at the moment. Please add rows." );  } } >  <FaClone className={style.micon} /> <label>Check Duplicates</label> </li>
       

//         <div className={style.group}>

//           <li onClick={ ()=>{ setODialog(false); setConfirmMerge(true); } } >  <FaBuffer className={style.micon} /> <label>Merge</label> </li>
          
//           <li onClick={ ()=>{ 
            
//             canDo( ()=>onClearResult(), "No result to clear. Please add rows." );
            
//             } } >  <FaTrash className={style.micon} /> <label>Clear</label> </li>
//          </div>


//          <HLine />


//         <div className={style.group}>

//           <li onClick={ ()=>{ setODialog(false); onAIDialog() } } >  <FaBrain className={style.micon} /> <label>AI Assist</label> </li>

//           <li onClick={ ()=>{ setODialog(false); setConfirmRename(true) } } >  <MdDriveFileRenameOutline className={style.micon} /> <label>Rename</label> </li>
//         </div>


//         <HLine />
        
//         <li onClick={ ()=>{ canDo( ()=>onSummaryResult(), "No result at the moment. Please add rows." ); } } >  <FaChartColumn className={style.micon} /> <label>Summary</label> </li>
//         <li onClick={ ()=>{ onGradingSystem() } } >  <FaScaleBalanced className={style.micon} /> <label>Grading System </label> </li>
//         <li onClick={ ()=>{ setODialog(false); setOperatorDialog(true); } } >  <FaPlusMinus className={style.micon} /> <label>Change Operator</label> </li>

        
//       </div>
//       } 
//       onClose={ ()=>{ setODialog(false); } }
//       dialogState={oDialog}
//     />;
//   })



//   const renameUI = useMemo(()=>{
//     return <FullDialogBase isCloseButton="true"  isCenter={true} isScaleAnim="true" id="toolrenameR" 
//     items={ 
//         <RenameDialog
//             title="Rename Result"
//             subTitle={constants.resultName}
//             oldName={constants.resultName}
//             dialogState={confirmRename}
//             onCancel={()=>{ setConfirmRename(false); }}
//             onRename={(newName)=>{ 
//                 if(newName.length>0 && constants.resultName!=newName){
//                     onRenameResult(constants.resultName, newName);
//                 }
//               }}
//         /> 
//       } 
//       onClose={ ()=>{ setConfirmRename(false); } }
//       dialogState={confirmRename}
//     />

// })




//   const mapColumnUI = useMemo(
//     ()=>{

//         return <FullDialogBase isCenter={true} isCloseButton={true} isOpaqueCover={false}  isScaleAnim="true" id="toolChooseCol" items={ 
                 
//             <MapColDialog 

//                 loadedColumns={loadedColumns}
//                 currentColumns={currentColumns}

//                 onClose={()=>setMapColDialog(false)} 

//                 onChanged={(key, value)=>{
//                     var newValue = (value=="Not applicable")? key : value;
//                     updateMappedColumn(key, newValue);
//                   }
//                 }

//                 onAccept={()=>{
//                   loading(true)
//                   setMapColDialog(false);
//                   setTimeout(async () => {
//                       var isDone = await appendMappedResult();
//                       if(isDone){
//                           loading(false)
//                       }
//                   }, 500); 
//                 }}
                
//             /> 
//             } 

//             onClose={ ()=>{ setMapColDialog(false); } }
//             dialogState={mapColDialog}
//         />
//     }
// )



// const operatorDialogUI = useMemo(()=>{
//   return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolop"  items={
//       <div>

//           <label style={{marginLeft:"16px", marginBottom:"5px"}} className='dialogTitle'>Change Operator</label>

//           <HLine/>

//           <div className={style.opItems}>
//             <li className={(operator=="+")?style.selected: ""} onClick={()=>onChooseOperator("+")}>   <label>Addition</label> <span> + </span> </li>
//             <li className={(operator=="*")?style.selected: ""} onClick={()=>onChooseOperator("*")}>   <label>Multiplication</label> <span> * </span> </li>
//             <li className={(operator=="/")?style.selected: ""} onClick={()=>onChooseOperator("/")}>   <label>Division</label> <span> / </span> </li>
//             <li className={(operator=="-")?style.selected: ""} onClick={()=>onChooseOperator("-")}>   <label>Subtraction</label>  <span> - </span> </li>
//           </div>

//       </div>
    
//   } 
//   onClose={ ()=>{
//     setOperatorDialog(false); 
//     } }
//   dialogState={operatorDialog}
// />
// })



//   const newResult = useMemo(()=>{
//     return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolnewResult" items={ <NewResult onClose={()=>setNewRDialog(false)} onFireUpdate={(mode)=>{ setTimeout(()=>{onFireUpdate(mode);}, 500)  }} />  } 
//     onClose={ ()=>{ setNewRDialog(false); } }
//     dialogState={newRDialog}
//   />;
//   })


//   const openResult = useMemo(()=>{
//     return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolopenResult" items={ 
//     <OpenResult 

//       openTrigger={Math.random()} 
//       onClose={()=>{ setOpenDialog(false)}} 
      
//       onFireUpdate={(mode)=>{  
//         setTimeout(()=>{ onFireUpdate(mode) }, 500) 
//       }} 

//     />} 
//     onClose={ ()=>{ setOpenDialog(!openDialog); } }
//     dialogState={openDialog}

//   />;
//   })

//   const sortResult = useMemo(()=>{
//     return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolsortResult" items={ <SortResult onFireUpdate={(mode)=>{onFireUpdate(mode);setSortDialog(false);}} columnConfig={columnConfig} /> } 
//     onClose={ ()=>{ setSortDialog(false); } }
//     dialogState={sortDialog}
//   />
//   })

//   const addRow = useMemo(()=>{
//     return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="tooladdRow" items={ <AddRow onClose={()=>setAddRowDialog(false)} pid="toolAddRInfo"  onFireUpdate={(mode)=>{ setTimeout(()=>{onFireUpdate(mode);}, 500)  }}  /> } 
//     onClose={ ()=>{ setAddRowDialog(false); } }
//     dialogState={addRowDialog}
//   />
//   })


//   const clearResult = useMemo(()=>{

//     return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolclearResult" items={ 

//       <ClearResults 

//         onClose={()=>setClearDialog(false)} 

//         onClear={(isSNum, isSName)=>{

//           loading(true);
//           setClearDialog(false);

//           setTimeout(async () => {
//               var isDone = await onClear(isSNum, isSName);
//               if(isDone){
//                   loading(false)
//               }
//           }, 500);

//         }}

        
//         /> } 

//       onClose={ ()=>{ setClearDialog(false); } }
//       dialogState={clearDialog}
//   />
//   })



//   //used to confirm save before importing a new result
//   const [confirmSave, setConfirmSave] = useState(false);
//   const confirmSaveUI = useMemo(()=>{
//     return <FullDialogBase isCenter="true" isOpaque={true} isScaleAnim={true} isCloseButton={true} id="toolSave" 
//     items={ 

//         <ConfirmSave onSave={()=>{
//             onSaveResult();
//             setConfirmSave(false);
//             setTimeout(()=>{ onImportResult(); }, 500)
//         }} 
        
//         onClose={()=>{
//             setConfirmSave(false);
//             setTimeout(()=>{ onImportResult() }, 500)
//         }} 
        
//         onCancel={()=>{
//             setConfirmSave(false);
//         }} />
 
//     } 
//     onClose={ ()=>{ setConfirmSave(false); } }
//     dialogState={confirmSave}
//   />
//   })





//   const [confirmMerge, setConfirmMerge] = useState(false);
//   const confirmMergeUI = useMemo(()=>{
//     return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolmerge" 
//     items={ 
//       <ConfirmDialog 
//         title='Merge Result'
//         subTitle=""
//         body='The newly loaded result will be appended to the current result. Is this what you want?'
//         negative='Cancel'
//         positive='Yes, continue'
//         onNegative={()=>{ setConfirmMerge(false); }}
//         onPositive={()=>{ onMergeResult() }} 
//       /> 
//     } 
//     onClose={ ()=>{ setConfirmMerge(false); } }
//     dialogState={confirmMerge}
//   />
//   })




//   const duplicateUI = useMemo(()=>{
//     return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="tooldui" 
//     items={ 
    
//       <DuplicateCheck 
//         duplicateList={duplicate} 
//         onGoto={(index)=>{ 

//           constants.selectedRows = [];
//           constants.selectedRows.push( index - 1 );

//           onGoto( index - 1 ) 
        
//         }}

//         onSelectDuplicates={()=>{

//           setDuplicateDialog(false);

//           constants.selectedRows = [];
//           duplicate.forEach(
//             (object)=>{
//               constants.selectedRows.push( object.index - 1 )
//             }
//           )

//           onSelectDuplicates()

//         }}
//       />  
    
//     } 

//     onClose={ ()=>{ setDuplicateDialog(false); } }
//     dialogState={duplicateDialog}
//   />
//   })




//   const summary = useMemo(()=>{
//     return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolsummary" items={ <SummaryResults gstat={gstat} sstat={sstat} /> } 
//     onClose={ ()=>{ setSummaryDialog(!summaryDialog); } }
//     dialogState={summaryDialog}
//   />
//   })

//   const exportResult = useMemo(()=>{
//     return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolexport" items={ <ExportResult resultName={constants.resultName} onExportFinished={()=>setExportDialog(false)} /> } 
//           onClose={ ()=>{ setExportDialog(!exportDialog); } }
//           dialogState={exportDialog}
//         />
//   })


//   const gradingUsed = useMemo(()=>{
//     return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolgradingSystem" items={ <GradingSystem resultName="" /> } 
//     onClose={ ()=>{ setGradingSystemDialog(!gradingSystemDialog); } }
//     dialogState={gradingSystemDialog}
//   />
//   })

//   const smartPanel = useMemo(()=>{
//     return <div className={`${style.scrollX} slimScroll` }> 
//     <SmartPanel 
      
//       operator={operator}

//       onFindStudent={ (student)=>{
//           onFindStudent(student) //just for scrolling update
//       } } 

//       onInsertValue={(newValue)=>{
//         onInsertValue(newValue)
//       }}

//       onSumReady={(sum)=>{
//         setSum(sum)
//       }}
      
//     />
// </div>
//   })



//   const rightItemsUI = useMemo(()=>{
//     return <div className={style.rPane}> 

//     <Sum num={( !isNaN(sum) )? sum : "***" } />

//     <Tippy  theme='tomato' delay={150} content={ `${constants.resultName} - ${constants.dateCreated} ${(constants.saveToFolder=="archives")?"(archived)":""}` } placement='bottom'>
//       <div className={style.rName}> {(constants.saveToFolder=="archives")? <FaFolderClosed size={11} style={{marginRight:"3px", minWidth:"12px", minHeight:"12px"}}/> : <FaTableList size={11} style={{marginRight:"3px", minWidth:"12px", minHeight:"12px" }}/> } {  constants.resultName}</div>
//     </Tippy>


//     <SaveButton isAnimate={(constants.isSaved)? false:true} title="Save" onClick={()=>{ onSaveResult() }} />

   

//     <div style={{marginRight:"4px"}}></div>

//     <Num2 num={studentNum} tooltipText="Number of rows" />
//     <MenuIcon onMenu={()=>{

//         onMenuOpen();
//         setODialog(true)
      
//       }} />

//   </div>
//   })

//   // const aiconnect = useMemo(()=>{
//   //   return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="toolaiconnect2" items={ 
//   //     <AIConnect psrc={src} pip={ip} /> 
//   //   } 
//   //   onClose={ ()=>{ setConnectDialog(!connectDialog); } }
//   //   dialogState={connectDialog}
//   // />
//   // })

//   function loading(state){
//     setIsLoading(state);
//   }


  // return (
  //     <div  className={`${style.toolbar}`}>
  //       <Loading state={isLoading} />
  //       {menus}
  //       {confirmSaveUI}
  //       {renameUI}
  //       {operatorDialogUI}
  //       {newResult}
  //       {openResult}
  //       {sortResult}
  //       {addRow}
  //       {clearResult}
  //       {summary}
  //       {exportResult}
  //       {gradingUsed}
  //       {/* {aiconnect} */}
  //       {confirmMergeUI}
  //       {duplicateUI}

  //       {/* {confirmUpdateUI} */}
        
  //       {mapColumnUI}
  //       {smartPanel}
  //       {rightItemsUI}
  //       {infoBox}
  //     </div>
  // );
// };

// export default Toolbar;
