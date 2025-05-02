
import Tippy from '@tippyjs/react';
import style from './generic-button.module.css';

function GButton({icon, title, isFilled, tooltip, onClick}){
    
    return(

        (tooltip)?
        <Tippy  theme='tomato' delay={150} content={tooltip} placement='bottom'>
        
        <div onMouseMove={(e)=>{e.stopPropagation();}} onClick={(event)=>{ onClick(event) }} className={(isFilled)?style.filled: style.unfilled}>

            {(icon)? icon: <></> }

            {(icon && title)? <div className={style.space} />: <></> }

            {(title)? <div> {title} </div> : <></> }
                
        </div>
    </Tippy>

:

        <div onMouseMove={(e)=>{e.stopPropagation();}} onClick={(event)=>{ onClick(event) }} className={(isFilled)?style.filled: style.unfilled}>

            {(icon)? icon: <></> }

            {(icon && title)? <div className={style.space} />: <></> }

            {(title)? <div> {title} </div> : <></> }
                
        </div>

    )
}
export default GButton;