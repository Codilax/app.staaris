import electron from 'electron';
import React from 'react';
import style from './grade-panel.module.css'
import Tippy from '@tippyjs/react';
import Num from '../num/num';


import {FaCalculator, FaCircleMinus, FaCirclePlus, FaCircleStop, FaCircleXmark, FaKey, FaLock, FaPlugCirclePlus, FaPlusMinus} from 'react-icons/fa6'
import DialogBase from '../dialog/dialog-base';
import Num2 from '../num/num2';

// const ipcRenderer = electron.ipcRenderer || false;

function GradeStatPanel( { gradeFrequencies } ) {

  const [operator, setOperator] = React.useState("+");

  const [typedScore, setTypedScore] = React.useState("");
  

  const [rawScore, setRawScore] = React.useState("");
  const [sumRawScore, setSumRawScore] = React.useState("0");
  const [cleanRawScore, setCleanRawScore] = React.useState("0");
  
  const [operatorDialog, setOperatorDialog] = React.useState(false);

  const [studentID, setStudentID] = React.useState(false);
  

  

  // async function onCloseOperatorDialog(op) {

  //   setOperatorDialog(!operatorDialog);

  //   setOperator(op);

  //   // spreadScore(typedScore);

  //   var cleanRaw = spreadScore( typedScore, op );

  //   if(cleanRaw.length>0){
  //     setSumRawScore( Function("return " + cleanRaw )() );
  //   }else{ setSumRawScore( "0" ); }
    
  // }



  // function spreadScore(score, op){

  //   var spread = "";
  //   var cleanSpread = "";


  //   //USER USED COMMA
  //   if(score.includes(",")){
      
  //     setRawScore( score );
  //     var parts = (score.length>0)?score.split(",") : []; 
  //     for(var i=0; i<parts.length;i++){
  //       cleanSpread += (i<parts.length-1)? parseFloat(parts[i]) + op : parseFloat(parts[i]);
  //     }
  //     setCleanRawScore(cleanSpread);

  //   }//get score list

  //   //USER USED +
  //   else if(score.includes("+")){
      
  //     setRawScore( score );
  //     var parts = (score.length>0)?score.split("+") : []; 
  //     for(var i=0; i<parts.length;i++){
  //       cleanSpread += (i<parts.length-1)? parseFloat(parts[i]) + op : parseFloat(parts[i]);
  //     }
  //     setCleanRawScore(cleanSpread);
  //   }

  //   //USER USED SPACES
  //   else if(score.includes(" ")){
      
  //     setRawScore( score );
  //     var parts = (score.length>0)?score.split(" ") : []; 
  //     for(var i=0; i<parts.length;i++){
  //       cleanSpread += (i<parts.length-1)? parseFloat(parts[i]) + op : parseFloat(parts[i]);
  //     }
  //     setCleanRawScore(cleanSpread);
  //   }

  //   //USER USED VALUES IN 10s (2=>02, 20=>20)
  //   else{

  //     //comma separated
  //     var scores = score.split(""); 

  //     //group in twos
  //     for(var i=1; i<=scores.length;i++){
  //       spread += scores[i-1];
  //       if(i%2==0 && i<scores.length){
  //         spread += "+";
  //       }
  //     }

      
  //     // setRawScore( spread.replace( new RegExp( "/+/", 'g'), " | " ) );
  //     setRawScore( spread.replaceAll("+"," | ") );

  //     //clean the parts
  //     var parts = (spread.length>0)?spread.split("+") : [];
  //     for(var i=0; i<parts.length;i++){
  //       cleanSpread += (i<parts.length-1)? parseInt(parts[i], 10) + op : parseInt(parts[i], 10);
  //     }
  //     setCleanRawScore(cleanSpread);
  //   }
      
  //   return cleanSpread;

  // }


  return (

      <div className={`${style.statPanel} `}>

     

        {
          gradeFrequencies.map(
            
            (item, index)=>{
              
              return  <div key={index} className={style.grade}>
                        <div>{item.grade}</div>
                        <label>{item.frequency}</label>
                      </div>
            
              
            }
          )
        }


      </div>

  );
};

export default GradeStatPanel;
