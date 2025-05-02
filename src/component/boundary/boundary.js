import style from './boundary.module.css';

function Boundary({min, max}){
    return(
        <div className={style.boundary}> 
           {min + " - " + max}
        </div>
    )
}

export default Boundary;