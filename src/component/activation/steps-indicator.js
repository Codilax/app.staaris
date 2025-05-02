import style from './steps.module.css';


export default function StepIndicators({ steps, current, gotoStep }){


    var indices = [];
    for(var i=0; i< steps; i++){
        indices[i] = i;
    }

    return(
        <div className={style.steps}>
            {
                indices.map(
                    (item, index)=> <div key={index} onClick={()=>gotoStep(index+1)} className={ `${(index<current)? style.selectedStep : style.step } ${((index)==current-1)? style.current:""}` }></div>
                )
            }
        </div>
    )

}