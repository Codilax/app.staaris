import style from './num.module.css'

function Num( { num } ){
    return(
        <div className={`${style.num}`} > { num } </div>
    )
}

export default Num;