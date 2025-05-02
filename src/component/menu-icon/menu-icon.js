import Tippy from '@tippyjs/react';
import style from './menu-icon.module.css'
import { FaBarsStaggered } from 'react-icons/fa6';

function MenuIcon( { onMenu } ){
    return(

        <Tippy  theme='tomato' delay={150} content='Menu' placement='bottom'>
            <div onClick={()=>onMenu()} className={`${style.menuicons}`} > 
                <FaBarsStaggered size={17} />
            </div>
        </Tippy>
        
    )
}

export default MenuIcon;