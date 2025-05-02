'use client';

import React, { useEffect, useState } from 'react';
import style from './page.module.css'
import constants from '../constants';
import { allSysInfo, cpuInfo, memoryInfo, networks, staticInfo } from 'tauri-plugin-system-info-api';




export default function Home() {

  const [info, setInfo] = useState("Click here for system info");

  async function getInfo(){

    var i = await staticInfo();
    // var y = await allSysInfo();
    // var x = await networks();
    // var x = await memoryInfo();
    // var x = await cpuInfo();
    // var x = (await allSysInfo()).disks;
    setInfo(JSON.stringify(i));

  }

  const [currentTime, setCurrentTime] = useState("...");

  useEffect(
    ()=>{
        setCurrentTime(getTime())
        setInterval(() => {
          setCurrentTime(getTime())
        }, 5000 )

        return ()=>{
          clearInterval()
        }
    }, []
  )



  function getDate(){

    var date = new Date();

    let day = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();
    
    let dayInM = date.getDate();
    dayInM = dayInM.toString().padStart(2, '0');
    
    let mergeDate = getDayString(day) +", "+ getMonthString(month) + ' ' + dayInM;
    return mergeDate;
  }


  function getMonthString(month){
    switch (month) {
      case 0: return "Jan";
      case 1: return "Feb";
      case 2: return "Mar";
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


  
  function getDayString(day){
    switch (day) {
      case 0: return "Sun";
      case 1: return "Mon";
      case 2: return "Tue";
      case 3: return "Wed";
      case 4: return "Thur";
      case 5: return "Fri";
      case 6: return "Sat";
    
      default: return "Sun";
    }
  }


  function getTime(){
    var date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes.toString().padStart(2, '0');
    let mergeTime = hours + ':' + minutes;
    return mergeTime;
  }


  function getAMPM(){
    var date = new Date();
    let hours = date.getHours();
    let x = hours >= 12 ? 'PM' : 'AM';
    return x;
  }
 


  return (

    <div className={`${style.home}`}>

      <div className='row'>


        {/* <div style={{ height:"80vh", overflow:"auto", background:"black", color:"white", padding:"30px"}} onClick={async ()=>await getInfo()} >
            {info}
        </div> */}


      <div  className='col-12 '>

        <div style={{paddingTop:"5vh", paddingLeft:"4%"}}>
        
          <label style={{fontSize:"120px"}} className={style.appname} > {constants.appName} </label>
          <label style={{fontSize:"55px", paddingLeft:"10px"}} className={style.version} > {constants.appVersion} </label>
        
        </div>

      <div style={{paddingTop:"5vh", paddingLeft:"4%"}}>

      <div> 
          <label style={{fontSize:"75px"}} className={style.time}>{ 
            currentTime
          }</label>
          <label className={style.ampm}>{getAMPM()}</label>
       </div>
       <label className={style.date}>{getDate()}</label>

      </div>
      
      </div>
  
</div>

</div>
    

  );
  
}
