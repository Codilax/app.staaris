
import { FaFile, FaTrash, FaXmark } from 'react-icons/fa6';
import style from './select-templates.module.css';
import constants from '../../constants';
import Num2 from '../num/num2';
import HLine from '../num/line';


function SelectTemplates( { onSelect , onClose} ){

   
    return(

        
<div className={`${style.menuItems}`} > 

<div style={{padding:"0 10px"}} className='d-flex align-items-center mb-1'>
            <label className='dialogTitle'>Select Template</label>
        </div>

<HLine/>

        <div className={`${style.templatesPane} slimScroll`}>

            {(constants.templates.length>0)?constants.templates.map(
                
                    (item, index)=>{
                        
                        return <div 
                        
                            key={ item.name }
                            onClick={ ()=>{
                                onSelect(item)
                            } }
                            className={`${style.template}`}> 
                            

                            <Num2 num={index+1} />

                            <div className={style.detail} >
                                
                                <label style={{cursor:'pointer'}}>{item.name} </label>
                                <label style={{cursor:'pointer', fontSize:'12px', fontStyle:'italic', marginTop:'2px'}}>{item.date} </label>

                            </div>

                        </div>
                    }
                
            ):
            <div className={style.noData}>
                <FaFile size={25} color='var(--brand-color)' />
                <label>No Template</label>
                <label>Please go to Settings to add Template</label>
            </div>
            
            
            }
        </div>



        </div>

        


    )

}


export default SelectTemplates;