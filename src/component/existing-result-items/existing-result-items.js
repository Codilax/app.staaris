
import { FaFolderClosed, FaTrashCan } from 'react-icons/fa6';
import style from './existing-result-items.module.css'
import HBar from '../bar/hbar'
import constants, { gradingSystem } from '../../constants';

import { useMemo, useState } from 'react';
import GButton from '../button/generic-button';
import { NoData } from '../no-data';
import { Space } from '../space/space';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import Button from '../button/button';
import { StaarisAlert } from '../dialog/staaris-alert';
import { listFiles } from '@/utils/files';

export function ExistingResultItems( { onOpenResult, onDelete, onArchive, onRename } ){


    const [ title, setTitle] = useState( "" );
    const [ body, setBody] = useState( "" );
    const [refresh, setRefresh] = useState();
    const [ alertState, setAlertState] = useState( false );

    async function refreshData(){

        var data = await listFiles( constants.dir_results, false );
        data.sort(  (a , b)=> (b.ctimeMS - a.ctimeMS)  );
        constants.existingResultList = data;

        setRefresh(Math.random());

        if(data.length <= 0){
                alertStaaris("Results", "There are no results at the moment. Please create a new result.");
        }
        
    }


    function alertStaaris(title,body){
        setTitle(title);
        setBody(body);
        setAlertState(true)
    }


    const list = useMemo(()=>{

        return <div className={`${style.pane}  `}>

        

        {
        
        (constants.existingResultList.length>0)?constants.existingResultList.map(
            
                (item, index )=>{
                    return <div key={index}
                    
                    className={` ${style.archive}`}> 


                    <label 
                    
                        onClick={(event)=>{
                            event.stopPropagation();
                            onOpenResult(item.name);
                        }}
                        
                        className={style.serial}> {index+1} 
                        
                    </label> 
                    
                    
                    <div 
                    
                        onClick={(event)=>{
                            event.stopPropagation();
                            onOpenResult(item.name);
                        }} 
                        
                        className={style.archiveName}>
                        <label className={style.friendlyName}> {item.name.replace(".staaris","")} </label> 
                        <label className={style.date}> {item.date} </label> 

                    </div>

                    

                    <div className='m-1' />

                    <GButton 
                        title="Open" 
                        onClick={(event)=>{
                            event.stopPropagation();
                            onOpenResult(item.name);
                        }} 
                    />

                        <Space/>

                    <GButton 
                        icon={<FaFolderClosed/>} 
                        title="Archive" 
                        onClick={(event)=>{
                            event.stopPropagation();
                            onArchive(item.name);
                        }} 
                    />

                    
                    <HBar/>


                    <GButton 
                        icon={<MdDriveFileRenameOutline size={14}/>} 
                        onClick={(event)=>{
                            event.stopPropagation();
                            onRename(item.name);
                        }} 
                    />

                    <GButton 
                        icon={<FaTrashCan size={14}/>} 
                        onClick={(event)=>{
                            event.stopPropagation();
                            onDelete(item.name);
                        }} 
                    />


                    </div>
                }
            
        )

        : 
        
        <div style={{display:"flex", alignItems:"center", flexDirection:"column"}}>
            <NoData icon={<FaFolderClosed size={60}/>} body="No result item found. Please create a new result." />
            <Button title="Refresh" onClick={()=>{ refreshData() }} />
        </div>

    }

    </div>
    })

    return(

        <div>
            <StaarisAlert id="existingri10295637" title={title} body={body} alertState={alertState} onClose={()=>setAlertState(false)} />
            {list}
        </div>
        
    )

}
