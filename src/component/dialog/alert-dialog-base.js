
import style from './alert-dialog-base.module.css';

import React, { useState } from 'react';

export function Alert( { isCenter, title, subtitle, dialogState, onClose } ){

    
    return(
        <div onClick={
            ()=>{
                onClose()
            }
            } className={ `${style.cover} ${(dialogState)?style.open: style.close}` }>

            <div onClick={(e)=>{e.stopPropagation()}} className={ ` ${ (isCenter)? style.center:"" }  }` }>

                <label>{title}</label>
                <label>{subtitle}</label>

            </div>
            
        </div>
    )
}