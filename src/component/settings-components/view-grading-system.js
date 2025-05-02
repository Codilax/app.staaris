import { useEffect, useState } from 'react';
import Button from '../button/button';
import style from './view-grading-system.module.css'
import { FaChartColumn, FaPlus, FaTrash} from 'react-icons/fa6'
import Num2 from '../num/num2';
import TextIconButton from '../button/text-icon-button';
// import electron from 'electron';
import constants from '../../constants';
import HLine from '../num/line';
import { Input } from '../text-boxes/input';
import { Space } from '../space/space';
import { NoRows } from './no-rows';
import { write } from '@/utils/files';

// const ipcRenderer = electron.ipcRenderer || false;


function ViewGradingSystem( { gradeItems, dialogState, onUpdate, } ){


    const [ Alert, setAlert] = useState( "" );
    const [ grades, setGrades] = useState( [ ] );
    const [ num, setNum] = useState( 0 );
    const [ name, setName] = useState( "" );
    const [ passMark, setPassMark] = useState( 40 );

    
    useEffect(() => {
        
        if(gradeItems){

            if(dialogState){

                setGrades(gradeItems.content.gradingSystem);
                setPassMark(gradeItems.content.passMark);
                setName(gradeItems.name);
                setNum(gradeItems.content.gradingSystem.length);
                setAlert("");

            }else{

                setGrades([]);  
                setNum(0);
                setAlert("");
                setName("");
                setPassMark("");

            }

            
        }

    }, [dialogState] ); //run only when gradeItems.name has changed



    function getRowUI( item, index ){

        return <div key={index} className={`${style.gradeRow} ${gradeItems.source=="default"? style.disable:""}`}>
    
            <div className={style.index}>{item.index}</div>

            <input onChange={(event)=>{
    
                var index = (item.index-1); //make the index to start from 0
                var gr = grades[index];
                gr.min = event.target.value;

                setGrades(existing => {
                    return [
                      ...existing.slice(0, index),
                      gr,
                      ...existing.slice(index + 1),
                    ]
                })
    
    
            }} type='number' defaultValue={item.min} />


            <input onChange={(event)=>{
    
                var index = (item.index-1); //make the index to start from 0
                var grm = grades[index];

                grm.max = event.target.value;
                setGrades(existing => {
                    return [
                    ...existing.slice(0, index),
                    grm,
                    ...existing.slice(index + 1),
                    ]
                })

            }}  type='number' defaultValue={item.max} />


            <input onChange={(event)=>{
    
                var index = (item.index-1); //make the index to start from 0
                var gr = grades[index];
                gr.grade = event.target.value;

                setGrades(existing => {
                    return [
                    ...existing.slice(0, index),
                    gr,
                    ...existing.slice(index + 1),
                    ]
                })


            }} defaultValue={item.grade} />

        </div>
    }


    async function saveGradingSystemIPC(fileName, fileContent){

        await write(constants.dir_gradingSystems, fileName, JSON.stringify(fileContent) );
        // ipcRenderer.send( 'save-grading-system', fileName, fileContent );
    };


    return(

        <div className={`${style.menuItems}`} >
                
            <div style={{display:"flex", flexDirection:"column", marginRight:"20px", marginBottom:"5px"}}>
                <label className='dialogTitle'> {gradeItems.source=="default"? "View Grading System" : "View | Update Grading System"} </label>
                <label className={style.subtitle}>{name}</label>
            </div>

            <HLine />
            
        
        {
            (gradeItems.source=="default")? <div className='pt-2'></div> : 
            <div style={{marginTop:"8px"}} className={`d-flex mb-3 justify-content-between `}>

            <div className='d-flex'>

                <div style={{marginRight:"10px"}} className='d-flex align-items-center'>

                <TextIconButton 
                    
                    title="Add Row"
                    icon={ <FaPlus/> }
                
                    onClick={()=>{
                        if( gradeItems.source!="default" ){
                            var index = grades.length + 1;
                            setGrades( previous => [...previous, {'index':index, 'min':0, 'max':0, 'grade':'F'}] );
                            setNum(index);
                        }else{
                            setAlert("Default grading system can not be modified.");
                        }                       
                    }}
                
                />

                </div>
              

                <div style={{marginRight:"5px"}} className='d-flex align-items-center'>

                    <TextIconButton 
                        title="Remove Row"
                        icon={ <FaTrash/> }
                        onClick={()=>{

                            if( gradeItems.source!="default" ){
                                var newArray = grades.slice(0, grades.length-1);
                                var index = grades.length - 1;
                                setGrades( [...newArray] );
                                setNum(index);
                            }else{
                                setAlert("Default grading system can not be modified.");
                            }
                            
                        }}
                    />

                </div>

                <Num2 tooltipText="Number of grade category" num={num}/>
                
            </div>


            </div>
        }


        {(grades.length>0)?<div className={`${style.gradeHead} ${gradeItems.source=="default"? style.disable:""}`}>
        
            <label className={style.index}></label>
            <div>Minimum Score</div>
            <div>Maximum Score</div>
            <div>Grade</div>

        </div>:<></>}


        <div className={`${style.scroll} `}>
            {
                (grades.length>0)?
                    grades.map((item, index)=>{
                        return getRowUI(item, index)
                    })


                    :
                    <NoRows icon={<FaChartColumn/>} text='Please add rows' />

                
            }
        </div>


        {
            (Alert)? <label className={style.alert}>{Alert}</label> : <></>
        }
        
        
        <div className={`mt-3 d-flex justify-content-between align-items-center `}>


        <div>


        <label style={{color:"var(--black-text)", marginRight:"5px"}}>Pass Mark: </label>
        
        {gradeItems.source!="default"? <Input onChange={

            (value)=>{
                setPassMark(value);
            }
            } 
            type='number' 
            defaultValue={passMark} 
            placeholder='Update Pass Mark'
        />:
        
        <label style={{color:"var(--black-text)", marginRight:"5px"}}>{passMark}</label>
        
        }
        

        

        </div>

        <Space/><Space/>


        {
            (gradeItems.source=="default")? <></> : 
            <Button title="Update" onClick={()=>{

            if(gradeItems.source == "default"){
                setAlert("Default grading system can not be updated.");
                return;
            }

            if(grades.length>0 && name.length>0 && passMark!=""){

                const gradingFileContent = {
                    "passMark": passMark,
                    "gradingSystem": grades
                }


                //write to file
                saveGradingSystemIPC(name, gradingFileContent);

                setAlert("");

                const gs = {"name":name, "date": "Today", "ctimeMS": 0, "content": gradingFileContent } 
                
                //update constants
                const objectToUpdate = constants.gradingSystems.find((obj) => obj.name === name);

                if (objectToUpdate) {
                    Object.assign(objectToUpdate, gs);
                }

                onUpdate(name);

            }else{
                setAlert("Properly add the grading system.");
            }


            }} />
            
        }


        </div>
        
        
        </div>
    )
}

export default ViewGradingSystem;