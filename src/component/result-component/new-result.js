import { useMemo, useState } from 'react';
import Button from '../button/button';
import style from './new-result.module.css'
import {FaCircleCheck, FaPlus, FaRegSquare} from 'react-icons/fa6'

import GButton from '../button/generic-button';
import HLine from '../num/line';
import { Chip } from '../cards/chip';
import SelectTemplates from './select-templates';
import SelectGradingSystem from './select-grading-system';
import { FullDialogBase } from '../dialog/full-dialog-base';
import { InfoDialog } from '../dialog/dialog-contents/infoDialog';
import constants, { template } from '../../constants';

// import electron from 'electron';
import Tippy from '@tippyjs/react';
import { PreviewDialog } from '../dialog/dialog-contents/previewDialog';
import { ChooseNewColDialog } from '../dialog/dialog-contents/choose-new-columns';
import { Loading } from '../loading/loading';
import { Input } from '../text-boxes/input';
import { FaCheckSquare } from 'react-icons/fa';
import { cvs2JSON, fileExist, openBox, sanitizeResultName, write } from '@/utils/files';
// const ipcRenderer = electron.ipcRenderer || false;


export function NewResult( { onFireUpdate, onClose } ){

    const [ previewDialog, setPreviewDialog] = useState( false );
    const [ chooseColDialog, setChooseColDialog] = useState( false );
    
    const [ infoDialog, setInfoDialog] = useState( false );
    const [ title, setTitle] = useState( "" );
    const [ body, setBody] = useState( "" );

    const [ numRows, setNumRows] = useState( 0 );
    const [ rName, setRName] = useState( "" );

    const [ selectTemplatesDialog, setSelectTemplatesDialog] = useState( false );
    const [ selectedTemplate, setSelectedTemplate] = useState( 
        {name:"", content:[]}
     );

     const [ selectGradingDialog, setSelectGradingDialog] = useState( false );
     const [ selectedGrading, setSelectedGrading] = useState( 
         {name:"", content:{passMark:40,gradingSystem:[]}}
    );
    
    
    const [ tab, setTab] = useState( 1 );
    const [ studentListPath, setStudentListPath] = useState( "C:\\Users\\..." );

    const [ studentListColumns, setStudentListColumns] = useState( [] );
    const [ cols, setCols] = useState( [] );

    const [ studentListData, setStudentListData] = useState( [] );
    const [ studentListFileType, setStudentListFileType] = useState( "" );
    
    
    const [ mappedReg, setMappedReg] = useState( "" );
    const [ mappedName, setMappedName] = useState( "" );
    const [ mappedAtt, setMappedAtt] = useState( "" );
    const [ isLoading, setIsLoading] = useState( false );

    
    const [ addLater, setAddLater] = useState( false );
    


    async function onReceiveStudentList(){

        var path = await openBox( "Load Student List", "csv" );
        
        if(path){

        var data = await cvs2JSON(path);

        setStudentListPath(path);
        
        //extract column names from the loaded student list
        if(data.length>0){
            setStudentListData(data)
            setStudentListColumns( Object.keys(data[0]) );
            setCols(Object.keys(data[0]))
            setStudentListFileType(path.substring(path.lastIndexOf('.')));
            setMappedReg("");
            setMappedName("");
            setMappedAtt("");
        }


    }

    }

    async function saveResultIPC( resultName, data ){
        var fname = sanitizeResultName(resultName);
        await write(constants.dir_results, fname, JSON.stringify(data));
        // ipcRenderer.send( 'save-result', "results", resultName, data );
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


    function getRegColOrMapped(){
        if( studentListColumns.includes('student_number') ){
            return "student_number";
        }else if(mappedReg!="" && mappedReg!="Not applicable"){
            return mappedReg;
        }else{
            return "";
        }
    }

    function getNameColOrMapped(){
        if( studentListColumns.includes('student_name') ){
            return "student_name";
        }else if(mappedName!="" && mappedName!="Not applicable"){
            return mappedName;
        }else{
            return "";
        }
    }

    function getAttColOrMapped(){
        if( studentListColumns.includes('attendance') ){
            return "attendance";
        }else if(mappedAtt!="" && mappedAtt!="Not applicable"){
            return mappedAtt;
        }else{
            return "";
        }
    }



    async function doWithStudent(){

        var regColName = getRegColOrMapped();
        var nameColName = getNameColOrMapped();
        var attColName = getAttColOrMapped();

        if(regColName!=""){

            var duplicate = await fileExist( constants.dir_results, rName+".staaris" );
            var isValid = validate();

            if(isValid){

                if( !duplicate ){

                    onClose();

                    constants.template = selectedTemplate.content;
                    constants.templateName = selectedTemplate.name;

                    constants.gradingSystem.passMark = selectedGrading.content.passMark;
                    constants.gradingSystem.gradingSystem = selectedGrading.content.gradingSystem;
                    constants.gradingSystemName = selectedGrading.name;

                    constants.resultName = rName;

                    makeResultObject( studentListData, constants.template, regColName, nameColName, attColName );


                    var date = new Date();
                    var y = date.getFullYear();
                    var m = date.getMonth();
                    var d = date.getDate();

                    var resultData = {
                        "dateCreated": makeDate(d,m,y),
                        "templateName": selectedTemplate.name,
                        "template": template,
                        "passMark": selectedGrading.content.passMark,
                        "gradingSystemName": selectedGrading.name,
                        "gradingSystem": selectedGrading.content.gradingSystem,
                        "selectedColumn": -1,
                        "currentFoundStudentIndex": -1,
                        "resultName": rName,
                        "resultObject": constants.resultObject,
                    }

                    //save result to file system
                    saveResultIPC(rName, resultData )

                    //neutralize selections
                    constants.currentCol = -1;
                    constants.currentFoundStudentIndex = -1;
                    constants.currentRow = -1;
                    constants.selectedColumn = -1;
                    constants.selectedRows = [];
                    
                    constants.shouldRefreshResultFileList = true;

                    constants.saveToFolder = "results";
                    onFireUpdate("*")

                }else{
                    onInfo("Warning", "Sorry, there is a result with the same name. Please choose a different name." );
                }


                // ipcRenderer.send("is-duplicate", "results",  rName+".staaris" );

                // ipcRenderer.once('on-is-duplicate', (event, isDuplicate ) => {

                    // if(!isDuplicate){

                    //     onClose();

                    //     constants.template = selectedTemplate.content;
                    //     constants.templateName = selectedTemplate.name;

                    //     constants.gradingSystem.passMark = selectedGrading.content.passMark;
                    //     constants.gradingSystem.gradingSystem = selectedGrading.content.gradingSystem;
                    //     constants.gradingSystemName = selectedGrading.name;

                    //     constants.resultName = rName;

                    //     makeResultObject( studentListData, constants.template, regColName, nameColName, attColName );


                    //     var date = new Date();
                    //     var y = date.getFullYear();
                    //     var m = date.getMonth();
                    //     var d = date.getDate();

                    //     var resultData = {
                    //         "dateCreated": makeDate(d,m,y),
                    //         "templateName": selectedTemplate.name,
                    //         "template": template,
                    //         "passMark": selectedGrading.content.passMark,
                    //         "gradingSystemName": selectedGrading.name,
                    //         "gradingSystem": selectedGrading.content.gradingSystem,
                    //         "selectedColumn": -1,
                    //         "currentFoundStudentIndex": -1,
                    //         "resultName": rName,
                    //         "resultObject": constants.resultObject,
                    //     }

                    //     //save result to file system
                    //     saveResultIPC(rName, resultData )

                    //     //neutralize selections
                    //     constants.currentCol = -1;
                    //     constants.currentFoundStudentIndex = -1;
                    //     constants.currentRow = -1;
                    //     constants.selectedColumn = -1;
                    //     constants.selectedRows = [];
                        
                    //     constants.shouldRefreshResultFileList = true;

                    //     constants.saveToFolder = "results";
                    //     onFireUpdate("*")

                    // }else{
                    //     onInfo("Warning", "Sorry, there is a result with the same name. Please choose a different name." );
                    // }

                // })
                
            }

        }else{
            onInfo("Warning","Please choose column name for Student Number.")
        }

        return true;
    } 


    function createResultFromList(){

        loading(true)

        setTimeout(async () => {
            var isDone = await doWithStudent()
            if(isDone){
                loading(false)
            }
        }, 500);
        
    }




    async function doBlank(){

        var duplicate = await fileExist( constants.dir_results, rName+".staaris" );
        var isValid = validateBlank();
        
        if(isValid){


            if( !duplicate ){

                onClose();

                constants.template = selectedTemplate.content;
                constants.templateName = selectedTemplate.name;
                constants.gradingSystem.passMark = selectedGrading.content.passMark;
                constants.gradingSystem.gradingSystem = selectedGrading.content.gradingSystem;
                constants.gradingSystemName = selectedGrading.name;
                constants.resultName = rName;
                makeBlankResultObject( numRows, constants.template );
                var date = new Date();
                var y = date.getFullYear();
                var m = date.getMonth();
                var d = date.getDate();
                var resultData = {
                    "dateCreated": makeDate(d,m,y),
                    "templateName": selectedTemplate.name,
                    "template": template,
                    "passMark": selectedGrading.content.passMark,
                    "gradingSystemName": selectedGrading.name,
                    "gradingSystem": selectedGrading.content.gradingSystem,
                    "selectedColumn": -1,
                    "currentFoundStudentIndex": -1,
                    "resultName": rName,
                    "resultObject": constants.resultObject,
                }

                //save result to file system
                saveResultIPC(rName, resultData )
                //neutralize selections
                constants.currentCol = -1;
                constants.currentFoundStudentIndex = -1;
                constants.currentRow = -1;
                constants.selectedColumn = -1;
                constants.selectedRows = [];
                constants.shouldRefreshResultFileList = true;
                constants.saveToFolder = "results";

                onFireUpdate("*");

            }else{
                onInfo("Warning", "Sorry, there is a result with the same name. Please choose a different name." );
            }



            // ipcRenderer.send("is-duplicate", "results",  rName+".staaris" );
            // ipcRenderer.once('on-is-duplicate', (event, isDuplicate ) => {
                // if(!isDuplicate){

                //     onClose();

                //     constants.template = selectedTemplate.content;
                //     constants.templateName = selectedTemplate.name;
                //     constants.gradingSystem.passMark = selectedGrading.content.passMark;
                //     constants.gradingSystem.gradingSystem = selectedGrading.content.gradingSystem;
                //     constants.gradingSystemName = selectedGrading.name;
                //     constants.resultName = rName;
                //     makeBlankResultObject( numRows, constants.template );
                //     var date = new Date();
                //     var y = date.getFullYear();
                //     var m = date.getMonth();
                //     var d = date.getDate();
                //     var resultData = {
                //         "dateCreated": makeDate(d,m,y),
                //         "templateName": selectedTemplate.name,
                //         "template": template,
                //         "passMark": selectedGrading.content.passMark,
                //         "gradingSystemName": selectedGrading.name,
                //         "gradingSystem": selectedGrading.content.gradingSystem,
                //         "selectedColumn": -1,
                //         "currentFoundStudentIndex": -1,
                //         "resultName": rName,
                //         "resultObject": constants.resultObject,
                //     }

                //     //save result to file system
                //     saveResultIPC(rName, resultData )
                //     //neutralize selections
                //     constants.currentCol = -1;
                //     constants.currentFoundStudentIndex = -1;
                //     constants.currentRow = -1;
                //     constants.selectedColumn = -1;
                //     constants.selectedRows = [];
                //     constants.shouldRefreshResultFileList = true;
                //     constants.saveToFolder = "results";

                //     onFireUpdate("*");

                // }else{
                //     onInfo("Warning", "Sorry, there is a result with the same name. Please choose a different name." );
                // } 
            // })
            
        }

        return true;
    }



    async function doEmpty(){


        var duplicate = await fileExist( constants.dir_results, rName+".staaris" );
        var isValid = validateEmpty();

        if(isValid){

            if( !duplicate ){

                onClose();
                    
                    constants.template = selectedTemplate.content;
                    constants.templateName = selectedTemplate.name;
                    constants.gradingSystem.passMark = selectedGrading.content.passMark;
                    constants.gradingSystem.gradingSystem = selectedGrading.content.gradingSystem;
                    constants.gradingSystemName = selectedGrading.name;
                    constants.resultName = rName;

                    makeEmptyResultObject();

                    var date = new Date();
                    var y = date.getFullYear();
                    var m = date.getMonth();
                    var d = date.getDate();
                    var resultData = {
                        "dateCreated": makeDate(d,m,y),
                        "templateName": selectedTemplate.name,
                        "template": template,
                        "passMark": selectedGrading.content.passMark,
                        "gradingSystemName": selectedGrading.name,
                        "gradingSystem": selectedGrading.content.gradingSystem,
                        "selectedColumn": -1,
                        "currentFoundStudentIndex": -1,
                        "resultName": rName,
                        "resultObject": constants.resultObject,
                    }

                    //save result to file system
                    saveResultIPC( rName, resultData )

                    //neutralize selections
                    constants.currentCol = -1;
                    constants.currentFoundStudentIndex = -1;
                    constants.currentRow = -1;
                    constants.selectedColumn = -1;
                    constants.selectedRows = [];
                    constants.shouldRefreshResultFileList = true;
                    constants.saveToFolder = "results";
                    onFireUpdate("*")

            }else{
                onInfo("Warning", "Sorry, there is a result with the same name. Please choose a different name." );
            }


            // ipcRenderer.send("is-duplicate", "results",  rName+".staaris" );
            // ipcRenderer.once('on-is-duplicate', (event, isDuplicate ) => {
            //     if(!isDuplicate){

                    // onClose();
                    
                    // constants.template = selectedTemplate.content;
                    // constants.templateName = selectedTemplate.name;
                    // constants.gradingSystem.passMark = selectedGrading.content.passMark;
                    // constants.gradingSystem.gradingSystem = selectedGrading.content.gradingSystem;
                    // constants.gradingSystemName = selectedGrading.name;
                    // constants.resultName = rName;

                    // makeEmptyResultObject();

                    // var date = new Date();
                    // var y = date.getFullYear();
                    // var m = date.getMonth();
                    // var d = date.getDate();
                    // var resultData = {
                    //     "dateCreated": makeDate(d,m,y),
                    //     "templateName": selectedTemplate.name,
                    //     "template": template,
                    //     "passMark": selectedGrading.content.passMark,
                    //     "gradingSystemName": selectedGrading.name,
                    //     "gradingSystem": selectedGrading.content.gradingSystem,
                    //     "selectedColumn": -1,
                    //     "currentFoundStudentIndex": -1,
                    //     "resultName": rName,
                    //     "resultObject": constants.resultObject,
                    // }

                    // //save result to file system
                    // saveResultIPC(rName, resultData )
                    // //neutralize selections
                    // constants.currentCol = -1;
                    // constants.currentFoundStudentIndex = -1;
                    // constants.currentRow = -1;
                    // constants.selectedColumn = -1;
                    // constants.selectedRows = [];
                    // constants.shouldRefreshResultFileList = true;
                    // constants.saveToFolder = "results";
                    // onFireUpdate("*")
                // }else{
                //     onInfo("Warning", "Sorry, there is a result with the same name. Please choose a different name." );
                // } 
            // })
            
        }

        return true;
    }



    
    function loading(state){
        setIsLoading(state);
    }

    

    function onCreateBlank(){
        loading(true)
        setTimeout(async () => {
            var isDone = await doBlank()
            if(isDone){
                loading(false)
            }
        }, 500);
    }



    function onCreateEmpty(){
        loading(true)
        setTimeout(async () => {
            var isDone = await doEmpty()
            if(isDone){
                loading(false)
            }
        }, 500);
    }

    


    //====================================================================
    async function makeBlankResultObject( numOfRows, template ){

        const resultObject = [];
        for(var index=0; index<numOfRows; index++){
            var rowData = {};
            template.forEach(
                (item)=>{
                    rowData[item.key] = "";
                }
            )
            resultObject.push(rowData);
        }
        constants.resultObject = resultObject;
    }


    async function makeEmptyResultObject(){
        const resultObject = [];
        constants.resultObject = resultObject;
    }




    async function makeResultObject( studentsList, template, regColName, nameColName, attColName ){

        const resultObject = [];
        var numOfRows = studentsList.length;

        for(var index=0; index<numOfRows; index++){ //looping student

            var rowData = {};

            template.forEach(
                (item)=>{
                    if(item.key == "reg"){
                        rowData[item.key] = getStudentDetail( studentsList[index], regColName);
                    }else if(item.key == "name"){
                        rowData[item.key] = getStudentDetail( studentsList[index], nameColName);
                    }else if(item.key.toLowerCase() == "attendance"){
                        rowData[item.key] = getStudentAttDetail(studentsList[index], attColName);
                        rowData['ca'] = getStudentAttDetail(studentsList[index], attColName);
                    }else if(item.key == "ca"){
                        //ignore ca because it is computed only if attendance exist
                    }else if(item.key == "remark"){
                        rowData[item.key] = constants.incompleteResult;
                    }                     
                    else{
                        rowData[item.key] = "";
                    }
                }
            )
            resultObject.push(rowData);
        }

        constants.resultObject = resultObject;
    }



    function getStudentDetail(sObject, colName){
        if(sObject[colName] !=undefined || sObject[colName]!=null ){
            return (sObject[colName]+"").trim();
        }else{ return "" }
    }

    function getStudentAttDetail(sObject, colName){
        if(sObject[colName] !=undefined || sObject[colName]!=null ){
            try{
                var val = parseFloat( (sObject[colName]+"").trim() );
                if(isNaN(val)) return "";
                return val;
            }catch(e){ return ""; }
        }else{ return "" }
    }


    function validateBlank(){
        if( selectedTemplate.content.length<=0 ){ onInfo("Warning","Please select a template."); return false; }
        if( selectedGrading.content.gradingSystem.length<=0 ){ onInfo("Warning","Please select a grading system."); return false; }
        if( rName == "" ){ onInfo("Warning","Please enter result name."); return false; }
        if( numRows<=0 ){ onInfo("Warning","Please enter valid number of rows."); return false; }

        return true;
    }



    function validateEmpty(){
        if( selectedTemplate.content.length<=0 ){ onInfo("Warning","Please select a template."); return false; }
        if( selectedGrading.content.gradingSystem.length<=0 ){ onInfo("Warning","Please select a grading system."); return false; }
        if( rName == "" ){ onInfo("Warning","Please enter result name."); return false; }
        return true;
    }


    function validate(){

        if( selectedTemplate.content.length<=0 ){ onInfo("Warning","Please select a template."); return false; }
        if( selectedGrading.content.gradingSystem.length<=0 ){ onInfo("Warning","Please select a grading system."); return false; }
        if( rName == "" ){ onInfo("Warning","Please enter result name."); return false; }
        if( studentListData.length<=0 ){ onInfo("Warning","Please select student's list."); return false; }
        
        return true;
    }

    
    const infoBox = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isOpaque='true' isScaleAnim="true" id="infoBoxNew234" items={ <InfoDialog title={title} body={body} /> } 
                onClose={ ()=>{ setInfoDialog(!infoDialog); } }
                dialogState={infoDialog}
            />
        }, [infoDialog]
    )


    const templateBox = useMemo(
        ()=>{
            return <FullDialogBase  isOpaque={true} isCloseButton={true}  isScaleAnim={true} id="selectTemplates"  
            items={  
                <SelectTemplates 
                onClose={ ()=>{ setSelectTemplatesDialog(false); } }
                dialogState={selectTemplatesDialog} 
                
                onSelect={(item)=>{
                    setSelectedTemplate(item);
                    setSelectTemplatesDialog(false);
                }}  /> 
            } 
            onClose={ ()=>{ setSelectTemplatesDialog(false); } }
            dialogState={selectTemplatesDialog}
        />
        }, [selectTemplatesDialog]
    )


    const gradeBox = useMemo(
        ()=>{
            return <FullDialogBase isOpaque={true} isCloseButton={true} isScaleAnim={true} id="selectGrdingSystem"  
            items={ 
                <SelectGradingSystem
                    onClose={ ()=>{ setSelectGradingDialog(false); } }
                    dialogState={selectGradingDialog} 
                    onSelect={(item)=>{
                        setSelectedGrading(item);
                        setSelectGradingDialog(false);
                    }}  
                /> 
            } 
            onClose={ ()=>{ setSelectGradingDialog(false); } }
            dialogState={selectGradingDialog}
        />
        }, [selectGradingDialog]
    )

    const previewBox = useMemo(
        ()=>{
            return <FullDialogBase  isCloseButton={true} isOpaque={true}  isScaleAnim="true" id="previewBoxNew" items={ <PreviewDialog ptitle={studentListPath} pdata={studentListData} onClose={()=>setPreviewDialog(false)} /> } 
                onClose={ ()=>{ setPreviewDialog(false); } }
                dialogState={previewDialog}
            />
        }, [previewDialog]
    )


    const chooseColumn = useMemo(
        ()=>{

            return <FullDialogBase  isCloseButton={true} isOpaque={true} isScaleAnim="true" id="ChooseColNew" items={ 
                     
                <ChooseNewColDialog 
                    isSNumber={ !studentListColumns.includes('student_number') } 
                    isSName={ !studentListColumns.includes('student_name') } 
                    isAtt={ !studentListColumns.includes('attendance') } 

                    columns={cols}

                    onClose={()=>setChooseColDialog(false)} 
                    onAccept={(sNum, sName, sAtt)=>{

                        setMappedReg(sNum);
                        setMappedName(sName);
                        setMappedAtt(sAtt);
                        setChooseColDialog(false)

                    }}
                    
                /> 
                } 

                onClose={ ()=>{ setChooseColDialog(false); } }
                dialogState={chooseColDialog}
            />
        },[chooseColDialog]
    )


    function onInfo(title,body){
        setTitle(title);
        setBody(body);
        setInfoDialog(true)
    }

    function dotList(text){
        return <span className={style.dotList}>
                    <div className={style.dot}></div>
                    <label>{text}</label>
                </span>
    }


    return(

        <div className={`${style.menuItems}`} > 

            <Loading isCenter={true} state={isLoading} />

            {infoBox}
            
            {templateBox}

            {gradeBox}

            {previewBox}

            {chooseColumn}

        
        <div style={{padding:"0 10px"}} className='d-flex align-items-center'>
            <label className='dialogTitle'>New Result</label>
        </div>

        <HLine/>

        <div style={{padding:"0 10px"}} className='d-flex mb-2 mt-2 justify-content-between'>
            <div className='d-flex'>
                <GButton onClick={()=>{
                    setSelectTemplatesDialog(true); 
                }} isFilled={true} icon={(selectedTemplate["name"]=="" || selectedTemplate["name"]==undefined)? <FaPlus/> : <FaCircleCheck/> } title="Select Template" />

                <div className={style.space}></div>
                <GButton onClick={()=>{
                    setSelectGradingDialog(true);
                }} isFilled={true} icon={(selectedGrading['name']=="" || selectedGrading['name']==undefined )? <FaPlus/> : <FaCircleCheck/> } title="Select Grading System" />
            </div>
            <div className={style.space}></div>
            <Input 
                onEnter={()=>{
                    if( addLater ){
                        onCreateEmpty()
                    }else{
                        onCreateBlank()
                    }
                }}
                onChange={ (value)=>{ setRName(value) } } className={style.nameInput} placeholder='Enter Result Name'/>
        </div>



        <div className={style.scroll} style={{padding:"1px 10px"}}>
        {
            (selectedTemplate.content.length>0)?
            <div style={{display:"flex", alignItems:"center", overflowX:"auto", overflowY:"hidden", height:"40px"}} className='slimScroll'>
            {
                (selectedTemplate.name.length>0)? <div style={{display:"flex", alignItems:"center"}}> <Chip styles={{background:"var(--brand-color)", color:"var(--white-text)"}} title={selectedTemplate.name}/>  <div className={style.bar}></div> </div> : <></>
            }
            {
                selectedTemplate.content.map( (item, index)=> <Chip key={index} title={item.name} /> )
            }
            </div>
            :<></>
        }



        {
            (selectedGrading.content.gradingSystem.length>0 )?
            <div style={{display:"flex", alignItems:"center", overflowX:"auto", overflowY:"hidden", height:"40px", marginTop:"5px"}} className='slimScroll'>
            {
                (selectedGrading.name.length>0)? <div style={{display:"flex", alignItems:"center"}}> 
                    <Chip styles={{background:"var(--brand-color)", color:"var(--white-text)"}} title={selectedGrading.name}/>  
                    <Chip styles={{background:"var(--brand-color)", color:"var(--white-text)"}} title={"Pass Mark: "+selectedGrading.content.passMark}/>  
                    <div className={style.bar}>
                </div> </div> : <></>
            }
            {
                selectedGrading.content.gradingSystem.map( (item, index)=> <Chip key={index} title={item.grade + " (" + item.min + " - " + item.max + ")"} /> )
            }
            </div>
            :<></>
        }



            <div  className={style.tabPane}>
                <div onClick={()=>{ setTab(1) }} className={(tab==1)?style.active:""} >Create Blank Result</div>
                <div onClick={()=>{ setTab(2) }} className={(tab==2)?style.active:""} >Create Result From Students&apos; List</div>
            </div>

            {

                (tab==1)?

                    <div className={`d-flex flex-column ${style.tabBody} `} >

                        <div onClick={()=>setAddLater(!addLater)} className={style.addLater}>
                            {(addLater)? <FaCheckSquare/> : <FaRegSquare/>}
                            <label> Add rows later </label>
                        </div>
                        
                        <label className={`${style.label} ${addLater? style.later:""} mt-1`}>Enter Number of Rows</label>
                        

                        <div className={` ${addLater? style.later:""} `}>

                            <Input 
                                type="number" 
                                onEnter={()=>{

                                    if( addLater ){
                                        onCreateEmpty()
                                    }else{
                                        onCreateBlank()
                                    }

                                }}
                                onChange={(value)=>{setNumRows(value)}} 
                                placeholder="Enter number of rows">

                            </Input>

                        </div>

                        
                        
                        {
                            (addLater)?
                            <label className={`${style.italic} mt-2`}>Your result will be created with an initial rows of 0 </label>
                            :
                            <label className={`${style.italic}  ${addLater? style.later:""} mt-2`}>Your result will be created with the initial rows of {(numRows)? numRows : 0}</label>
                        }
                        
                        <label className={` ${style.italic} `}>Note: You can add/delete rows at any time.</label>
                        
                        <div className='mt-0 d-flex justify-content-end'>
                            <Button title="Create New Result" onClick={()=>{

                                if( addLater ){
                                    onCreateEmpty()
                                }else{
                                    onCreateBlank()
                                }
                        
                            }} />
                        </div>

                    </div>


                :

                <div className={`d-flex flex-column ${style.tabBody} `}>

                    <div className='d-flex mt-1'>

                        <Tippy  theme='tomato' delay={150} content={studentListPath} placement='bottom'>
                            <div className={style.path}> {studentListPath} </div>
                        </Tippy>


                        <div className={style.space} />
                        <GButton title="Select Students' List" isFilled="true" 
                            icon={ ( studentListData.length>0)? <FaCircleCheck/> : <FaPlus/> }
                            onClick={()=>{
                                onReceiveStudentList();
                            }} 
                        />


                        <div className={style.space} />
                        <Button title="Preview" onClick={()=>{
                            if(studentListData.length>0){
                                setPreviewDialog(true);
                            }else{
                                onInfo("Warning", "Please select student's list.")
                            }
                        }} />

                    </div>

                    
                    <label className={`${style.label} mt-2`}>Supported file type:  </label>
                    <div className='mb-1'>

                    <Chip title=".csv" active={studentListFileType=='.csv'} />
                  
                    </div>


                    <label className={`${style.italic}`}>Note: Students&apos; list can be exported from the ATTEND mobile application.</label>
                    
                    
                    <label className={`${style.label} mt-2`}>Supported Column Names:</label>
               

                    <div className='d-flex'>

                        
                        <Tippy  theme='tomato' delay={150} content="Student Number" placement='bottom'>
                            <span>
                                <Chip title={ (mappedReg!="" && mappedReg!="Not applicable")? mappedReg: "student_number" }  active={studentListColumns.includes('student_number') || (mappedReg!="" && mappedReg!="Not applicable") } />
                            </span>
                        </Tippy>


                        <Tippy  theme='tomato' delay={150} content="Student Name" placement='bottom'>
                            <span>
                            <Chip title={ (mappedName!="" && mappedName!="Not applicable")? mappedName: "student_name (optional)" } active={studentListColumns.includes('student_name') || (mappedName!="" && mappedName!="Not applicable")} />
                            </span>
                        </Tippy>


                        <Tippy  theme='tomato' delay={150} content="Attendance" placement='bottom'>
                            <span>
                                <Chip title={ (mappedAtt!="" && mappedAtt!="Not applicable")? mappedAtt: "attendance (optional)" } active={studentListColumns.includes('attendance') || (mappedAtt!="" && mappedAtt!="Not applicable")} />
                            </span>
                        </Tippy>

                    
                    </div>

                    
                    {
                        (!studentListColumns.includes('student_number') || !studentListColumns.includes('student_name') || !studentListColumns.includes('attendance') )?
                        
                        <div>

                            <span className={`${style.italic} mt-2`}>
                                Note: You can manually choose columns for {(!studentListColumns.includes('student_number'))? dotList("Student Number"):""} {(!studentListColumns.includes('student_name'))? dotList("Student Name"):""} {(!studentListColumns.includes('attendance'))? dotList("Attendance"):""}     
                            </span>

                            {(!studentListColumns.includes('attendance'))?<div className={`${style.italic} `}>
                                (Attendance is only applicable if a column called &apos;attendance&apos; is included in the selected template).
                            </div>:<></>}

                        </div>
                        
                        :
                        <></>
                    }
                    
                  

                    <div className='d-flex mt-1 align-items-start'>
                        {
                            (!studentListColumns.includes('student_number') || !studentListColumns.includes('student_name') || !studentListColumns.includes('attendance') )?
                                <Button title="Choose Column(s)" onClick={()=>{

                                    if(studentListColumns.length>0){
                                        setChooseColDialog(true);
                                    }else{
                                        onInfo("Warning", "Please select student's list first.")
                                    }
                                    
                                }} />
                            :
                            <></>
                        }
                    </div>

                   
                
                    <div className='mt-0 d-flex justify-content-end'>
                        <Button title="Create New Result" onClick={()=>{

                            createResultFromList();

                        }} />
                    </div>

                </div>
            }


        </div>

        </div>
    )
}

export default NewResult;