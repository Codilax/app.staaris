import style from './loading.module.css'

export function Loading({isCenter, state}){
    return(
        <div className={`${style.cover} ${(state)? style.inProgress : style.none} ${isCenter? style.central:""} `}>
           
            <div  className={`${style.loading} spinner-border`}></div>
          
        </div>
    )
} 


//className=