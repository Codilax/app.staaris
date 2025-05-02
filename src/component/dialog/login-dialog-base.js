'use client'

import style from './login-dialog-base.module.css';

import React, { useState } from 'react';

export function LoginDialogBase( {items, dialogState } ){


    return(
        <div className={ `${style.cover}  ${(dialogState)?style.open: style.close}` }>

            {items}
            
        </div>
    )
}