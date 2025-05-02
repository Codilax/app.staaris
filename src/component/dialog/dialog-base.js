
import { FaCircleXmark, FaClosedCaptioning, FaXmark } from 'react-icons/fa6';
import style from './dialog-base.module.css'
import React, { useState } from 'react';

function DialogBase( {isScaleAnim, isOpaque, position, id, items, dialogState, isCloseButton, onClose } ){

    React.useEffect(() => {

        if(position){
            var dialogBody = document.getElementById('dialogBody'+id);
            if(position.left=="right"){
                dialogBody.style.position = 'absolute';
                dialogBody.style.right =  "8px";
                dialogBody.style.top = position.top + "px"; 
            }else{
                dialogBody.style.position = 'absolute';
                dialogBody.style.left = position.left + "px";
                dialogBody.style.top = position.top + "px"; 
            }
             
        }
        
    }, []);


    
    return(
        <div onClick={
            ()=>{
                onClose()
            }
            } className={ `${style.cover} ${ style.center } 
                ${
                (dialogState)?
                    (isScaleAnim)?style.open2:style.open: (isScaleAnim)?style.close2:style.close
                }` }>


            <div id={'dialogBody'+id} onClick={(e)=>{e.stopPropagation()}} className={ `${style.pane} ${isOpaque? style.opaque:""}` }>

                {(isCloseButton)?
                    <div onClick={()=>{onClose()}} className={style.closeButton}> <FaXmark/> </div>:<></>
                }
                {items}

            </div>

            
            
        </div>
    )
}

export default DialogBase;