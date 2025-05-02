import { mkdir, BaseDirectory, readTextFile, writeTextFile, readDir, remove, rename, exists, stat, writeFile } from '@tauri-apps/plugin-fs';
import { appLocalDataDir, join, documentDir, basename } from '@tauri-apps/api/path';
import {open, save} from '@tauri-apps/plugin-dialog';
import * as csv from 'csvtojson';
import { Document,HeadingLevel,Packer,Paragraph, PageMargin, PageOrientation, Footer, PageNumber, AlignmentType, TextRun, Table, TableCell, TableRow, } from 'docx';
import constants from '@/constants';


var appDirectories = ["archives", "grading-systems", "results", "settings", "templates"];


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//local
async function makeDirectory( dir ){
    await mkdir( dir, {
        baseDir: BaseDirectory.AppLocalData
    });
}

//local
async function makeFilePath( folder, filename ) {
    const local = await appLocalDataDir();
    var path = await join(local, folder, filename);
    return path;
}

//local
async function list(folder) {
    try{
        const entries = await readDir( folder, { baseDir: BaseDirectory.AppLocalData });
        return entries;
    }catch(e){ return []; }
}

//local
function getDateString(date){
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    return  toMonth(month) + " " + day + ", " + year;
}

//local
function toMonth(month){
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


  //local
  async function getContentObject( folder, filename, withContent ){

    var content = "";
    if(withContent){
        var data = await read(folder, filename);
        if(data){ content =  data;  }
    }
    
    var filePath = await makeFilePath(folder, filename);
    var fstat = await stat( filePath );
    var ctimeMS = fstat.birthtime.getTime();
    var dateStr = getDateString(fstat.birthtime);

    return {"source":"fromFile", "name":filename, "date": dateStr, "ctimeMS": ctimeMS, "content": content };
            
}


//local
function makeTable( data ){

    var rows = [
      new TableRow(
        {
          children: getHeader(data[0])
        }
      )
    ];
  
    data.forEach((item)=>{ //each row of the result data
      var tableRow = new TableRow(
        {
          children: getC(item)
        }
      )
      rows.push(tableRow);
    })
    return rows;
  }
  
  
  //local
  function makeStudentTable( data ){
  
    var keys = Object.keys(data);
  
    var rows = []
  
    for(var k=0; k<keys.length; k++){
  
      var tableRow = new TableRow(
        {
          children: [
            new TableCell(
              {
                children:[
                  new Paragraph({text: keys[k] }),
                ]
              }
            ),
  
            new TableCell(
              {
                children:[
                  new Paragraph({text: ( data[keys[k]]+"" ) }),
                ]
              }
            )
  
          ]
  
        }
      )
  
      rows.push(tableRow);
  
    }
  
    return rows;
  }
  
  
  //local
  function makeGradeTable( data ){
  
    var keys = Object.keys(data);
  
    var rows = []
  
    for(var k=0; k<keys.length; k++){
  
      var tableRow = new TableRow(
        {
          children: [
            new TableCell(
              {
                children:[
                  new Paragraph({text: "Number of "+ keys[k] }),
                ]
              }
            ),
  
            new TableCell(
              {
                children:[
                  new Paragraph({text: ( " " + data[keys[k]] + " " ) }),
                ]
              }
            )
  
          ]
  
        }
      )
      rows.push(tableRow);
    }
    return rows;
  }
  
  
  
  //local
  function getHeader( item )
  {
    var keys = Object.keys(item);
    var c = [];
    for(var i=0; i<keys.length; i++){
      c.push(
        new TableCell(
          {
            children:[
              
              new Paragraph(
                {
                  children:[
                    new TextRun(
                      {text: keys[i], bold:true}
                    )
                  ]
                }
              ),
  
            ]
          }
        )
      )
    }
    return c;
  }
  
  
  
  //local
  function getC( item )
  {
    var keys = Object.keys(item);
    var c = [];
    for(var i=0; i<keys.length; i++){
      c.push(
        new TableCell(
          {
            children:[
              new Paragraph({text: (item[keys[i]]+"") }),
            ]
          }
        )
      )
    }
    return c;
  }
  

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


export async function createAppDirectories(){
    try{
        appDirectories.forEach(
            (item)=>{
                makeDirectory(item);
            }
        )
        return true;
    }catch(e){ return false; }
}


export async function read(folder, filename) {
    try{
        const path = await makeFilePath(folder, filename);
        const contents = await readTextFile( path );
        return JSON.parse( contents );
    }catch(e){ return false; }
}

export async function write(folder, filename, content) {
    try{
        const path = await makeFilePath(folder, filename);
        await writeTextFile( path, content );
        return true;
    }catch(e){ return false }
}


export async function readExt( path ) {
    try{
        const contents = await readTextFile( path );
        return contents;
    }catch(e){ return false + " :: " + e; }
}

export async function writeExt( path, content) {
    try{
        // const path = await makeFilePath(folder, filename);
        await writeTextFile( path, content );
        return true;
    }catch(e){ return false; }
}

export async function listFiles(folder, withContent) {

    var allFiles = [];

    try{
        var files = await list(folder);

       for (const file in files) {
            var content = await getContentObject(folder, files[file].name, withContent );
            allFiles.push( content )
       }

    }catch(e){ return [] }
    
    return allFiles;
    
}






export async function deleteFile(folder,  filename,) {
    try{
        const path = await makeFilePath(folder, filename);
        await remove( path );
        return true;
    }catch(e){ return false; }
}


export async function renameFile(folder,  fromFile, toFile,) {
    try{
        const from = await makeFilePath(folder, fromFile);
        const to = await makeFilePath(folder, toFile);
        await rename( from, to );
        return true;
    }catch(e){ return e; }
}


export async function moveFile(fromFolder, toFolder,  filename ) {
    try{
        const from = await makeFilePath( fromFolder, filename );
        const to = await makeFilePath( toFolder, filename );
        await rename( from, to );
        return true;
    }catch(e){ return false; }
}


export async function fileExist( folder, filename ) {
    try{
        const path = await makeFilePath( folder, filename );
        return await exists( path );
    }catch(e){ return false; }
}


export async function openBox( title, fileType ) {
    try{
        const path = await open({
                multiple:false,
                directory:false,
                defaultPath: await documentDir(),
                filters: [{
                    name: title,
                    extensions: [ fileType ]
                }]
            }
        )

        if(path===null) return "";
        return path;

    }catch(e){ alert(e); return ""; }
}


export async function saveBox( title, fileType, defaultName ) {

    try{
        const fpath = await save({
                defaultPath: await join( await documentDir(), defaultName ),
                filters: [{
                    name: title,
                    extensions: [ fileType ]
                }]
            }
        )

        if(fpath===null) return "";
        return fpath;

    }catch(e){ return ""; }
}


export async function cvs2JSON( filePath ) {
    try{
        if( filePath !== "" ){
            var json = "";
            var content = await readExt(filePath);
            if(content) json = await csv().fromString( content );
            return json;
        }
        return "";
    }catch(e){ return ""; }
}

export function sanitizeResultName(resultName) {
    var fname = ( resultName.substring( resultName.lastIndexOf("."), resultName.length) === ".staaris" )? resultName : resultName+".staaris";
    return fname;
}

export function removeExtension(resultName) {
    var fname = resultName.substring(0, resultName.lastIndexOf(".") );
    return fname;
}

export async function getBaseName(path){
    return await basename(path);
}



export async function createSaveDOCX( name, resultObject, stats, path ) {


        var table = new Table( { rows: makeTable( resultObject )  } )
        var studentStatTable = new Table( { rows: makeStudentTable( stats.studentStat )  } )
        var gradeStatTable = new Table( { rows: makeGradeTable( stats.gradeStat )  } )

        var doc = new Document(
          {

            creator:constants.appName,
            description: constants.appName + " result sheet",


            sections: [
              {

                
                properties:{
                  
                  page:{
                    
                    // margin:{
                    //   top:2,
                    //   right:3,
                    //   bottom:2,
                    //   left:0.5,
                    //   gutter:0,
                    //   footer:0.5,
                    //   header:0.5
                    // },

                    size:{
                      orientation:PageOrientation.LANDSCAPE,
                    }
                    
                  },
            
                },

                footers: {
                  default: new Footer({
                    
                      children: [

                        new Paragraph( 
                          {
                            alignment:AlignmentType.LEFT,

                            children:[

                              new TextRun(
                                {
                                  text: constants.appName + " " + constants.appVersion
                                }
                              ),


                              new TextRun({
                                children: ["      ", new Date().toDateString() ],
                              }),

                              new TextRun({
                                children: ["      Page ", PageNumber.CURRENT],
                                
                              }),
                              new TextRun({
                                  children: [" of ", PageNumber.TOTAL_PAGES],
                              }),

                              

                            ]
                          }
                         ),
                      
                      ],
                  }),
                },


                children:[

                  new Paragraph(
                    {
                      alignment:AlignmentType.CENTER,
                      heading:'Heading1',
                      children:[
                        new TextRun(
                          {text:name, bold:true }
                        )
                      ]
                    }
                  ),

                //   new Paragraph(
                //     {
                //       alignment:AlignmentType.CENTER,
                //       children:[
                //         new TextRun(
                //           {text:name, bold:true}
                //         )
                //       ]
                //     }
                //   ),


                  new Paragraph({text:"\n"}),
                  new Paragraph({text:"\n"}),
                  new Paragraph({text:"\n"}),


                  table,

                  new Paragraph({text:"\n"}),
                  new Paragraph(
                    {
                      children:[
                        new TextRun(
                          {text:"SUMMARY", bold:true}
                        )
                      ]
                    }
                  ),

                  studentStatTable,

                  new Paragraph({text:"\n"}),
                  new Paragraph(
                    {
                      children:[
                        new TextRun(
                          {text:"ANALYSIS", bold:true}
                        )
                      ]
                    }
                  ),


                  gradeStatTable

                ]
              }
            ]
          }
        )

        Packer.toBuffer(doc).then( 
          async (buffer)=>{ 
            await writeFile(path, buffer);
          } 
      )

    
}