import style from './text-box.module.css';

export function NumberInput({ defaultValue, placeholder, onChange, onEnter }){
    return <input type='number'
        onMouseMove={(e)=>{e.stopPropagation();}}
        onChange={(e)=>onChange(e.currentTarget.value)}
        
        onKeyUp={ 
            (e)=>{
                if( e.key === "Enter" ){
                    if(onEnter != undefined){onEnter()};
                }
            } 
        } 

        className={style.input} 
        placeholder={placeholder}  
        defaultValue={defaultValue? defaultValue:""}
    />
}