import { useEffect, useMemo, useState } from 'react';
import style from './open-result.module.css'
import Num2 from '../num/num2';
import HLine from '../num/line';
import { ExistingResultItems } from '../existing-result-items/existing-result-items';
import constants from '../../constants';
import { FaSync } from 'react-icons/fa';
import { FullDialogBase } from '../dialog/full-dialog-base';
import { RenameDialog } from '../settings-components/rename-dialog';
import { InfoDialog } from '../dialog/dialog-contents/infoDialog';
import { ConfirmSave } from '../dialog/dialog-contents/confirmSaveDialog';
import { deleteFile, fileExist, listFiles, moveFile, read, renameFile, sanitizeResultName, write } from '@/utils/files';
import ConfirmDialog from '../settings-components/confirm-dialog';


export function OpenResult( { onFireUpdate, openTrigger, onClose }){

    const [state, setState] = useState();
    const [refreshList, setRefreshList] = useState();
    const [resultName, setResultName] = useState("");
    const [confirmDel, setConfirmDel] = useState(false); 
    const [confirmArchive, setConfirmArchive] = useState(false); 
    const [confirmRename, setConfirmRename] = useState(false);
    const [ infoDialog, setInfoDialog] = useState( false );

    const [ title, setTitle] = useState( "" );
    const [ body, setBody] = useState( "" );


    useEffect( ()=>{ 

        setState(constants.shouldRefreshResultFileList); }, 

        [openTrigger] 
    )



  const [confirmSave, setConfirmSave] = useState(false);
  const confirmSaveUI = useMemo(()=>{
    return <FullDialogBase isCenter="true" isOpaque={true} isScaleAnim={true} isCloseButton={true} id="Save" 
    items={ 

        <ConfirmSave onSave={()=>{
            onSaveResult();
            setConfirmSave(false);
            setTimeout(()=>{ openResult(resultName); }, 500)
        }} 
        
        onClose={()=>{
            setConfirmSave(false);
            setTimeout(()=>{ openResult(resultName); }, 500)
        }} 
        
        onCancel={()=>{
            setConfirmSave(false);
        }} />
 
    } 
    onClose={ ()=>{ setConfirmSave(false); } }
    dialogState={confirmSave}
  />
  })




  const [confirmArchiveSave, setconfirmArchiveSave] = useState(false);
  const confirmArchiveSaveUI = useMemo(()=>{
    return <FullDialogBase isCenter="true" isOpaque={true} isScaleAnim={true} isCloseButton={true} id="aSave" 
    items={ 

        <ConfirmSave onSave={()=>{
            onSaveResult();
            setconfirmArchiveSave(false);
            setTimeout(()=>{ archiveResult(resultName) }, 500)
        }} 
        
        onClose={()=>{
            setconfirmArchiveSave(false);
            setTimeout(()=>{ archiveResult(resultName); }, 500)
        }} 
        
        onCancel={()=>{
            setconfirmArchiveSave(false);
        }} />
 
    } 
    onClose={ ()=>{ setconfirmArchiveSave(false); } }
    dialogState={confirmArchiveSave}
  />
  })



async function saveResultIPC( resultName, data ){
    var fname = sanitizeResultName(resultName);
    await write( constants.saveToFolder, fname, JSON.stringify(data ) );
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


//======================================================================


    //refresh button for result list
    async function onRefresh(){

        var data = await listFiles( constants.dir_results, false );
        data.sort(  (a , b)=> (b.ctimeMS - a.ctimeMS)  );
        constants.existingResultList = data;

        constants.shouldRefreshResultFileList = false;
        setState(false); 
        setRefreshList(Math.random()); 

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
        constants.isSaved = true;

        onFireUpdate("*");
    }



    async function deleteResult(rName){

        await deleteFile(constants.dir_results, rName )

        setTimeout( ()=>{ onRefresh(); }, 200  )

        if(rName === constants.resultName+".staaris"){ //also close
            closeResult()
        }

    }



    async function archiveResult(rName){

        var isDuplicate = await fileExist(constants.dir_archives, rName );
        if(!isDuplicate){

            await moveFile(constants.dir_results, constants.dir_archives, rName );

            setTimeout( ()=>{ onRefresh(); }, 200  )

            if(rName === constants.resultName+".staaris"){ closeResult() }

        }else{
            onInfo("Warning", "Could not archive result. There is already a result with the same name as '" + rName.replace(".staaris","") + "' in 'Archives'.")
        }


        
    }


    async function onRenameResult(oldName, newName){

        var suppliedName = sanitizeResultName(newName);
        var isDuplicate = await fileExist(constants.dir_results, suppliedName );

        if(!isDuplicate){
            
            await renameFile( constants.dir_results, oldName,  suppliedName )
    
            setConfirmRename(false);
            setTimeout( ()=>{ onRefresh(); }, 200  )

            if(oldName === constants.resultName+".staaris"){ //already open
                constants.resultName = newName;
                onFireUpdate("refresh") //so as not to close the dialog, but refresh
            }
    
          }else{
            onInfo("Warning", "Sorry, there is a result with the same name. Please choose a different name.")
          }



      }
    


    async function openResult(rName){

            onClose();

            var data = await read( constants.dir_results, rName );

            if( Object.keys(data).length > 3 ){

                constants.template = data.template;
                constants.templateName = data.templateName;

                constants.gradingSystem = {"passMark":data.passMark, "gradingSystem":data.gradingSystem};
                constants.gradingSystemName = data.gradingSystemName;

                constants.resultName = rName.substring(0, rName.lastIndexOf(".")); //ext removed
                constants.resultObject = data.resultObject;
                constants.dateCreated = data.dateCreated;

                //neutralize selections
                constants.currentCol = -1;
                constants.currentFoundStudentIndex = -1;
                constants.currentRow = -1;
                constants.selectedColumn = data.selectedColumn;
                constants.currentFoundStudentIndex = data.currentFoundStudentIndex;
                constants.selectedRows = [];

                constants.saveToFolder = "results";

                onFireUpdate("*");
            }
    }

    
  const renameUI = useMemo(()=>{
    return <FullDialogBase isCloseButton="true" isOpaque='true' isCenter={true} isScaleAnim="true" id="renameR2112" 
    items={ 
        <RenameDialog
            title="Rename Result"
            id="renameresult179365243"
            subTitle={ resultName.replace(".staaris","") }
            oldName={resultName.substring(0, resultName.lastIndexOf("."))}

            dialogState={confirmRename}
            onCancel={()=>{ setConfirmRename(false); }}

            onRename={(newName)=>{ 
                if(newName.length>0 && constants.resultName!=newName){
                    onRenameResult( resultName, newName);
                }
              }}
        /> 
      } 
      onClose={ ()=>{ setConfirmRename(false); } }
      dialogState={confirmRename}
    />

})


    const resultList = useMemo(()=>{
        return <div className={`d-flex flex-column ${style.resultBody} ${style.scroll}`}>
            <ExistingResultItems 

                onOpenResult={(rName)=>{ 

                    if(rName === constants.resultName+".staaris"){ //already open
                        try{
                            onClose()
                        }catch(e){ 

                            setResultName(rName);
                            if(constants.isSaved){
                                openResult(rName); 
                            }else{
                                setConfirmSave(true)
                            }
                        
                        }
                    }else{
                        
                        setResultName(rName);
                        if(constants.isSaved){
                            openResult(rName); 
                        }else{
                            setConfirmSave(true)
                        }

                    }
                
                }} 

                onDelete={(rName)=>{  setResultName(rName); setConfirmDel(true);  }}
                onArchive={(rName)=>{  

                    setResultName(rName);

                    if(rName === constants.resultName+".staaris" && !constants.isSaved){
                        setconfirmArchiveSave(true);
                    }else{
                        setConfirmArchive(true) 
                    }
                
                }}
                onRename={(rName)=>{  setResultName(rName); setConfirmRename(true); }}

            />
        </div>
    });


    

    //confirm close a result sheet
    const confirmDelete = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isOpaque='true'  isScaleAnim="true" id="delBox323" items={ <ConfirmDialog title="Delete Result" subTitle={resultName.replace(".staaris","")}  body={"You are trying to delete the result '" + resultName + "'. Are you sure about this?"} negative="Cancel" positive="Delete" onNegative={()=>setConfirmDel(false)} onPositive={()=>{ setConfirmDel(false); deleteResult(resultName); }} />  } 
                onClose={ ()=>{ setConfirmDel(false); } }
                dialogState={confirmDel}
        />
    } )


    //confirm close a result sheet
    const confirmArchiveUI = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isOpaque='true' isScaleAnim="true" id="archiveBox436" items={ 
                <ConfirmDialog 
                    title="Archive Result" 
                    subTitle={resultName.replace(".staaris","")}
                    body={"You are trying to archive the result '" + resultName + "'. Are you sure about this?"} 
                    negative="Cancel" positive="Archive" 
                    onNegative={()=>setConfirmArchive(false)} 
                    onPositive={()=>{ 
                        setConfirmArchive(false); 
                        archiveResult(resultName);
                    }} 
                />  } 
                onClose={ ()=>{ setConfirmArchive(false); } }
                dialogState={confirmArchive}
        />
    } )




    function onInfo(title,body){
        setTitle(title);
        setBody(body);
        setInfoDialog(true)
      }

      const infoBox = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isOpaque='true' isScaleAnim="true" id="infoBox454" items={ <InfoDialog title={title} body={body} /> } 
                onClose={ ()=>{ setInfoDialog(!infoDialog); } }
                dialogState={infoDialog}
            />
        }
    )


    return(

        <div className={`${style.menuItems}`} > 

            
            {confirmArchiveSaveUI}
            {confirmSaveUI}

            {confirmDelete}

            {confirmArchiveUI}

            {renameUI}

            {infoBox}

        
            {(state==true )? <div className={style.refreshPane}>
                <div onClick={()=>{  onRefresh() }} className={style.item}>
                    <div> <FaSync /> </div>
                    <label> Refresh Now </label>
                </div>
            </div>:<></>}
            
            <div className='d-flex align-items-center mb-1'>
                <label style={{marginRight:"15px"}} className='dialogTitle'>Open Result</label>
                <div className=' d-flex align-items-center'>
                    <Num2 num={constants.existingResultList.length} tooltipText="Number of results"/>
                </div>
            </div>

            <HLine />


            {resultList}
            

            </div>
    )
}

