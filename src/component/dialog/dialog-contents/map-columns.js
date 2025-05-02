
import style from './map-columns.module.css';
import Button from '../../button/button';
import { Space } from '../../space/space';
import HLine from '../../num/line';
import { NoData } from '../../no-data';
import { FaColumns } from 'react-icons/fa';


export function MapColDialog({ loadedColumns, currentColumns, onChanged,  onAccept, onClose } ){


    var exceptions = ['serial', 'reg', 'name', 'ca', 'exam', 'total', 'grade', 'remark' ];


    return(

        <div className={`${style.menuItems}`} > 


        <div style={{padding:"0 10px"}} className='d-flex align-items-center mb-2'>
            <label className='dialogTitle'>Associate Columns</label>
        </div>

        <div style={{padding:"0 10px"}}>
            <HLine />
        </div>



        <div className={`${style.previewPane} `} >

            <div  className={style.head}>
                <label className={style.welcome}>Welcome to Smart Mapping</label>
                <label>Please manually associate columns from the selected result to that of the opened result for a seamless merging. </label>
            </div>

            {

             ( Object.keys(loadedColumns).length>exceptions.length && Object.keys(currentColumns).length>exceptions.length )?
              
             Object.keys(currentColumns).map(
                (colKey, index)=> (!exceptions.includes(colKey))?
                    <div key={index} className={style.row}>
                    <label className={style.choose}>Choose Column Name For:</label>
                    <label>{currentColumns[colKey]}</label>
                    <select onChange={(event)=>{ onChanged( colKey , event.currentTarget.value ) }}>
                        <option>Not applicable</option>
                        {  Object.keys(loadedColumns).map(
                                (item, index)=>{ 
                                    
                                    if(!exceptions.includes(item)){
                                        return <option key={index} value={item}>{loadedColumns[item]}</option>  
                                    }
                                }
                            )
                        }
                    </select>
                    </div>:<></>
              )


              :

              <NoData icon={<FaColumns size={35}/>} body='You do not have any custom column to map. Please proceed to merge the result or cancel.' />

            }



        </div>

        <div className={style.footer}>

            <Button title="Merge Result" onClick={()=>{
                onAccept();
            }} />

            <Space/><Space/>

            <Button title="Cancel" onClick={()=>{
                onClose();
            }} />

        </div>


        </div>
    )
}