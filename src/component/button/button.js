
import style from './button.module.css';

function Button({id, title, isAnimate, onClick}){
    return(
        <div onMouseMove={(e)=>{e.stopPropagation();}} id={id} onClick={ ()=>{ onClick(); } } className={`${style.button} ${(isAnimate)?style.anim:""}`}> {title} </div>
    )
}
export default Button;