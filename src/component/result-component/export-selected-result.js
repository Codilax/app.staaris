
import style from './export-result.module.css'
import constants from '../../constants';
import { createSaveDOCX, saveBox, writeExt } from '@/utils/files';
import { json2csv } from 'json-2-csv';

export function ExportSelectedResult( {resultName, onExportFinished} ){


    const formats = [
        {"key":"docx", "name":"Microsoft Office Word (.docx)"},
        {"key":"csv", "name":"Comma Separated Values (.csv)"},
        // {"key":"xlsx", "name":"Excel Workbook (.xlsx)"},
        // {"key":"pdf", "name":"Portable Document Format (.pdf)"},
        {"key":"staaris", "name":"Staaris File (.staaris)"}
    ];



    function getStat(){

        var totalStudent = getSelectedResultObjects().length;
        var totalPresent = 0;
        var totalAbsent = 0;    //empty exams
        var totalPass = 0;
        var totalFail = 0;

        var gradeStat = {};
        constants.gradingSystem.gradingSystem.forEach( //init
            (item)=>{
                gradeStat[item.grade] = 0;
            }
        )

        getSelectedResultObjects().forEach( //row
            (rowData, index)=>{
                if( (rowData['exam']+"").trim()==""){
                    totalAbsent = totalAbsent + 1;
                }else{
                    totalPresent = totalPresent + 1;
                    if( cleanValue( rowData['total'] ) >= constants.gradingSystem.passMark){
                        totalPass = totalPass + 1;
                    }else{
                        totalFail = totalFail + 1;
                    }

                    var whatGrade = rowData['grade'];
                    if( whatGrade!="" && whatGrade!="IR" ){
                        gradeStat[whatGrade] = ( cleanGValue( gradeStat[whatGrade] ) + 1 );
                    }
                }
            }
        )


        var passPer = (totalPresent<=0)? 0 : ((totalPass/totalPresent)*100);
        var failPer = (totalPresent<=0)? 0 : ((totalFail/totalPresent)*100);


        var studentStat = {
            "Total No. of Students": totalStudent,
            "Number Present": totalPresent  + " of " + totalStudent + " (" + ((totalPresent/totalStudent)*100) + "%)",
            "Number Absent": totalAbsent  + " of " + totalStudent + " (" + (((totalAbsent/totalStudent)*100)) + "%)",
            "Total Pass": totalPass + " of " + totalPresent + " (" + ( passPer ) + "%)",
            "Total Fail": totalFail + " of " + totalPresent + " (" + ( failPer ) + "%)",
        }

        var stat = {
            gradeStat, studentStat
        }
        return stat;
    }



    function cleanValue(val){
        try{
            var v = parseFloat(val+"");
            return v;
        }catch(e){ return -1; }
    }

    function cleanGValue(val){
        try{
            if(val == undefined || val ==null || isNaN(null)){
                return 0;
            }else{
                var v = parseInt(val+"");
                return v;
            }
            
        }catch(e){ return 0; }
    }


    function tranformKeys( resultObject, template ){
        var result = [];
        resultObject.forEach( //row
            (rowData, index)=>{
                var rowObj = {}
                template.forEach( //column
                    (template)=>{
                        if(template.key=="serial"){
                            rowObj[template.name] = (index+1)
                        }else{
                            rowObj[template.name] = rowData[template.key]
                        }
                    }
                )
                result.push(rowObj);
            }
        )
        return result;
    }



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


    async function exportResult( ipcName ){

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
            "resultObject": getSelectedResultObjects(),
        }


        if(ipcName=="export-staaris"){
            var path = await saveBox(".staaris", "staaris", constants.resultName );
            if(path){
                await writeExt(path, JSON.stringify( resultData ) );
                onExportFinished();
            }
        }else if(ipcName=="export-csv"){
            var newResultObject = tranformKeys(getSelectedResultObjects(), constants.template )
            var path = await saveBox(".csv", "csv", constants.resultName );
            if(path){
                var csvData = json2csv(newResultObject);
                await writeExt( path,  csvData  );
                onExportFinished();
            }
        }

        else if(ipcName=="export-docx"){
            var newResultObject = tranformKeys(getSelectedResultObjects(), constants.template )
            var path = await saveBox(".docx", "docx", constants.resultName );
            if(path){
                await createSaveDOCX(constants.resultName, newResultObject, getStat(), path );
                onExportFinished();
            }
        }
        
    }


    function getSelectedResultObjects(){
        var selected = [];
        constants.selectedRows.forEach((row)=>{
            if(constants.resultObject[row] != undefined){
                selected.push(constants.resultObject[row])
            }
        })
        return selected;
    }


    function exportFile(extension){
    
        if(extension=="staaris"){ exportResult("export-staaris"); }
        else if(extension=="csv"){ exportResult("export-csv"); }
        else if(extension=="docx"){ exportResult("export-docx"); }
        
    }

    const formatsUI = formats.map( (item, index)=>{
        return <div key={index} onClick={ ()=>exportFile(item.key) } className={`${style.formatItem} col`}>{item.name}</div>
    } )
    


    return(

        <div className={`${style.menuItems}`} > 
        

        <div className='d-flex flex-column mb-2'>
            <label className='dialogTitle' >Export Selection</label>
        </div>



        {/* <HLine /> */}
        
            <div  className={style.tabPane}>
            <div className={style.active} >Export Selection as</div>
            </div>

            <div className={`d-flex flex-column ${style.tabBody2} ${style.scroll}`} >
                <div className='row'>
                    { formatsUI }
                </div>
                
            </div>


        </div>
    )
}