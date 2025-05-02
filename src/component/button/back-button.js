
import { FaAngleLeft } from 'react-icons/fa6';
import style from './button.module.css';
function BackButton({title, onClick}){
    return(
        <div onMouseMove={(e)=>{e.stopPropagation();}} onClick={ ()=>{ onClick(); } } 
        className={style.backButton}> 
            <FaAngleLeft size={16} />
            <div style={{marginLeft:"2px"}}>  {title} </div> 
        </div>
    )
}
export default BackButton;