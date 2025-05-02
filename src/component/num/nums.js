import Tippy from '@tippyjs/react';
import style from './num.module.css'

function Nums( { num, tooltipText } ){
    return(

        
        <Tippy  theme='tomato' delay={150} content={tooltipText} placement='bottom'>
            <div className={`${style.num2}`} > { num } </div>
        </Tippy>
      
        
    )
}

export default Nums;