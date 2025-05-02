
import style from './text-button.module.css';

function TextButton({id, title, onClick}){
    return(
        <div onMouseMove={(e)=>{e.stopPropagation();}} id={id} onClick={ (event)=>{ onClick(event); } } className={style.button}> {title} </div>
    )
}
export default TextButton;