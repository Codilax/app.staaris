import constants from '@/constants';
import style from './skeleton.module.css'


function Skeleton( { rowIndex } ){
    return(
        <li className={`${style.fakeRowItem} `}>

            <label style={{ ["width" ]: "4%",  }} className={style.serial}> {rowIndex+1} </label>
            
            {/* <label style={{ ["width"]: "96%",   }} className={style.reg} > {constants.resultObject[rowIndex]['reg']} </label>             */}
        
        </li>

    ) //end of return
}

export default Skeleton;