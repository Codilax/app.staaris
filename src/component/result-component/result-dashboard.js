import { FaDownload, FaFolderOpen, FaPlus } from 'react-icons/fa6';
import style from './result-dashboard.module.css';
import NewResult from './new-result';
import { useMemo, useState } from 'react';
import { FullDialogBase } from '../dialog/full-dialog-base';
import { OpenResult } from './open-result';
import constants from '../../constants';
import { InfoDialog } from '../dialog/dialog-contents/infoDialog';
import { fileExist, getBaseName, openBox, read, readExt, removeExtension, sanitizeResultName, write } from '@/utils/files';


export function ResultDashboard({ onFireUpdate }){

    const [newRDialog, setNewRDialog] = useState(false); //new result dialog
    const [openRDialog, setOpenRDialog] = useState(false);

    const [ infoDialog, setInfoDialog] = useState( false );
    const [ title, setTitle] = useState( "" );
    const [ body, setBody] = useState( "" );


    async function saveResultIPC( resultName, data ){
        var fname = sanitizeResultName(resultName);
        await write( constants.dir_results, fname, JSON.stringify(data ) );
        // ipcRenderer.send( 'save-result', "results", resultName, data );
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
        constants.isSaved = true;
    }



    
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
                    onSaveResult();
                    onFireUpdate("*");

                }catch(e){
                    onInfo("Import Error", "Imported staaris file could not be parsed. Please make sure that this file is valid." );
                }

            }else{
                onInfo("Import Error", "Duplicate detected. A result with the same name already exist. Delete the existing result or modify the imported file name." );
            }
        }
    }


    function onInfo(title,body){
        setTitle(title);
        setBody(body);
        setInfoDialog(true)
      }



      const infoBox = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isCenter="true" isScaleAnim="true" id="infoBoxboard3" items={ 
              <InfoDialog title={title} body={body} /> 
            } 
                onClose={ ()=>{ setInfoDialog(false); } }
                dialogState={infoDialog}
            />
        }, [infoDialog]
      )



    function onOpenResult(){
        setOpenRDialog(true);
    }

    const newResult = useMemo(()=>{
        return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="newResult" items={ <NewResult onClose={()=>setNewRDialog(false)} onFireUpdate={(mode)=>{ setTimeout(()=>{onFireUpdate(mode);}, 300) }} />  } 
        onClose={ ()=>{ setNewRDialog(false); } }
        dialogState={newRDialog}
      />;
    }, [newRDialog])


    const openResult = useMemo(()=>{
        return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="openResult" items={ <OpenResult onClose={()=>setOpenRDialog(false)} openTrigger={Math.random()} onFireUpdate={(mode)=>{ setTimeout(()=>{onFireUpdate(mode);}, 300) }} />  } 
        onClose={ ()=>{ setOpenRDialog(false); } }
        dialogState={openRDialog}
      />;
    }, [openRDialog])


    
    return(

        <div className={style.content}>

            {newResult}

            {openResult}

            {infoBox}

            <div className={style.head}>
                <span className={style.welcome} >Welcome to</span>
                <label className={style.deap} > SMART Compute </label>
                <span className={style.feature} >SMART Search | SMART Entry | SMART Feedback | SMART Detect | SMART Backup </span>
                <span className={style.meaning} >Get started by creating a new result, opening an existing result or importing a Staaris result file.</span>
                
            </div>


            <div className={style.items}>

            <div onClick={()=>{  setNewRDialog(true); }} className={style.item}>
                <div> <FaPlus /> </div>
                <label> New </label>
            </div>

            <div onClick={()=>{ 
                    onOpenResult() 
                }} className={style.item}>
                <div> <FaFolderOpen /> </div>
                <label> Open </label>
            </div>

            <div onClick={()=>{
                onImportResult()
            }} className={style.item}>
                <div> <FaDownload /> </div>
                <label> Import </label>
            </div>
            </div>

        </div>


        
    )
}