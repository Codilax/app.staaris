import style from './text-box.module.css';


export function TextField({placehoder, onChange , type }){
    return <input onMouseMove={(e)=>{e.stopPropagation();}} onChange={(e)=>onChange(e.currentTarget.value)} className={style.input} placeholder={placehoder} type={type} />
}