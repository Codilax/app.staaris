import Tippy from '@tippyjs/react';
import style from './num.module.css'

function Num2( { num, tooltipText } ){
    return(

        (num>0)?
        <Tippy  theme='tomato' delay={150} content={tooltipText} placement='bottom'>
            <div className={`${style.num2}`} > { num } </div>
        </Tippy>
        :<></>
        
    )
}

export default Num2;