
import style from './summary-results.module.css';
import { NoData } from '../no-data';
import { FaClone } from 'react-icons/fa6';
import HLine from '../num/line';
import Num2 from '../num/num2';
import GButton from '../button/generic-button';

export function DuplicateCheck( {duplicateList, onGoto, onSelectDuplicates } ){

    return(

        <div className={`${style.menuItems}`} > 

        <div style={{display:"flex", alignItems:"center", marginBottom:"5px"}}>
            <label style={{marginRight:"5px"}} className='dialogTitle'>Duplicate Students</label>
            <Num2 num={duplicateList.length} tooltipText="Number of duplicates" />
        </div>
        

        <HLine/>
                
        <div className={`d-flex flex-column ${style.tabBody} ${style.scrollX}`} >

            {
                duplicateList.length>0?
                <table className={`${style.table}`}>
                    <thead><tr><th>Count</th><th>Serial (Tracking) Number</th><th>Duplicate Student&apos;s IDs</th></tr></thead>
                    <tbody>
                        {
                            duplicateList.map(
                                (object, index)=> <tr key={index} className={style.row} onClick={()=>{ onGoto( object.index ) }} ><td>{index+1}</td><td>{object.index}</td><td>{object.reg}</td></tr>
                            )
                        }
                    </tbody>
                </table>
                :
                <NoData icon={<FaClone size={60}/>} body='Your result is devoid of duplicates.' />
                
            }


        </div>



        {
            duplicateList.length>0?
            <div style={{display:"flex", justifyContent:"center", marginTop:"15px"}}>
                <GButton title='Select all duplicates' tooltip='Select to delete, clear or export' onClick={()=>onSelectDuplicates() } />
            </div>
            :
            <></>
        }
        
        
        </div>
    )
}