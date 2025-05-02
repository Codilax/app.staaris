import React, { useEffect, useMemo, useState } from 'react';
import style from './smart-panel.module.css'
import Tippy from '@tippyjs/react';


import {FaAngleLeft, FaAngleRight, FaGear, FaRegSquare, FaSquareCheck} from 'react-icons/fa6'
import Num2 from '../num/num2';
import constants from '../../constants';
import { FullDialogBase } from '../dialog/full-dialog-base';
import GButton from '../button/generic-button';
import HLine from '../num/line';
import { Input } from '../text-boxes/input';
import { Space } from '../space/space';


function SmartPanel( {operator, onFindStudent, onInsertValue, onSumReady } ) {


  const [typedScore, setTypedScore] = useState("");

  const [rawScore, setRawScore] = useState("");
  const [sumRawScore, setSumRawScore] = useState("");
  const [cleanRawScore, setCleanRawScore] = useState("");
  
  const [studentID, setStudentID] = useState("");

  const [enableClear, setEnableClear] = useState(true);
  const [enableScClear, setEnableScClear] = useState(true);

  const [isShow, setIsShow] = useState("");

  const [seekFoundIndex, setSeekFoundIndex] = useState(0);

  const [searchSize, setSearchSize] = useState(0);

  // const [prepend, setPrepend] = useState("");
  // const [append, setAppend] = useState("");
  

  useEffect(()=>{
      var cleanRaw = spreadScore( typedScore, operator );
      if(cleanRaw.length>0){
        onResultReady( Function("return " + cleanRaw )() );
      }else{ onResultReady( "0" ); }
  },[operator]
)


  function onResultReady(result){
    setSumRawScore( result );
    onSumReady(result);
  }


  function spreadScore(score, op){

    var spread = "";
    var cleanSpread = "";


    //USER USED COMMA
    if(score.includes(",")){
      setRawScore( score );
      var parts = (score.length>0)?score.split(",") : []; 
      for(var i=0; i<parts.length;i++){
        cleanSpread += (i<parts.length-1)? parser(parts[i]) + op : parser(parts[i]);
      }
      setCleanRawScore(cleanSpread);
    }//get score list


    //USER USED +
    else if(score.includes("+")){
      setRawScore( score );
      var parts = (score.length>0)?score.split("+") : []; 
      for(var i=0; i<parts.length;i++){
        cleanSpread += (i<parts.length-1)? parser(parts[i]) + op : parser(parts[i]);
      }
      setCleanRawScore(cleanSpread);
    }

    //USER USED SPACES
    else if(score.includes(" ")){
      setRawScore( score );
      var parts = (score.length>0)?score.split(" ") : []; 
      for(var i=0; i<parts.length;i++){
        cleanSpread += (i<parts.length-1)? parser(parts[i]) + op : parser(parts[i]);
      }
      setCleanRawScore(cleanSpread);
    }

    //USER USED VALUES IN 10s (2=>02, 20=>20)
    else{
      var scores = score.split(""); 

      //group in twos
      for(var i=1; i<=scores.length;i++){
        spread += scores[i-1];
        if(i%2==0 && i<scores.length){
          spread += "+";
        }
      }
      
      setRawScore( spread.replaceAll("+"," | ") );

      //clean the parts
      var parts = (spread.length>0)?spread.split("+") : [];
      for(var i=0; i<parts.length;i++){
        cleanSpread += (i<parts.length-1)? intParser(parts[i], 10) + op : intParser(parts[i], 10);
      }
      setCleanRawScore(cleanSpread);
    }
    return cleanSpread;
  }



  function parser(value){
    try{
      var v = parseFloat(value);
      if(isNaN(v)) return "0";
      return v;
    }catch(e){return "0"}

  }

  function intParser(value){
    try{
      var v = parseFloat(value);
      if(isNaN(v)) return "0";
      return v;
    }catch(e){return "0"}

  }


  function clearAppend(){
    document.getElementById("smPrepend").value = "";
    document.getElementById("smAppend").value = "";

    constants.prependText = "";
    constants.appendText = "";
    // setAutoClearDialog(false);
  }



  const clearInput = useMemo(()=>{
    return <Tippy  theme='tomato' delay={150} content='Quick Settings' placement='bottom'>
        <div style={{display:"flex", alignContent:"center"}}>
        <FaGear className={style.settingIcon} onClick={()=>{
          setAutoClearDialog(true)
        }} />
        </div>
    </Tippy>
  })



  const regInput = useMemo(()=>{
    return <Tippy  theme='tomato' delay={150} content='Search Student' placement='bottom'>
    <input autoComplete='off'

      onKeyUp={

        (event)=>{

          if(event.key == "Enter"){  //Enter key

            var reg = document.getElementById("studentID").value;
            var sID = constants.prependText  + reg + constants.appendText;
            setStudentID( sID ); 

            if(reg!=""){ //send a callback for search 

              // var found = [];
              constants.indicesFound = [];
              //look for all students with the same credentials
              constants.resultObject.forEach(
                  (row, index)=>{
                      if(row.reg.toLowerCase().includes(reg.toLowerCase()) || row.name.toLowerCase().includes(reg.toLowerCase())){
                          constants.indicesFound.push(index);
                      }
                  }
              )

              // constants.indicesFound = found;
              if(constants.indicesFound.length>0){ //found
                setSeekFoundIndex(0);
                setSearchSize(constants.indicesFound.length);
                constants.currentFoundStudentIndex = constants.indicesFound[0];
                onFindStudent( sID )

                

              }else{ //not found
                setSeekFoundIndex(-1);
                setSearchSize(0);
                constants.currentFoundStudentIndex = -1; 
                onFindStudent( sID )                 
              }

            }else{
                setSeekFoundIndex(0);
                setSearchSize(0);
                constants.currentFoundStudentIndex = -1; 
                // onFindStudent( sID )
            }

            // clear score to enable a new score to be typed
            if(enableScClear){
              document.getElementById("scoreID").value = "";
              setTypedScore("");
            }
            document.getElementById("scoreID").focus();
          }
        }
      }

      
      //dont allow sheet cell selection
      onKeyDown={
        (event)=>event.stopPropagation()
      }
      
      // onChange={
      //   (event)=>{ 
      //     setStudentID( 
      //       constants.prependText + event.target.value + constants.appendText 
      //     ); 
          
      //   }
      // } 


      id='studentID' className={style.score} type='text' placeholder='Enter Student ID'
    
    />
    </Tippy>
  }, [] )



  const scoreInput = useMemo(()=>{
    return <Tippy  theme='tomato' delay={150} content='Enter Score: e.g. 12 5 8 | 120508 | 12,5,8 | 12+5+8' placement='bottom'>
    <input autoComplete='off'

      //press Enter to go back to student reg
      onKeyUp={
        (event)=>{

          if(event.key == "Enter"){  //Enter key

            var typed = document.getElementById("scoreID").value;
            setTypedScore( typed.trim() )
            var cleanRaw = spreadScore( typed.trim(), operator );

            if(cleanRaw.length>0){
              var result = Function("return " + cleanRaw )();
              onInsertValue( result );
            }

            document.getElementById("studentID").focus();
            if(enableClear) {
              document.getElementById("studentID").value = "";
              setStudentID("");
            }

          }else{
            var typed = document.getElementById("scoreID").value;
            setTypedScore( typed.trim() )
            var cleanRaw = spreadScore( typed.trim(), operator );
            if(cleanRaw.length>0){
              onResultReady( Function("return " + cleanRaw )() );
            }else{ 
              onResultReady( "0" ); 
            }

          }

        }
      }

      //dont allow sheet cell selection
      onKeyDown={
        (event)=>event.stopPropagation()
      }     
     
     id='scoreID' className={style.regNumber} type='text'  placeholder='Enter Score'/>
    
    </Tippy>
  }, [] )


  const seekButton = useMemo(()=>{
    return <div className={style.findNext}> 
    <div onClick={
     ()=>{
       if(seekFoundIndex > 0){
         var prev = seekFoundIndex - 1;
         setSeekFoundIndex( prev );
         constants.currentFoundStudentIndex = (prev>=0 && prev <constants.indicesFound.length)? constants.indicesFound[prev] : -1;
         onFindStudent( studentID )
       }else{

         var prev = constants.indicesFound.length-1;
         setSeekFoundIndex( prev );
         constants.currentFoundStudentIndex = (prev>=0 && prev <constants.indicesFound.length)? constants.indicesFound[prev] : -1;
         onFindStudent( studentID )

       }
     }
   } 
   className={style.control}> <FaAngleLeft /> </div>
   
   <div className={style.searchNum}> 

     { ( searchSize>0 )? (seekFoundIndex + 1) +" of " +  searchSize : "0 of 0" }
  
   </div>
     
   <div onClick={
     ()=>{
       if( seekFoundIndex < constants.indicesFound.length-1 ){
         var next = seekFoundIndex + 1;
         setSeekFoundIndex( next );
         constants.currentFoundStudentIndex = (next>=0 && next <constants.indicesFound.length)? constants.indicesFound[next] : -1;
         onFindStudent( studentID )
       }else{

        var next = 0;
         setSeekFoundIndex( next );
         constants.currentFoundStudentIndex = (next>=0 && next <constants.indicesFound.length)? constants.indicesFound[next] : -1;
         onFindStudent( studentID )

       }
     }
   } 
   className={style.control}> <FaAngleRight /> </div>
   
 </div>
  })

  const scoreBreakdown = useMemo(()=>{
    return <div className={(cleanRawScore.length>0)?style.rawScorePane:style.rawScoreNone}>

    <Tippy  theme='tomato' delay={150} content={ (rawScore.length>0)? rawScore : "Enter score" } placement='bottom'>
      <div className={style.cleanRawScore}> { (cleanRawScore)?"("+cleanRawScore+")":"" } </div>
    </Tippy>


    {/* <Sum num={( !isNaN(sumRawScore) )? sumRawScore :"***"} /> */}


    </div>
  })



  const [autoClearDialog, setAutoClearDialog] = useState(false);
  const autoClearUI = useMemo(()=>{
    return <FullDialogBase isCenter="true" isScaleAnim={true} isCloseButton={true} id="smartsettings" items={ 
    
      <div style={{padding:'0 20px', display:"flex", flexDirection:"column"}}>

        <label style={{marginBottom:'5px'}} className='dialogTitle'> Quick Settings </label>
        
        <HLine/>



        <div className={style.appendArea} style={{marginTop:'15px', marginBottom:"3px"}}>
        <label style={{fontWeight:"500", flex:"1"}} className='dialogTitle'> Student ID </label>
        <div style={{display:'flex', justifyContent:'end'}}>
          <GButton title="Clear Prepend & Append" onClick={()=>clearAppend()} />
        </div>

        </div>

        


        <div className={style.appendArea}>

          <div className={style.append}>
            <label style={{ fontWeight:"500"}}>Prepend</label>
            <span>Text to prepend(before) to Student ID</span>
            <Input id="smPrepend" onChange={(value)=>constants.prependText=value}/>
          </div>

          <Space/> <Space/>

          <div className={style.append}>
            <label style={{ fontWeight:"500"}}>Append</label>
            <span>Text to append(after) to Student ID</span>
            <Input id="smAppend" onChange={(value)=>constants.appendText=value}/>
          </div>
        </div>

         
        

        <label style={{marginTop:'15px', fontWeight:"500", marginBottom:"2px"}} className='dialogTitle'> Student ID/Score Input Fields </label>
        <div onClick={ ()=>{ setEnableClear(!enableClear); } } className={`${style.cls} `}>
          { (enableClear)? <FaSquareCheck /> : <FaRegSquare /> }
          <label>Auto Clear Student ID Field</label>
        </div>


        <div onClick={ ()=>{ setEnableScClear(!enableScClear); } } className={`${style.cls} `}>
          { (enableScClear)? <FaSquareCheck /> : <FaRegSquare />  }
          <label>Auto Clear Score Field</label>
        </div>

        <label style={{marginTop:'15px', fontWeight:"500", marginBottom:"2px"}} className='dialogTitle'> Dialog Visibility </label>
        
        <div onClick={ ()=>{
           constants.doNotShowExistingStudentDialog = !constants.doNotShowExistingStudentDialog;
           setIsShow(Math.random())
         } } className={`${style.cls} `}>
        { (constants.doNotShowExistingStudentDialog)? <FaRegSquare /> : <FaSquareCheck />  }
        <label>Show Confirm Add Dialog for Non-Existing Student</label>
        </div>


        <div style={{display:'flex', justifyContent:'end', marginTop:'15px'}}>
          <GButton title="Okay" isFilled={true} onClick={()=>setAutoClearDialog(false)} />
        </div>


      </div>
  
    } 
    onClose={ ()=>{ setAutoClearDialog(false); } }
    dialogState={autoClearDialog}
  />
  })



  return (

      <div className={`${style.smartPanel} `}>

        {clearInput}

       <div className={style.inputPane}>
          {regInput}
          {scoreInput}
       </div>


       <Num2 num={studentID.length} tooltipText='Length of Student ID' />


       {seekButton}
       {scoreBreakdown}

       {autoClearUI}


      </div>

  );
};

export default SmartPanel;
