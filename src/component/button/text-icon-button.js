
import style from './text-icon-button.module.css';

function TextIconButton({ title, icon, onClick}){
    return(

        <div onMouseMove={(e)=>{e.stopPropagation();}} className={style.button} onClick={ ()=>{ onClick(); } } >

            {icon}
            <div > {title} </div>

        </div>
        
    )
}
export default TextIconButton;