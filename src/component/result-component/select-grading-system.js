
import { FaFile, FaXmark } from 'react-icons/fa6';
import style from './select-grading-system.module.css';
import constants from '../../constants';
import Num2 from '../num/num2';
import HLine from '../num/line';

function SelectGradingSystem( { onSelect , onClose} ){

    return(

        <div className={`${style.menuItems}`} > 

        <div style={{padding:"0 10px"}} className='d-flex align-items-center mb-1'>
            <label className='dialogTitle'>Select Grading System</label>
        </div>

        <HLine/>

        <div className={`${style.templatesPane} slimScroll`}>

            {(constants.gradingSystems.length>0)?constants.gradingSystems.map(
                
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
                <label>No Grading System</label>
                <label>Please go to Settings to add Grading System</label>
            </div>
            
            }
        </div>

        </div>

    )

}


export default SelectGradingSystem;