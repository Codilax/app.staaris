import style from './home-icard.module.css'

function HomeiCard( { title, icon, isShadow } ){
    return(
        <div className={`${style.homeiCard} ${isShadow? style.shadow:""}`} >

            <div className={style.icon}>{ icon }</div> 
            <label className={style.title}>{title}</label>
             
        </div>
    )
}

export default HomeiCard;