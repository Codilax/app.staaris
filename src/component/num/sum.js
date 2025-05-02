import Tippy from '@tippyjs/react';
import style from './num.module.css'

export function Sum( { num } ){
    return(

         <Tippy  theme='tomato' delay={150} content='Computed Result' placement='bottom'>
        
        <div className={`${style.sum}`} > 
            
            <div>{ num }</div>
            
        </div>

         </Tippy>
    )
}

export default Sum;