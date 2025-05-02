import { useState } from 'react';
import Button from '../button/button';
import style from './grading-system.module.css';

import HLine from '../num/line';
import { Space } from '../space/space';
import constants from '../../constants';



export function GradingSystem( {resultName} ){

    return(

        <div className={`${style.menuItems}`} > 
        
        <label className='dialogTitle'>Grading System in use</label>    

        <HLine/>
        
        <div className={`d-flex flex-column ${style.tabBody} ${style.scrollX}`} >

            <table className={`${style.table} `}>

                <thead><tr className={style.head}>
                    <th>S/N</th><th>Min Score</th><th>Max Score</th><th>Grade</th>
                    </tr></thead>

                <tbody>

                    {
                        constants.gradingSystem.gradingSystem.map(
                            (item, index)=> <tr key={index}><td>{index+1}</td><td>{item.min}</td><td>{item.max}</td><td>{item.grade}</td></tr>
                        )
                    }
                </tbody>
            </table>
        </div>


        <div className={style.passmark}>
            <label style={{marginRight:"5px"}}> Pass Mark: </label>
            <div> {constants.gradingSystem.passMark} </div>
        </div>

        
        </div>
    )
}