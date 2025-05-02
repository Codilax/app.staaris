import { useEffect, useMemo, useState } from 'react';
import Button from '../button/button';
import style from './add-row.module.css';
import {FaCircleCheck, FaPlus, FaRegSquare, FaSquareCheck } from 'react-icons/fa6'

import GButton from '../button/generic-button';
import { TextField } from '../text-boxes/text-box';
import HLine from '../num/line';
import { Chip } from '../cards/chip';
import { FullDialogBase } from '../dialog/full-dialog-base';
import { InfoDialog } from '../dialog/dialog-contents/infoDialog';
import constants, { template } from '../../constants';

// import electron from 'electron';
import Tippy from '@tippyjs/react';
import { PreviewDialog } from '../dialog/dialog-contents/previewDialog';
import { ChooseAddColDialog } from '../dialog/dialog-contents/choose-add-columns';
import { Loading } from '../loading/loading';
import { cvs2JSON, fileExist, openBox, read, sanitizeResultName, write } from '@/utils/files';
import { Input } from '../text-boxes/input';
// const ipcRenderer = electron.ipcRenderer || false;


export function AddRow( {pid, onFireUpdate, onClose } ){

    const [ infoDialog, setInfoDialog] = useState( false );
    const [ previewDialog, setPreviewDialog] = useState( false );
    const [ chooseColDialog, setChooseColDialog] = useState( false );
    
    
    const [ title, setTitle] = useState( "" );
    const [ body, setBody] = useState( "" );

    const [ numRows, setNumRows] = useState( 0 );
      
    
    const [ tab, setTab] = useState( 1 );
    const [ studentListPath, setStudentListPath] = useState( "C:\\Users\\..." );

    const [ studentListColumns, setStudentListColumns] = useState( [] );
    const [ cols, setCols] = useState( [] );

    const [ studentListData, setStudentListData] = useState( [] );
    const [ studentListFileType, setStudentListFileType] = useState( "" );
    
    
    const [ mappedReg, setMappedReg] = useState( "" );
    const [ mappedName, setMappedName] = useState( "" );
    const [ mappedAtt, setMappedAtt] = useState( "" );
    

    const [ autoSave, setAutoSave] = useState( true );
    const [ isLoading, setIsLoading] = useState( false );

    //====================================================================

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
        await write(constants.saveToFolder, fname, JSON.stringify(data));
        // ipcRenderer.send( 'save-result', constants.saveToFolder, resultName, data );
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


    async function doWithStudentList(){

        var regColName = getRegColOrMapped();
        var nameColName = getNameColOrMapped();
        var attColName = getAttColOrMapped();

        if(regColName!=""){

            var isValid = validate();

            if(isValid){

                onClose();

                makeResultObject( studentListData, constants.template, regColName, nameColName, attColName );

                if(autoSave){

                    var date = new Date();
                    var y = date.getFullYear();
                    var m = date.getMonth();
                    var d = date.getDate();

                    var resultData = {
                        "dateCreated": makeDate(d,m,y),
                        "templateName": constants.templateName,
                        "template": constants.template,
                        "passMark": constants.gradingSystem.passMark,
                        "gradingSystemName": constants.gradingSystemName,
                        "gradingSystem": constants.gradingSystem.gradingSystem,
                        "selectedColumn": constants.selectedColumn,
                        "currentFoundStudentIndex": constants.currentFoundStudentIndex,
                        "resultName": constants.resultName,
                        "resultObject": constants.resultObject,
                    }
        
                    //save result to file system
                    saveResultIPC(constants.resultName, resultData )        
                    constants.isSaved = true;

                }else{
                    constants.isSaved = false;
                }
                onFireUpdate("*");
            }

        }else{
            onInfo("Warning","Please choose column name for Student Number.")
        }

        return true;

    }


    function addFromList(){

        loading(true)

        setTimeout(async () => {
            var isDone = await doWithStudentList()
            if(isDone){
                loading(false)
            }
        }, 500);

    }



    async function doBlank(){

        var isValid = validateBlank();

        if(isValid){

            onClose();

            makeBlankResultObject( numRows, constants.template );

            if(autoSave){

                var date = new Date();
                var y = date.getFullYear();
                var m = date.getMonth();
                var d = date.getDate();

                var resultData = {
                    "dateCreated": makeDate(d,m,y),
                    "templateName": constants.templateName,
                    "template": constants.template,
                    "passMark": constants.gradingSystem.passMark,
                    "gradingSystemName": constants.gradingSystemName,
                    "gradingSystem": constants.gradingSystem.gradingSystem,
                    "selectedColumn": constants.selectedColumn,
                    "currentFoundStudentIndex": constants.currentFoundStudentIndex,
                    "resultName": constants.resultName,
                    "resultObject": constants.resultObject,
                }

                //save result to file system
                saveResultIPC(constants.resultName, resultData )
            
                constants.isSaved = true;

            }else{
                constants.isSaved = false;
            }
            onFireUpdate("*")
        }

        return true;
    }



    function loading(state){
        setIsLoading(state);
    }



    async function onAddBlank(){

        loading(true)

        setTimeout(async () => {
            var isDone = await doBlank()
            if(isDone){
                loading(false)
            }
        }, 500);
    }




    //====================================================================
    function makeBlankResultObject( numOfRows, template ){
        for(var index=0; index<numOfRows; index++){
            var rowData = {};
            template.forEach(
                (item)=>{
                    rowData[item.key] = "";
                }
            )
            constants.resultObject.push(rowData)
        }
    }


    function makeResultObject( studentsList, template, regColName, nameColName, attColName ){

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
                    }
                    
                    else if(item.key == "ca"){
                        if(rowData['ca'] == undefined) rowData['ca']="";
                    }
                    
                    else if(item.key == "remark"){
                        rowData[item.key] = constants.incompleteResult;
                    }                     
                    else{
                        rowData[item.key] = "";
                    }
                }
            )
            constants.resultObject.push(rowData);
        }
    }



    function getStudentDetail(sObject, colName){
        if(sObject[colName] !=undefined && sObject[colName]!=null ){
            return (sObject[colName] + "").trim();
        }else{ return "" }
    }

    function getStudentAttDetail(sObject, colName){
        if(sObject[colName] !=undefined && sObject[colName]!=null ){
            try{
                var val = parseFloat( (sObject[colName]+"").trim() );
                if( isNaN(val) ) return "";
                return val;
            }catch(e){ return ""; }
        }else{ return "" }
    }


    function validateBlank(){
        if( numRows<=0 ){ onInfo("Warning","Please enter valid number of rows."); return false; }
        return true;
    }


    function validate(){
        if( studentListData.length<=0 ){ onInfo("Warning","Please select student's list."); return false; }
        return true;
    }


    
    const infoBox = useMemo(
        ()=>{
            return <FullDialogBase isCloseButton="true" isOpaque='true' isScaleAnim="true" id={"info"+pid} items={ <InfoDialog title={title} body={body} /> } 
                onClose={ ()=>{ setInfoDialog(!infoDialog); } }
                dialogState={infoDialog}
            />
        }
    )



    const previewBox = useMemo(
        ()=>{
            return <FullDialogBase  isCloseButton={true} isOpaque={true}  isScaleAnim="true" id={"preview"+pid} items={ <PreviewDialog ptitle={studentListPath} pdata={studentListData} onClose={()=>setPreviewDialog(false)} /> } 
                onClose={ ()=>{ setPreviewDialog(false); } }
                dialogState={previewDialog}
            />
        }
    )


    const chooseColumn = useMemo(
        ()=>{

            return <FullDialogBase  isCloseButton={true} isOpaque={true} isScaleAnim="true" id={"choose"+pid} items={ 
                     
                <ChooseAddColDialog
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
        }
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

            {previewBox}

            {chooseColumn}

        
        <div style={{padding:"0 10px"}} className='d-flex align-items-center'>
            <label className='dialogTitle'>Add Rows</label>
            <div onClick={()=>setAutoSave(!autoSave)} className={style.group} >  { (autoSave)?<FaSquareCheck/> : <FaRegSquare/> } <label style={{marginLeft:"2px"}}>Autosave</label> </div>
        </div>

        <HLine/>

        <div className={style.scroll} style={{padding:"0px 10px"}}>
            <div  className={style.tabPane}>
                <div onClick={()=>{ setTab(1) }} className={(tab==1)?style.active:""} >Add Blank Rows</div>
                <div onClick={()=>{ setTab(2) }} className={(tab==2)?style.active:""} >Add Rows From Students&apos; List</div>
            </div>
            {
                (tab==1)?

                <div className={`d-flex flex-column ${style.tabBody} `} >

                    <label className={`${style.label} mt-1`}>Enter Number of Rows</label>
                    
                    <Input onKeyUp={ async (e)=>{ 

                        if(e.key == "Enter"){
                            await onAddBlank()
                        }

                        } }

                        onChange={(value)=>{setNumRows(value)}} placehoder="Enter number of rows" />

                    <label className={`${style.italic} mt-2`}>{(numRows)? numRows : 0} blank rows will be appended to your result.</label>
                    <label className={`${style.italic}`}>Note: You can add/delete rows at any time.</label>
                    
                    <div className='mt-2 d-flex justify-content-end'>
                        <Button title="Add Blank Rows" onClick={ async ()=>{
                            await onAddBlank()
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
                                // ipcRenderer.send("load-student-list");
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


                    <label className={`${style.italic}`}>Note: Students&apos; list can be gotten by exporting same from the ATTEND mobile application.</label>
                    
                    
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
                                (Attendance is only applicable if a column called &apos;attendance&apos; is specified by the selected template).
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
                        <Button title="Add Rows" onClick={()=>{
                            addFromList();
                        }} />
                    </div>

                </div>
            }


        </div>

        </div>
    )
}
