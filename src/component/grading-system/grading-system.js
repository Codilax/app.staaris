
import { FaFile, FaTrash } from 'react-icons/fa6';
import constants from '../../constants';
import style from './grading-system.module.css';
// import electron from 'electron';
import { useState } from 'react';
import {MdDriveFileRenameOutline} from 'react-icons/md';
import { RenameDialog } from '../settings-components/rename-dialog';
import Tippy from '@tippyjs/react';
import { FullDialogBase } from '../dialog/full-dialog-base';
import { NoData } from '../no-data';
import { deleteFile, listFiles, renameFile } from '@/utils/files';
import ConfirmDialog from '../settings-components/confirm-dialog';
import Button from '../button/button';
import { StaarisAlert } from '../dialog/staaris-alert';
// const ipcRenderer = electron.ipcRenderer || false;


export function GradingSystem( { selected, onSelect, onDelete } ){


    const [renameGrading, setRenameGrading] = useState(false);
    const [deleteGrading, setDeleteGrading] = useState(false);
    const [fileName, setFileName] = useState("");


    const [refresh, setRefresh] = useState();  
    const [ alertState, setAlertState] = useState( false );
    const [ title, setTitle] = useState( "" );
    const [ body, setBody] = useState( "" );

    async function refreshData(){

        var gr = await listFiles( constants.dir_gradingSystems, true );
        gr.sort(  ( a, b )=> (a.ctimeMS - b.ctimeMS)  );
        constants.gradingSystems = [ constants.nucGrading, constants.nbteGrading, constants.topfaithGrading ];
        constants.gradingSystems = [constants.nucGrading, constants.nbteGrading, constants.topfaithGrading, ...gr];

        setRefresh(Math.random());

        if(constants.gradingSystems.length <= 0){
                alertStaaris("Grading System", "There are no grading systems at the moment. Please add new grading system.");
        }
        
    }


    function alertStaaris(title,body){
        setTitle(title);
        setBody(body);
        setAlertState(true)
    }





    async function deleteGradingSystemIPC(fileName){
        await deleteFile(constants.dir_gradingSystems, fileName);
        // ipcRenderer.send( 'delete-grading-system', fileName);
    };

    async function renameGradingSystemIPC(oldName, newName){
        await renameFile(constants.dir_gradingSystems, oldName, newName);
        // ipcRenderer.send( 'rename-grading-system', oldName, newName);
    }

    return(

        <div className={`${style.gradingSystemPane} row `}>

        <StaarisAlert id={Math.random()} title={title} body={body} alertState={alertState} onClose={()=>setAlertState(false)} />
            
        <FullDialogBase isCenter={true} isCloseButton={true} isScaleAnim={true} id="deleteGrading" 
            items={ 
                    <ConfirmDialog
                        title="Delete Grading System"
                        subTitle={fileName}
                        body="You are trying to delete a grading system, are you sure about this?"
                        negative="Cancel"
                        positive="Delete"

                        onNegative={()=>{ setDeleteGrading(false); }}
                        onPositive={()=>{ 
                            //write to file
                            deleteGradingSystemIPC(fileName);
                            constants.gradingSystems.splice(constants.gradingSystems.findIndex(element => element.name === fileName), 1);
                            onDelete(fileName); 
                            setDeleteGrading(false);
                         }}
                    /> 
            } 

          onClose={ ()=>{ setDeleteGrading(false); } }
          dialogState={deleteGrading}
        />



            <FullDialogBase isCenter={true} isCloseButton={true} isScaleAnim={true} id="renameGrading" 
            items={ 
                    <RenameDialog
                        id={Math.random()}
                        title="Rename Grading System"
                        subTitle={fileName}
                        oldName={fileName}
                        dialogState={renameGrading}
                        onCancel={()=>{ setRenameGrading(false); }}
                        onRename={(newName)=>{ 

                            if(newName.length>0 && fileName!=newName){

                                renameGradingSystemIPC(fileName, newName);

                                var index = constants.gradingSystems.findIndex(element => element.name === fileName);
                                constants.gradingSystems[index].name = newName;

                                setRenameGrading(false);

                            }

                         }}
                    /> 
            } 

          onClose={ ()=>{ setRenameGrading(false); } }
          dialogState={renameGrading}
        />




            { (constants.gradingSystems.length>0)?constants.gradingSystems.map(
                
                    (item, index)=>{
                        return <div key={index} style={{maxWidth:"200px"}}

                            onClick={
                                ()=>{  onSelect( item )  }
                            }
                            className={`${style.gradingSystem} ${ ( selected==item.name )?style.selected : "" }`}> 
                            
                            <div style={{display:'flex',  flexDirection:'column'}}>
                                <label>{item.name} </label> 
                                <label className={style.label}>{item.date}</label>
                            </div>
                            
                            <div style={{flex:1}}></div>

                            {  item.source!="default" &&  <Tippy  theme='tomato' delay={50} content="Rename" placement='bottom'>
                                <div onClick={
                                    (event)=>{ 
                                        event.stopPropagation(); 
                                        setFileName(item.name);
                                        setRenameGrading(true);
                                    }
                                } className={style.rename}> <MdDriveFileRenameOutline /> </div>
                            </Tippy>}


                            

                            { item.source!="default" && <Tippy  theme='tomato' delay={50} content="Delete" placement='bottom'>
                                <div onClick={
                                    (event)=>{ 
                                        event.stopPropagation(); 
                                        setFileName(item.name);
                                        setDeleteGrading(true);
                                    }
                                } className={style.del}> <FaTrash /> </div>
                            </Tippy>}
                            



                        </div>
                    }
                
            ):
            

            <div style={{ display:"flex", alignItems:"center", flexDirection:"column"}}>
                <NoData icon={<FaFile size={60}/>} body="No grading system. Please add grading system." />
                <Button title="Refresh" onClick={()=>{ refreshData() }} />
            </div>
        
        
        }


        </div>
    )

}
export default GradingSystem;