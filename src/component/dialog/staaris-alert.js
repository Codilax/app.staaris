import React, { useMemo, useState } from 'react';
import { FullDialogBase } from './full-dialog-base';
import { InfoDialog } from './dialog-contents/infoDialog';

export function StaarisAlert({ id, title, body, onClose, alertState }){

    const infoBox = useMemo(
        ()=>{
            return <FullDialogBase isOpaque={true} isCloseButton="true" isCenter="true" isScaleAnim="true" id={id} items={ 
              <InfoDialog title={title} body={body} /> 
            } 
                onClose={ ()=>{ onClose() } }
                dialogState={ alertState }
            />
        }
      )

    return(
        infoBox
    )
}

