import { useState } from 'react';
import Button from '../button/button';
import style from './sort-result.module.css'
import TextButton from '../button/text-button';
import {FaCalculator, FaCircleMinus, FaCirclePlus, FaCircleStop, FaCircleXmark, FaKey, FaLock, FaPlugCirclePlus, FaPlus, FaPlusMinus, FaTrash} from 'react-icons/fa6'
import Num from '../num/num';
import Num2 from '../num/num2';
import GButton from '../button/generic-button';
import { TextField } from '../text-boxes/text-box';
import HLine from '../num/line';
import { Chip } from '../cards/chip';
import constants from '../../constants';



export function SortResult( {columnConfig, onFireUpdate, resultName} ){

    const [ tab, setTab] = useState( 1 );

    function ascending(a,b,key){
        return (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
    }

    function descending(a,b,key){
        return (a[key] > b[key]) ? -1 : (a[key] < b[key]) ? 1 : 0;
    }


    function onSort( colKey ){
        constants.resultObject.sort(
            (a,b)=>{
                return (tab==1)? ascending(a,b,colKey) : descending(a,b,colKey)
            }
        )
        constants.isSaved = false;
        onFireUpdate("*")
        
    }


    const columnNamesUI = columnConfig.map( (item, index)=>{
        return (item.key=="serial")? <div key={index}></div> : <div key={index} onClick={()=>{ onSort(item.key) }} className={`${style.colNamesItem} col`}>{item.name}</div>
    } )
    

    return(

        <div className={`${style.menuItems}`} > 
        
        <label className='dialogTitle' >Sort Result</label>    

        <HLine />

        <div  className={style.tabPane}>
            <div onClick={()=>{ setTab(1) }} className={(tab==1)?style.active:""} >Sort Ascending</div>
            <div onClick={()=>{ setTab(2) }} className={(tab==2)?style.active:""} >Sort Descending</div>
        </div>

            {

                (tab==1)?
                <div className={`d-flex flex-column ${style.tabBody}`}>
                    <label className={`${style.label} `}>Result sheet will be sorted in an increasing order. Example: 1, 2, 3, 4, 5,... </label>
                </div>

                :

                <div className={`d-flex flex-column ${style.tabBody}`} >
                    <label className={`${style.label} `}>Result sheet will be sorted in a decreasing order. Example: 5, 4, 3, 2, 1,... </label>
                </div>
            }

        
            <div  className={style.tabPane}>
            <div className={style.active} >Sort By</div>
            </div>

            <div className={`d-flex flex-column ${style.tabBody2} ${style.scroll}`} >
                <div className='row'>
                    { columnNamesUI }
                </div>
                
            </div>


        </div>
    )
}