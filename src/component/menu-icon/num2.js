import Tippy from '@tippyjs/react';
import style from './num.module.css'

function Num2( { num } ){
    return(


        (num>0)?
        <Tippy  theme='tomato' delay={150} content='Length of Student ID' placement='bottom'>
            <div className={`${style.num2}`} > { num } </div>
        </Tippy>
        :<></>


        
    )
}

export default Num2;