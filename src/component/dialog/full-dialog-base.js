'use client'

import { FaXmark } from 'react-icons/fa6';
import style from './full-dialog-base.module.css';

import React, { useState } from 'react';

export function FullDialogBase( { isCenter, isTransparent, isOpaque, isCloseButton, isOpaqueCover, id, isScaleAnim, items, dialogState, onClose } ){

    var x = 0;
    var y = 0;

    const [coord, setCoord] = useState("");

    function start(e){
        try{
            var element = document.getElementById( 'dialogBody'+id );
            element.setAttribute("data-v", "true");
            x = e.clientX - element.offsetLeft;
            y = e.clientY - element.offsetTop;
            window.onmousemove = (e) =>  move(e)
        }catch(e){}
    }


    function move(e){
        try{
            var element = document.getElementById( 'dialogBody'+id );
            if ( element.getAttribute("data-v") == "true" ) {
                if(e.clientX > 15 && e.clientX < (window.innerWidth-20) && e.clientY>15 && e.clientY < (window.innerHeight-20) ){
                    element.style.position = "absolute";
                    element.style.left = (e.clientX - x) + "px";
                    element.style.top = (e.clientY - y) + "px";
                }                
            }
        }catch(e){}
    }


    function end(e){
        try{
            var element = document.getElementById( 'dialogBody'+id );
            element.setAttribute("data-v", "false");
        }catch(e){}
    }

    
    return(
        <div
            onClick={
            ()=>{
                try{
                    element.setAttribute("data-v", "false");
                }catch(e){}
                onClose()
            }
            } className={ `${style.cover} ${(isOpaqueCover)?style.opaque:''} ${ (isCenter)? style.center:"" }
                ${
                (dialogState)?
                    (isScaleAnim)?style.open2:style.open: (isScaleAnim)?style.close2:style.close
                }
            ` }>

            <div data-v=""
            
            id={'dialogBody'+id} onClick={(e)=>{e.stopPropagation()}} className={ `  ${ (isTransparent)? style.transparent: style.pane } ${isOpaque? style.opaque:""} ` }>


                
                    <div 
                        onMouseDown={(event)=>start(event)} onMouseUp={(event)=>end(event)} 
                        className={style.dragRegion}  > 
                    </div>


                {(isCloseButton)?
                    <div onClick={()=>{onClose()}} className={style.closeButton}> <FaXmark/> </div>:<></>
                }
                {items}

            </div>

        </div>
    )
}