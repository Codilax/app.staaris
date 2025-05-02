
import Button from '../button/button';
import style from './confirm-dialog.module.css'

import HLine from '../num/line';
import { Space } from '../space/space';


function ConfirmDialog({title, subTitle, body, negative, positive, onNegative, onPositive} ){

    return(

        <div className={`${style.menuItems}`} > 
        
        <div className='d-flex flex-column mb-1'>
            <label className='dialogTitle' >{title}</label>
            <label className='subTitle' >{subTitle}</label>
        </div>

        <HLine />

        <div className={`d-flex flex-column ${style.tabBody}`} >

            <label className={`${style.label} mt-1`}>{body}</label>
        
            <div className='mt-3 d-flex justify-content-end'>

                <Button title={positive} onClick={()=>{
                   onPositive();
                }} />

                <Space />

                <Button title={negative} onClick={()=>{
                    onNegative();
                }} />


            </div>

        </div>

        </div>
    )
}
export default ConfirmDialog;