
import { FaFile, FaTrash } from 'react-icons/fa6';
import style from './templates.module.css'
import { useState } from 'react';
import constants from '../../constants';
import {MdDriveFileRenameOutline} from 'react-icons/md';

import { RenameDialog } from '../settings-components/rename-dialog';
import Tippy from '@tippyjs/react';
import { FullDialogBase } from '../dialog/full-dialog-base';
import { NoData } from '../no-data';
import { deleteFile, listFiles, renameFile } from '@/utils/files';
import ConfirmDialog from '../settings-components/confirm-dialog';
import { StaarisAlert } from '../dialog/staaris-alert';
import Button from '../button/button';


export function Templates( {selected, onSelect } ){

    const [deleteTemplate, setDeleteTemplate] = useState(false);
    const [renameTemplate, setRenameTemplate] = useState(false);

    const [fileName, setFileName] = useState("");


    const [refresh, setRefresh] = useState();
        
    const [ alertState, setAlertState] = useState( false );
    const [ title, setTitle] = useState( "" );
    const [ body, setBody] = useState( "" );

    async function refreshData(){


        var t = await listFiles( constants.dir_templates, true );
        t.sort(  ( a, b )=> (a.ctimeMS - b.ctimeMS)  );
        constants.templates = [ constants.nucTemplate, constants.topfaithTemplate];
        constants.templates = [ constants.nucTemplate, constants.topfaithTemplate, ... t];

        setRefresh(Math.random());

        if(constants.templates.length <= 0 ){
                alertStaaris("Templates", "There are no templates at the moment. Please add new template.");
        }
        
    }


    function alertStaaris(title,body){
        setTitle(title);
        setBody(body);
        setAlertState(true)
    }




    async function deleteTemplateIPC(fileName){
        await deleteFile(constants.dir_templates, fileName)
    };

    async function renameTemplateIPC(oldName, newName){
        await renameFile(constants.dir_templates, oldName, newName);
    }


    return(
        <div className={`${style.templatesPane} row d-flexxx slimScrollxx`}>

            <StaarisAlert id={Math.random()} title={title} body={body} alertState={alertState} onClose={()=>setAlertState(false)} />
            

            <FullDialogBase isCenter={true} isCloseButton={true} isScaleAnim={true} id="deleteTemplate" 
                items={ 
                        <ConfirmDialog
                            title="Delete Template"
                            subTitle={fileName}
                            body="You are trying to delete a template, are you sure about this?"
                            negative="Cancel"
                            positive="Delete"
                            onNegative={()=>{ setDeleteTemplate(false); }}
                            onPositive={()=>{ 
                                deleteTemplateIPC(fileName);
                                constants.templates.splice(constants.templates.findIndex(element => element.name === fileName), 1);
                                setDeleteTemplate(false); //close dialog
                            }}
                        /> 
                } 
                onClose={ ()=>{ setDeleteTemplate(false); } }
                dialogState={deleteTemplate}
            />

            <FullDialogBase isCenter={true} isCloseButton={true} isScaleAnim={true} id="renameTemplate" 
                items={ 
                    <RenameDialog
                        id={Math.random()}
                        title="Rename Template"
                        subTitle={fileName}
                        oldName={fileName}
                        dialogState={renameTemplate}
                        onCancel={()=>{ setRenameTemplate(false); }}
                        onRename={(newName)=>{ 
                            if(newName.length>0 && fileName!=newName){
                                renameTemplateIPC(fileName, newName);
                                var index = constants.templates.findIndex(element => element.name === fileName);
                                constants.templates[index].name = newName;
                                setRenameTemplate(false);
                            }
                         }}
                    /> 
                } 
                onClose={ ()=>{ setRenameTemplate(false); } }
                dialogState={renameTemplate}
            />


            {(constants.templates.length>0)?constants.templates.map(
                
                    (item)=>{
                        
                        return <div style={{maxWidth:"200px"}}
                        
                            key={ item.name }
                            onClick={ ()=>{
                                onSelect(item)
                            } }
                            className={`${style.template} ${( selected==item.name )? style.selected:"" }`}> 
                            

                            <div style={{display:'flex', whiteSpace:'nowrap', flex:"1", minWidth:'60px', flexDirection:'column'}}>
                                <label style={{cursor:'pointer'}}>{item.name} </label>
                                <label style={{cursor:'pointer', fontSize:'12px', fontStyle:'italic', marginTop:'7px'}}>{item.date} </label>
                            </div>
                            

                            {item.source!="default" && <Tippy  theme='tomato' delay={50} content="Rename" placement='bottom'>
                                <div onClick={
                                    (event)=>{ 
                                        event.stopPropagation(); 
                                        setFileName(item.name);
                                        setRenameTemplate(true);
                                    }
                                }  className={style.rename}> <MdDriveFileRenameOutline /> </div>
                            </Tippy>}

                            
                            { item.source!="default" &&  <Tippy  theme='tomato' delay={50} content="Delete" placement='bottom'>
                            <div onClick={
                                (event)=>{ 

                                    event.stopPropagation(); 
                                  
                                    setFileName(item.name);

                                    setDeleteTemplate(true);
  
                                }
                            } className={style.del}> <FaTrash /> </div>
                            </Tippy>}

                            


                        </div>
                    }
                
            ):

            
            <div style={{ display:"flex", alignItems:"center", flexDirection:"column"}}>
                <NoData icon={<FaFile size={60}/>} body="No templates. Please add a template." />
                <Button title="Refresh" onClick={()=>{ refreshData() }} />
            </div>
            
            
            }
        </div>
    )

}
export default Templates;