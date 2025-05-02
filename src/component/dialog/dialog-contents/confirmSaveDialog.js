
import style from './dialog-content.module.css'
import HLine from '../../num/line';
import { Space } from '../../space/space';
import Button from '../../button/button';
import constants from '../../../constants';

export function ConfirmSave({onSave, onClose, onCancel} ){

    return(

        <div className={`${style.menuItems}`} > 
    
        <div className='d-flex flex-column mb-1 dialogTitle'>
            <label  >Save Changes</label>
        </div>


        <HLine />
        

        <div className={`d-flex flex-column ${style.tabBody}`} >

            <label className={`${style.label} mt-1 `}>
            
            Do you want to save changes to &apos;{constants.resultName}&apos; before closing?
            
            
            </label>
        
            <div className='mt-3 d-flex justify-content-end'>

                <Button title="Save and close" onClick={()=>{
                    onSave();
                }} />

                <Space />

                <Button title="Do not save" onClick={()=>{
                    onClose();
                }} />

                <Space />


                {/* <Button title="Cancel Dialog" onClick={()=>{
                    onCancel();
                }} /> */}


            </div>

        </div>


        
        </div>
    )
}