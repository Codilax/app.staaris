
import style from './dialog-content.module.css'
import HLine from '../../num/line';

export function InfoDialog({title, body} ){
    return(
        <div className={`${style.menuItems}`} > 
            <label style={{marginBottom:"5px"}} className={style.title} >{title}</label>
            <HLine />
            <div className={`d-flex flex-column ${style.tabBody}`} >
                    {body}
            </div>
        </div>
    )
}