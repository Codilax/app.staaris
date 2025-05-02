
import { FaLock } from 'react-icons/fa';
import style from './button.module.css';

function ActivateButton({ title, onClick}){
    return(

        <div  onClick={(event)=>{ onClick(event) }} className={style.activateButton}>

        <FaLock style={{marginRight:"5px"}} />
        {title}
                
        </div>

    )
}
export default ActivateButton;