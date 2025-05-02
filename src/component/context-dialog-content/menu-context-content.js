import style from './menu-context-content.module.css'

export function MenuContextContent( {title} ){
    return(
        <div className={`${style.items}`} > 
            <label className={style.title}>{title}</label>
        </div>
    )
}