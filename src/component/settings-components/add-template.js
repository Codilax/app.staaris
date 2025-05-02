import { useEffect, useState } from 'react';
import Button from '../button/button';
import style from './add-template.module.css'
import {FaCheck,FaPen, FaPlus,  FaTrash} from 'react-icons/fa6'
import constants from '../../constants';
import Nums from '../num/nums';
import TextIconButton from '../button/text-icon-button';
// import electron from 'electron';
import HLine from '../num/line';
import { Input } from '../text-boxes/input';
import { write } from '@/utils/files';

// const ipcRenderer = electron.ipcRenderer || false;

function AddTemplate( {onAdd, dialogState} ){

    var idCols = [
        { "key" : "serial", "name":"S/N",  "dataType":constants.numberColumn, "edit":false, "max": 0 }, 
        { "key" : "reg", "name":"STUDENT ID",  "dataType":constants.textColumn, "edit":true, "max": 0 }, 
        { "key" : "name", "name":"STUDENT NAME",  "dataType":constants.textColumn, "edit":true, "max": 0 }, //silence column
    ]


    var examCols = [
        //TOTAL OF CA
        { "key" : "ca", "name":"CA",  "dataType":constants.numberColumn, "edit":false, "max": 30 }, 

        //CONSTANT EXAM COMPONENTS
        { "key" : "exam", "name":"EXAM",  "dataType":constants.numberColumn, "edit":true, "max": 70 }, 
        { "key" : "total", "name":"TOTAL",  "dataType":constants.numberColumn, "edit":false, "max": 100 }, 
        { "key" : "grade", "name":"GRADE",  "dataType":constants.textColumn, "edit":false, "max": 0 }, 
        { "key" : "remark", "name":"REMARK",  "dataType":constants.numberColumn, "edit":false, "max": 0 }, 
    ]


    var [ templates, setTemplates] = useState( [
        ...idCols, ...examCols
    ] );


    var [ customCols, setCustomCols] = useState( [] );
    var [ duplicate, setDuplicate] = useState( false );

    var [ num, setNum] = useState( "" );
    var [ name, setName] = useState( "" );
    const [ Alert, setAlert] = useState( "" );


    useEffect(
        ()=>{
            if(dialogState){
                setTemplates( [ ...idCols, ...examCols ] )
            }else{
                setName("");
                setNum("0 of " + ((idCols.length + examCols.length)-1) );
                setAlert("");
                setCustomCols([]);
                setTemplates([]);
            }
        },
        [dialogState]
    )


    function validateColumnName(cname, ckey, index){
        var isValid = true;
        templates.forEach(
            (item, kindex)=>{

                if(kindex != index){
                    if(item.key.toLocaleLowerCase() == ckey.toLocaleLowerCase() || item.name.toLocaleLowerCase() == cname.toLocaleLowerCase() || cname.trim()==""){
                        isValid = false;
                    }
                }
                
            }
        )
        return isValid;
    }


    function getColUI(item, index ){

        var preCol = ['serial','reg','name','ca','exam','total','grade','remark']
        var preMax = ['serial','reg','name','ca','total','grade','remark']
        var noMaxCol = ['serial','reg','name','ca','total','grade','remark']

        return (item.key!="serial")? <div className={`${style.col} }`}>


            {
                (preCol.includes(item.key))?

                <div className={ style.pindex }>
                        <FaCheck size={10}/>
                        <div className='m-1'></div>
                        Column { (index)}
                </div>
            :
                <div className={ style.index }>
                        <FaPen size={10}/>
                        <div className='m-1'></div>
                        Column { (index) }
                </div>
            }


                {
                    (preCol.includes(item.key))?

                    <label className={`${style.name} `}> {item.name} </label>

                    :

                    <input placeholder='Column Name' className={` ${(duplicate)?style.duplicate:""}`}
                    
                    
                    onChange={(event)=>{

                        var cname = event.target.value;
                        var ckey = cname.toLowerCase().replace(" ", "").replace("\"","").replace("\'", "");

                        if(validateColumnName(cname, ckey, index)){

                            setDuplicate(false);

                            var grm = templates[index];
                            grm.name =cname;
                            grm.key = ckey;

                            setTemplates(existing => {
                                return [
                                ...existing.slice(0, index),
                                grm,
                                ...existing.slice(index + 1),
                                ]
                            })

                        }else{
                            setDuplicate(true);
                        }


                    }} type='text' defaultValue={item.name} />



                }
                

            {/* </Tippy> */}


            <div className={style.cnt}>

                <div className={style.colMax}>
                    { ( preMax.includes(item.key))?
                    <label className={style.predetermined}>Predetermined Column</label> : 
                    <label>Enter Maximum Value for {item.name}</label> }
                </div>


                {
                (noMaxCol.includes(item.key))?
                <></>

                :

                <input onChange={(event)=>{
    
                    var grm = templates[index];
                    grm.max = event.target.value;

                    setTemplates(existing => {
                        return [
                        ...existing.slice(0, index),
                        grm,
                        ...existing.slice(index + 1),
                        ]
                    })
    
                }}  type='number' defaultValue={item.max} />

            }

            </div>

        </div>

        :

        <></>
    }


    function addCustomCol(index){
        var customData = { "key" : "custom"+index, "name":"Custom Column Name" + index,  "dataType":constants.numberColumn, "edit":true, "max": 0 };

        var array = customCols;
        array.push(customData);

        setCustomCols(array);

        setTemplates( [...idCols, ...customCols, ...examCols] );

        var len = customCols.length + " of " + ( (customCols.length+idCols.length+examCols.length)-1 );
        setNum(len);
    }

    
    function removeCustomCol(){

        var newArray = customCols.slice(0, customCols.length-1);
        setCustomCols( newArray );

        setTemplates( [...idCols, ...newArray, ...examCols] );

        var len = newArray.length + " of " + ( (newArray.length+idCols.length+examCols.length)-1 );
        setNum(len);
    }



    async function saveTemplateIPC(fileName, fileContent){
        await write(constants.dir_templates, fileName, JSON.stringify(fileContent));
        // ipcRenderer.send( 'save-template', fileName, fileContent );
    };

    function saveTemplate() {

        if( name.length>0  ){

            if(!duplicate){

                saveTemplateIPC(name, templates);
            
                setAlert("");

                const gs = {"name":name, "date": "Today", "ctimeMS": 0, "content": templates } 
                
                constants.templates.push(gs);
                
                onAdd(name);

            }else{
                setAlert("Make sure that column names are unique and non-empty");
            }

        }else{
            setAlert("Provide the template file name");
        }
        
    }


    return(

        <div className={`${style.menuItems}`} > 
        
        <div className='d-flex align-items-center mb-2'>
            <label className='dialogTitle'>Define Result Columns (template)</label>
            
        </div>
        
        <HLine/>

        <div className='d-flex mb-3 mt-2 justify-content-between'>

            <div className='d-flex align-items-center'>

                <div style={{marginRight:'10px'}} className='d-flex align-items-center'>

                    <TextIconButton 
                        title="Add Column"
                        icon={ <FaPlus/> }
                        onClick={()=>{
                            var index = templates.length-7
                            addCustomCol(index);
                        }}
                    />

                </div>
                

                <div style={{marginRight:'5px'}} className='d-flex align-items-center'>

                    <TextIconButton 
                        title="Remove Column"
                        icon={ <FaTrash/> }
                        onClick={()=>{
                            removeCustomCol();
                        }}
                    />
                    

                </div>

                <div style={{marginRight:'5px'}} className='d-flex align-items-center'>
                    <Nums tooltipText="Number of columns" num={num}/>
                </div>
                
                
            </div>

            <Input 

                onEnter={()=>{ saveTemplate(); }}
            
                onChange={
                (value)=>{
                    setName(value);
                }

            } className={style.nameInput} placeholder='Enter Template Name'/>


        </div>



        <div className={style.scroll}>
            {
            templates.map((item, index)=>{

                return <div key={index} className='d-flex'> 

                        {index>1? <div className={style.line2}></div> : <></>}

                        {getColUI(item, index)}
                        
                </div>
                
            })
            
            }
        </div>

        {
            (Alert)? <label className={style.alert}>{Alert}</label> : <></>
        }

        <label style={{color:"var(--black-text)", fontSize:"12px", marginTop:"6px"}}>Note: Columns with fainted colors are predefined by Staaris. Add and modify your custom column(s).</label>
        
        <div className='mt-3 d-flex justify-content-end'>
        <Button title="Save Template" onClick={()=>{

                saveTemplate();
                
            }} />
        </div>
        
        </div>
    )
}

export default AddTemplate;