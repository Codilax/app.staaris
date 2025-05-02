import { useEffect, useState } from 'react';
import Button from '../button/button';
import style from './add-template.module.css'
import {FaCheck, FaPen, FaPlus, FaTrash} from 'react-icons/fa6'

import constants from '../../constants';
import Nums from '../num/nums';
import TextIconButton from '../button/text-icon-button';
// import electron from 'electron';
import HLine from '../num/line';
import { write } from '@/utils/files';

// const ipcRenderer = electron.ipcRenderer || false;

function ViewTemplate( { onUpdate, dialogState, templateItems } ){

    var [ templates, setTemplates] = useState( [] );

     var [ idCols, setIdCols] = useState( [] );
     var [ examCols, setExamCols] = useState( [] );
     var [ customCols, setCustomCols] = useState( [] );

    var [ num, setNum] = useState( "" );
    var [ name, setName] = useState( "" );
    const [ alert, setAlert] = useState( "" );

    var [ duplicate, setDuplicate] = useState( false );


    useEffect(() => {


        if(dialogState){
            

            if(templateItems){
                setTemplates([]);
                setName(templateItems.name);
                setNum(templateItems.content.length-1);
                
                var lidCols = templateItems.content.filter( (item)=> (item.key=="serial" || item.key=="reg" || item.key=="name")  );
                
                var lcCols = templateItems.content.filter( (item)=> (item.key!="serial" && item.key!="reg" && item.key!="name" && item.key!="ca" && item.key!="exam" && item.key!="total" && item.key!="grade" && item.key!="remark" )  );
                
                var lexamCols = templateItems.content.filter( (item)=> (item.key=="ca" || item.key=="exam" || item.key=="total" || item.key=="grade" || item.key=="remark" )  );
    
                setTemplates([...lidCols, ...lcCols, ...lexamCols]);
                setCustomCols(lcCols);
                setIdCols(lidCols);
                setExamCols(lexamCols);
            }

            
        }else{
            setName("");
            setNum("0 of " + ((idCols.length + examCols.length)-1) );
            setAlert("");
            setCustomCols([]);
            setTemplates([]);
        }


    }, [dialogState] ); //run only when gradeItems.name has changed
    


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
                        <div style={{display:"flex", alignItems:"center"}}> <FaPen size={10}/> </div>
                        <label style={{marginLeft:"5px"}}> Column { (index)} </label>
                </div>
            }


                {
                    (preCol.includes(item.key))?

                    <label className={style.name}> {item.name} </label>

                    :

                    <input className={`${style.input} ${(duplicate)?style.duplicate:""}`}  defaultValue={item.name} placeholder='Update Column Name' onChange={(event)=>{
    
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


    
                    }} type='text' />

                }
                

            {/* </Tippy> */}


            <div className={style.cnt}>

                <div className={style.colMax}>
                    { ( preMax.includes(item.key))?
                    <label className={style.predetermined}>Predetermined Column</label> : 
                    <label>Maximum Value of {item.name}:</label> }
                </div>


                {
                (noMaxCol.includes(item.key))?
                <></>

                :

       
                <input defaultValue={item.max} onChange={(event)=>{
    
                    var grm = templates[index];
                    grm.max = event.target.value;

                    setTemplates(existing => {
                        return [
                        ...existing.slice(0, index),
                        grm,
                        ...existing.slice(index + 1),
                        ]
                    })
    
                }}  type='number' placeholder='Update Max Value' />

            }

            </div>

        </div>

        :

        <></>
    }


    function addCustomCol(){
        var customData = { "key" : "custom", "name":"Custom Name",  "dataType":constants.numberColumn, "edit":true, "max": 0 };

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


    return(

        <div className={`${style.menuItems}`} > 
        
        
            <div style={{display:"flex", flexDirection:"column"}}>
                <label className='dialogTitle'> {templateItems.source=="default"? "View Result Columns" : "View | Update Result Columns" } </label>
                <label className={style.subtitle}>{name}</label>
            </div>
            
        
        <HLine/>

        { 

        (templateItems.source=="default")? <div className='p-2'></div> :

        <div className={`d-flex mb-3  mt-3 justify-content-between `}>

            <div className='d-flex align-items-center'>

                <div style={{marginRight:'10px'}} className='d-flex align-items-center'>

                    <TextIconButton 
                        title="Add Column"
                        icon={ <FaPlus/> }
                        onClick={()=>{
                            addCustomCol();
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


        </div>
        
        }



        <div className={style.scroll}>
            {
            (templates.length>0)?templates.map((item, index)=>{

                return <div key={index} className={`d-flex  ${(templateItems.source=="default")?style.disabled:""} `}> 

                        {index>1? <div className={style.line2}></div> : <></>}

                        {getColUI(item, index)}
                        
                </div>
                
            }):<div style={{display:"flex", justifyContent:"center", width:"100%"}}>Please add result columns</div>
            
            }
        </div>

        {
            (alert)? <label className={style.alert}>{alert}</label> : <></>
        }


        <label style={{color:"var(--black-text)", fontSize:"12px", marginTop:"10px"}}>Note: Columns with fainted colors are predefined. Add and modify your custom column(s).</label>
        
        <div className={`mt-3 d-flex justify-content-end `}>
        



        
        {
            (templateItems.source=="default")? <></> :
            
            <Button title="Update Template" onClick={()=>{


            if( name.length>0  ){

                if(!duplicate){

                    saveTemplateIPC(name, templates);
                    
                    setAlert("");

                    const gs = {"name":name, "date": "Today", "ctimeMS": 0, "content": templates } 
                    
                    //update constants
                    const objectToUpdate = constants.templates.find((obj) => obj.name === name);

                    if (objectToUpdate) {
                        Object.assign(objectToUpdate, gs);
                    }
                    
                    onUpdate(name);

                }else{
                    setAlert("Make sure that column names are unique and non-empty");
                }

            }else{
                setAlert("Provide the template file name");
            }

                
            }} />
            
        }




        </div>
        
        </div>
    )
}

export default ViewTemplate;