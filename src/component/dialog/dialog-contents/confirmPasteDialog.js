
import style from './dialog-content.module.css'
import HLine from '../../num/line';
import { Space } from '../../space/space';
import Button from '../../button/button';
import constants from '../../../constants';

export function ConfirmPaste({pasteInfo, onPaste, onCancel} ){

    return(

        <div className={`${style.menuItems}`} > 
    
        <div className='d-flex flex-column mb-1 dialogTitle'>
            <label  >Paste</label>
        </div>


        <HLine />
        

        <div className={`d-flex flex-column ${style.tabBody}`} >

            <label className={`${style.label} mt-1 `}>
            
            Data will be pasted into the 
            {(pasteInfo.dataType=="number")? " '" +constants.template[pasteInfo.col]['name'] +"' " : ( constants.toggleName)? " 'Student Name' " : " 'Student ID' "  }
            column starting from student number {(pasteInfo.row)+1}.
            
            
            </label>
        
            <div className='mt-3 d-flex justify-content-end'>

                <Button title="Paste" onClick={()=>{
                    onPaste();
                }} />

                <Space />


                <Button title="Cancel" onClick={()=>{
                    onCancel();
                }} />


            </div>

        </div>


        
        </div>
    )
}