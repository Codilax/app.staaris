
import style from './choose-columns.module.css';
import { useEffect, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import Button from '../../button/button';
import HLine from '../../num/line';


export function ChooseInsertColDialog({ isSNumber, isSName, isAtt, columns, onAccept, onClose } ){

    const [cols, setCols] = useState([]);


    useEffect(
        ()=>{
            if(columns.length>0){ setCols(columns);  }
        }, [columns]
    )


    function doAcceptColumns(){

        var chsNum =  (document.getElementById("chsnumIns")!=null)? document.getElementById("chsnumIns").value : "";
        var chsName =  (document.getElementById("chsnameIns")!=null)? document.getElementById("chsnameIns").value : "";
        var chsAtt =  (document.getElementById("chsattendanceIns")!=null)? document.getElementById("chsattendanceIns").value : "";

        onAccept(chsNum, chsName, chsAtt);
    }



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
                <label>Some columns in the student&apos;s list does not match the supported columns. We are giving you an opportunity to manually associate the column names from your student&apos;s list to the supported student&apos;s deatails below. </label>
            </div>
            

            {(isSNumber)?<div style={{marginTop:"10px"}} className={style.row}>
                <label className={style.choose}>Choose Column Name For:</label>
                <label>Student Number*</label>
                <select id='chsnumIns'>
                    {  cols.map(
                            (item, index)=>{
                                return <option key={index}>{item}</option>
                            }
                        )
                    }
                </select>
            </div>:<></>}


            {(isSName)?<div className={style.row}>
                <label className={style.choose}>Choose Column Name For:</label>
                <label>Student Name (Optional)</label>
                <select id='chsnameIns'>
                    {
                        cols.map(
                            (item, index)=>{
                                return <option key={index}>{item}</option>
                            }
                        )
                    }
                </select>
            </div>:<></>}


            {(isAtt)?<div style={{ padding:"10px 20px 4px 20px"}} className={style.row}>
                <label className={style.choose}>Choose Column Name For:</label>
                <label>Attendance (Optional)</label>
                <select id='chsattendanceIns'>
                    {   cols.map(
                            (item, index)=>{
                                return <option key={index}>{item}</option>
                            }
                        )
                    }
                </select>
            </div>:<></>}


            {(isAtt)?<div className={`${style.italic} `}>
                    Note: Attendance is only applicable if a column called &apos;attendance&apos; is specified by the result&apos;s template.
            </div>:<></>}


        </div>


        <div className={style.footer}>
            <Button title="Accept" onClick={()=>{
                doAcceptColumns();
            }} />
        </div>


        </div>
    )
}