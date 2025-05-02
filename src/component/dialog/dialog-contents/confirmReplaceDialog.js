
import style from './dialog-content.module.css'
import HLine from '../../num/line';
import { Space } from '../../space/space';
import Button from '../../button/button';

export function ConfirmReplaceCell({onOk, onCancel, oldValue, newValue} ){

    return(

        <div className={`${style.menuItems}`} > 
    
        <div className='d-flex flex-column mb-1'>
            <label style={ { color:"var(--black-text)", fontSize:"14px" } } >Replace Cell Value</label>
        </div>


        <HLine />
        

        <div className={`d-flex flex-column ${style.tabBody}`} >

        <label className={`${style.label} mt-1`}>
            
            This cell has a value {oldValue}, do you want to replace {oldValue} with {newValue}?</label>
        
            <div className='mt-3 d-flex justify-content-end'>

                <Button title="Cancel" onClick={()=>{
                    onOk();
                }} />

                <Space />

                <Button title="Replace Value" onClick={()=>{
                    onCancel();
                }} />
            </div>

        </div>


        
        </div>
    )
}