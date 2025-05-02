
import style from './choose-columns.module.css';
import { useEffect, useState } from 'react';
import Button from '../../button/button';
import HLine from '../../num/line';


export function ChooseAddColDialog({ isSNumber, isSName, isAtt, columns, onAccept, onClose } ){

    const [cols, setCols] = useState([]);

    const [num, setNum] = useState("Not applicable");
    const [name, setName] = useState("Not applicable");
    const [att, setAtt] = useState("Not applicable");

    var chsNum = "Not applicable";
    var chsName = "Not applicable";
    var chsAtt = "Not applicable";


    useEffect(
        ()=>{
            if(columns.length>0){ setCols(columns);  }
        }, [columns]
    )


    function doAcceptColumns(){
        onAccept(num, name, att);
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
                <label>Please manually associate the column names from your student&apos;s list to the supported student&apos;s deatails below. </label>
            </div>
            

            {(isSNumber)?<div style={{marginTop:"10px"}} className={style.row}>
                <label className={style.choose}>Choose Column Name For:</label>
                <label>Student Number*</label>
                <select onChange={(e)=>setNum(e.currentTarget.value)}>
                    <option>Not applicable</option>
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
                <select onChange={(e)=>setName(e.currentTarget.value)} >
                    <option>Not applicable</option>
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
                <select onChange={(e)=>setAtt(e.currentTarget.value)}>
                    <option>Not applicable</option>
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