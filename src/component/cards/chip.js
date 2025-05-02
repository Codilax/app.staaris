import { FaCheckCircle } from 'react-icons/fa'
import style from './chip.module.css'

export function Chip({title, styles, active }){
    return <div style={styles} className={`${style.chip}`}>
        <label>{title}</label> <FaCheckCircle className={(active)?style.active:style.inactive} />
    </div>
}