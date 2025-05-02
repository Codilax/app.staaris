
import { FaLock, FaStar } from 'react-icons/fa6';
import style from './save-button.module.css';
import { forwardRef, useImperativeHandle, useState } from 'react';
import constants from '@/constants';


const SaveButton = forwardRef((props, ref) => {

    const [refresh, setRefresh] = useState("");

    useImperativeHandle(ref, () => ({
        onSaved(){
          setRefresh(Math.random());
        }
    }));


    return(

        <div 
        onMouseMove={(e)=>{e.stopPropagation();}} 
        id={props.id} onClick={ ()=>{ props.onClick(); } } 
        className={`${style.button} ${(constants.isSaved)?"":style.anim}`}> 

        
        {props.title} 
        <FaLock size={10} style={{ marginLeft:"4px" }} />

        </div>
    )

})

SaveButton.displayName = "saveButton";
export default SaveButton;


// function SaveButton({id, title, isAnimate, onClick}){
//     return(
//         <div 
//         onMouseMove={(e)=>{e.stopPropagation();}} 
//         id={id} onClick={ ()=>{ onClick(); } } 
//         className={`${style.button} ${(isAnimate)?style.anim:""}`}> 

        
//         {title} 
//         <FaLock size={10} style={{ marginLeft:"4px" }} />

//         </div>
//     )
// }
// export default SaveButton;