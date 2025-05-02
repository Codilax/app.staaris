
import {  FaFolderOpen, FaTrash } from 'react-icons/fa6';
import style from './archive-items.module.css'
import HBar from '../bar/hbar'
import constants from '../../constants';
import { NoData } from '../no-data';
import GButton from '../button/generic-button';
import { FaSearch } from 'react-icons/fa';
import Button from '../button/button';
import React, { useState } from 'react';
import { listFiles } from '@/utils/files';
import {StaarisAlert} from '../dialog/staaris-alert'

function ArchiveItems( { onRestore, onView, onDelete } ){

    const [refresh, setRefresh] = useState();
    
    const [ alertState, setAlertState] = useState( false );
    const [ title, setTitle] = useState( "" );
    const [ body, setBody] = useState( "" );

    async function refreshData(){

        var data = await listFiles( constants.dir_archives, false );
        data.sort(  (a , b)=> (b.ctimeMS - a.ctimeMS)  );
        constants.existingArchivesList = data;
        setRefresh(Math.random());

        if(data.length <= 0){
             alertStaaris("Archives", "There are no archived results at the moment.");
        }
        
    }


    function alertStaaris(title,body){
        setTitle(title);
        setBody(body);
        setAlertState(true)
    }


    return(

        <div className={`${style.pane} `}>

            <StaarisAlert id="archiveitems098564" title={title} body={body} alertState={alertState} onClose={()=>setAlertState(false)} />

            {
            
            (constants.existingArchivesList.length>0)?constants.existingArchivesList.map(
                
                    (item, serial)=>{
                        return <div 
                        key={serial}
                        className={` ${style.archive}`}> 

                        <label className={style.serial}> { (serial+1)} </label> 
                        
                        <div className={style.archiveName}>  
                            <label className={style.friendlyName}> {item.name.replace(".staaris","")} </label> 
                            <label className={style.date}> {item.date} </label> 
                        </div>
                        

                        <GButton title="Restore" onClick={()=>{ 
                                onRestore(item.name); 
                            }} />
                        <div className='m-1' />
                        <GButton title="View" icon={<FaSearch/>} onClick={()=>{ onView(item.name) }} />


                        <HBar/>

                        <GButton title="Delete" icon={<FaTrash/>} onClick={()=>{ onDelete(item.name) }} />
                        

                        </div>
                    }
                
            )
        
            :

            <div style={{marginTop:"70px", display:"flex", alignItems:"center", flexDirection:"column"}}>
                <NoData icon={<FaFolderOpen size={60}/>} body="No archived results at the moment." />
                <Button title="Refresh" onClick={()=>{ refreshData() }} />
            </div>
            
        }
        </div>
    )

}
export default ArchiveItems;