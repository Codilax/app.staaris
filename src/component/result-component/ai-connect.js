import { useEffect, useState } from 'react';
import Button from '../button/button';
import style from './ai-connect.module.css';

import HLine from '../num/line';
// import QR from 'qrcode';

// import electron from 'electron';
// const ipcRenderer = electron.ipcRenderer || false;


export function AIConnect( {psrc, pip} ){

    const [ src, setSRC] = useState( "" );
    const [ip, setIP] = useState( "" );

    useEffect( ()=>{
        setIP(pip);
        setSRC(psrc);
    }, [pip] )


    return(

        <div className={`${style.menuItems}`} > 
        <label style={{marginBottom:"5px"}}  className="dialogTitle">AI Assist</label>

        <HLine/>
    
        {

            ( ip=="" || ip.startsWith("127.0.0.1") )?
            <div className={` ${style.tabBody} ${style.scrollX}`} >

            <label className={style.welcome}>Welcome to AI Assist </label>
            <label className={style.line2}>It seems you are not connected to any network.</label>
            <label className={style.line2}> Please connect and refresh.</label>  
            <div className='mb-2'></div>

            <Button title="Refresh" onClick={()=>{

                // ipcRenderer.send("get-connection");

                // ipcRenderer.once('on-get-connection', (event, data) => {
                //     setIP(data);
                //     if(data!="" && data!="127.0.0.1"){
                //       QR.toDataURL( data ).then((imgSrc)=>setSRC(imgSrc))
                //     }
                //   });

            }} />


            </div>

            :

            <div className={` ${style.tabBody} ${style.scrollX}`} >

                <label className={style.welcome}>Welcome to AI Assist </label>
                <label className={style.line2}>Reduce your workload with AI Assisted result entry.</label>
                <label className={style.line2}> Scan QR-Code below using the Staaris Mobile Application.</label>  
            
                <div style={{marginBottom:"15px"}}  className={style.shadow}> 
                    <img src={src} width="170px" height="170px" />
                </div>

                <Button title="Refresh Code" onClick={()=>{

                    // ipcRenderer.send("get-connection");

                    // ipcRenderer.once('on-get-connection', (event, data) => {

                    //     setIP(data);
                    //     if(data!="" && data!="127.0.0.1"){
                    //       QR.toDataURL( data ).then((imgSrc)=>setSRC(imgSrc))
                    //     }
                    //   });


                }} />
            

            </div>

        }

        </div>
    )
}