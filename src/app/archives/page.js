'use client'

import { FaFolderClosed} from 'react-icons/fa6';
import style from './page.module.css';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import ArchiveItems from '../../component/archive-items/archive-items';

// import electron from 'electron';
import constants from '../../constants';
import { useRouter } from 'next/navigation';
import { FullDialogBase } from '../../component/dialog/full-dialog-base';
import Num2 from '../../component/num/num2';
import { InfoDialog } from '../../component/dialog/dialog-contents/infoDialog';
import { deleteFile, fileExist, listFiles, moveFile, read, sanitizeResultName } from '@/utils/files';
import ConfirmDialog from '@/component/settings-components/confirm-dialog';

function Archives({  }) {

    const router = useRouter();

    const [refresh, setRefresh] = useState();

    const [resultName, setResultName] = useState("");

    const [confirmDel, setConfirmDel] = useState(false); 
    const [confirmRestore, setConfirmRestore] = useState(false); 

    const [ infoDialog, setInfoDialog] = useState( false );
    const [ title, setTitle] = useState( "" );
    const [ body, setBody] = useState( "" );

    const isInit = useRef(false);


    function gotoPage(route){
        router.push(route, undefined, {shallow:true});
    }


    function onInfo(title,body){
        setTitle(title);
        setBody(body);
        setInfoDialog(true)
    }



    async function restore(rName){

        var fname = await sanitizeResultName(rName);
        var isDuplicate = await fileExist(constants.dir_results, fname );

        if(!isDuplicate){

            await moveFile(constants.dir_archives, constants.dir_results, fname );
            setTimeout( ()=>{ reloadData(); }, 400  )
            constants.shouldRefreshResultFileList = true;

        }else{
            onInfo("Warning", "Could not restore result. There is already a result with the same name as '" + rName.replace(".staaris","") + "' in 'Results'.")
        }
    }


    async function deleteArchive(rName){
        await deleteFile(constants.dir_archives, await sanitizeResultName(rName) );
        setTimeout( ()=>{ reloadData() }, 400  )
    }


    async function viewArchive(rName){


        var data = await read( constants.dir_archives, await sanitizeResultName(rName) );

        if( Object.keys(data).length > 1 ){

            constants.template = data.template;
            constants.templateName = data.templateName;

            constants.gradingSystem = {"passMark":data.passMark, "gradingSystem":data.gradingSystem};
            constants.gradingSystemName = data.gradingSystemName;

            constants.resultName = data.resultName;
            constants.resultObject = data.resultObject;
            constants.dateCreated = data.dateCreated;

            //neutralize selections
            constants.currentCol = -1;
            constants.currentFoundStudentIndex = -1;
            constants.currentRow = -1;
            constants.selectedColumn = data.selectedColumn;
            constants.currentFoundStudentIndex = data.currentFoundStudentIndex;
            constants.selectedRows = [];

            constants.saveToFolder = "archives";
            gotoPage('/results');
        }


    }



    async function reloadData() {
        
            var data = await listFiles( constants.dir_archives, false );
            data.sort(  (a , b)=> (b.ctimeMS - a.ctimeMS)  );
            constants.existingArchivesList = data;
            setRefresh(Math.random());
        
    }



    useEffect(
        ()=>{

            async function getData() {


                if(!isInit.current){

                    isInit.current = true;

                    var data = await listFiles( constants.dir_archives, false );
                    data.sort(  (a , b)=> (b.ctimeMS - a.ctimeMS)  );
                    constants.existingArchivesList = data;

                    setRefresh(Math.random());
    
                }   
                
            }

            getData();          

        },
    
        []
    )



    const infoBox = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isCenter="true" isScaleAnim="true" id="ArchinfoBox" items={ 
              <InfoDialog title={title} body={body} /> 
            } 
                onClose={ ()=>{ setInfoDialog(false); } }
                dialogState={infoDialog}
            />
        },[infoDialog]
      )




    //confirm close a result sheet
    const confirmDeletion = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isCenter={true} isScaleAnim="true" id="archdelBox2" items={ 
            
                <ConfirmDialog 
                
                title="Delete Archived Result" 
                subTitle={resultName.replace(".staaris","")} 
                body={"You are trying to delete the result '" + resultName.replace(".staaris","") + "'. Are you sure about this?"} 
                negative="Cancel" 
                positive="Delete" 

                onNegative={()=>setConfirmDel(false)} 
                onPositive={ async()=>{ setConfirmDel(false); await deleteArchive(resultName); }} />  
            
                } 
                onClose={ ()=>{ setConfirmDel(false); } }
                dialogState={confirmDel}
        />
    }, [confirmDel] )


    //confirm close a result sheet
    const confirmRestoration = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true"  isCenter={true} isScaleAnim="true" id="archrestoreBox" items={ 
            
                <ConfirmDialog 
                    title="Restore Result" 
                    subTitle={resultName.replace(".staaris","")}
                    body={"You are trying to restore the result '" + resultName.replace(".staaris","") + "'. Are you sure about this?"} 
                    negative="Cancel" 
                    positive="Restore" 
                    onNegative={()=>{setConfirmRestore(false);}} 
                    onPositive={()=>{ setConfirmRestore(false); restore(resultName); }} 
                />  } 

                onClose={ ()=>{ setConfirmRestore(false); } }
                dialogState={confirmRestore}
        />
    }, [confirmRestore] )



    return(

        <div className={` p-3 ${style.pane}`}>

            {infoBox}
            {confirmDeletion}
            {confirmRestoration}

        {/* GRADING SYSTEM */}
        <div className={` col-12 mt-0 mb-2`}>

        <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center" >
                <FaFolderClosed size={16} color="var(--black-text)" className="m-1"/>
                <label className={style.heading}>Archived Results </label>
            </div>
            <Num2 tooltipText="Number of items" num={constants.existingArchivesList.length} />
        </div>

        <ArchiveItems  
            onRestore={(rName)=>{ 
                setResultName(rName); 
                setConfirmRestore(true); 
            }} 

            onDelete={(rName)=>{  
                setResultName(rName); 
                setConfirmDel(true);  
            }}
            onView={(rName)=>{  
                setResultName(rName); 
                viewArchive(rName) 
            }}
        />


    </div>

        
    </div>

)
};

export default Archives;
