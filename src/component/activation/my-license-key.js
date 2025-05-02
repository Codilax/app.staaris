import React, { useState } from 'react';
import style from './activate.module.css';
import Button from '../button/button';
import { Input } from '../text-boxes/input';
import constants from '../../constants';

function MyKey( { onClose } ){

    return(

        <div style={{padding:"10px 20px"}} className={`${style.pane} `}>

            <div style={{paddingBottom:"10px"}} className='d-flex align-items-center'>
                <label className='dialogTitle'>License Key ({constants.activatedMessage}) </label>
            </div>

        
            <label>My Activation Key:</label>
            <label style={{ color:"var(--brand-color)", userSelect:"text"}}> AXMN-EODHC-278W-HSGA </label>

            
                {
                    (constants.activatedMessage.toLowerCase() === "activated")? <></> :
                    <div style={{marginTop:"20px"}}><Button title="Renew Activation Now" onClick={()=>onClose()}/> </div>
                }
            

        </div>
    )

}
export default MyKey;