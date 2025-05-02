import { useEffect, useState } from 'react';
import Button from '../button/button';
import style from './add-grading-system.module.css'
import {FaChartColumn, FaPlus, FaTrash} from 'react-icons/fa6'
import Num2 from '../num/num2';
import TextIconButton from '../button/text-icon-button';
// import electron from 'electron';
import constants from '../../constants';
import { Input } from '../text-boxes/input';
import HLine from '../num/line';
import { Space } from '../space/space';
import { NoRows } from './no-rows';
import { write } from '@/utils/files';

// const ipcRenderer = electron.ipcRenderer || false;


function AddGradingSystem( {dialogState, onAdd } ){

    const [ Alert, setAlert] = useState( "" );
    const [ grades, setGrades] = useState( [ ] );
    
    const [ num, setNum] = useState( 0 );

    const [ name, setName] = useState( "" );
    const [ passMark, setPassMark] = useState( 40 );

    useEffect(
        ()=>{
          setGrades([]);  
          setNum(0);
          setAlert("");
          setName("");
          setPassMark(40);
        }, 

        [dialogState]
    )

    function doAdd() {

        if(grades.length>0 && name.length>0 && passMark!=""){

            const gradingFileContent = {
                "passMark": passMark,
                "gradingSystem": grades
            }

            saveGradingSystemIPC(name, gradingFileContent);
            
            setAlert("");

          
            const gs = {"name":name, "date": "Today", "ctimeMS": 0, "content": gradingFileContent } 
            
            constants.gradingSystems.push(gs);
            
            onAdd(name);


        }else{
            setAlert("Properly add and name the grading system.");
        }
        
    }


    function getRowUI(item, index){

        return <div key={index} className={style.gradeRow}>
    
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
        await write(constants.dir_gradingSystems, fileName, JSON.stringify(fileContent));
    };


    return(

        <div className={`${style.menuItems}`} > 

        
        <div className='d-flex align-items-center mb-3'>
            <label className='dialogTitle'>New Grading System</label>
            <Num2 tooltipText='Number of grade category' num={num}/>
        </div>
        
        <HLine />

        <div className='d-flex mb-3 mt-3 justify-content-between'>

            <div className='d-flex'>

                <div style={{marginRight:"10px"}} className='d-flex align-items-center'>


                <TextIconButton 
                    
                    title="Add Row"
                    icon={ <FaPlus/> }
                
                    onClick={()=>{
                        var index = grades.length + 1;
                        setGrades( previous => [...previous, {'index':index, 'min':"0", 'max':"0", 'grade':'F'}] );

                        setNum(index);
                    }}
                
                />

                </div>
              

                <div style={{marginRight:"20px"}} className='d-flex align-items-center'>

                    <TextIconButton 
                        title="Remove Row"
                        icon={ <FaTrash/> }
                        onClick={()=>{
                            var newArray = grades.slice(0, grades.length-1);
                            var index = grades.length - 1;
                            setGrades( [...newArray] );
                            setNum(index);
                        }}
                    />

                </div>
                
            </div>


            <Input 

                onEnter={()=>doAdd()}
            
                onChange={
                (value)=>{
                    setName(value);
                }
            }  
            placeholder='Enter name for grading system'/>


        </div>


        {

            (grades.length>0)?
            
            <div className={style.gradeHead}>

            <label className={style.index}></label>
            <div>Minimum Score</div>
            <div>Maximum Score</div>
            <div>Grade</div>

            </div>

            :

            <></>
        
        }


        <div className={style.scroll}>

            {
            
            (grades.length>0)?grades.map((item, index)=>{
                return getRowUI(item, index)
            }):
            <NoRows icon={<FaChartColumn/>} text='Please add rows' />
            
            }

        </div>


        {
            (Alert)? <label className={style.alert}>{Alert}</label> : <></>
        }
        
        
        <div className='mt-3 d-flex justify-content-between align-items-center'>

    
    <div>
        <label style={{color:"var(--black-text)"}}>Pass Mark: </label>


       <Input 
       
            onChange={
            (value)=>{
                setPassMark(value);
            }

        } type='number' 
        
        defaultValue={passMark} 
        placeholder='Enter Pass Mark'/>


</div>

<Space/> <Space/>

        <Button title="Save" onClick={()=>{

            doAdd();


            }} />
        </div>
        
        
        </div>
    )
}

export default AddGradingSystem;