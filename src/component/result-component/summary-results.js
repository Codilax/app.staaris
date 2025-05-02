import { useState } from 'react';
import Button from '../button/button';
import style from './summary-results.module.css';

import HLine from '../num/line';
import { Space } from '../space/space';
import { FaSync } from 'react-icons/fa';
import constants from '../../constants';

export function SummaryResults( {gstat, sstat} ){

    return(

        <div className={`${style.menuItems}`} > 

        
        <label  className='dialogTitle'>Result Summary</label>

        <HLine/>
                
        <div className={`d-flex flex-column ${style.tabBody} ${style.scrollX}`} >

            <div>

                <div className={style.head} >Analysis Report</div>

                {
                Object.entries(sstat).length>0?
                <table className={`${style.table}`}>
                    <thead><tr><th>Field</th><th>Value</th></tr></thead>
                    <tbody>
                        {
                            Object.keys(sstat).map(
                                (key, index)=> <tr key={index}><td>{key}</td><td>{sstat[key]}</td></tr>
                            )
                        }
                    </tbody>
                </table>
                :
                <div className={style.noReport}>No Analysis Report</div>
            }


            </div>


            <div style={{marginTop:"15px"}}> 
            <div className={style.head} >Summary of Grades</div>


            {
                Object.entries(gstat).length>0?
                <table className={`${style.table}`}>
                    <thead><tr><th>Grade</th><th>Frequency</th></tr></thead>
                    <tbody>
                        {
                            Object.keys(gstat).map(
                                (key, index)=> <tr key={index}><td>{key}</td><td>{gstat[key]}</td></tr>
                            )
                        }
                    </tbody>
                </table>
                :
                <div className={style.noReport}>No Summary of Grades</div>
            }



            </div>

            


        </div>


        
        </div>
    )
}