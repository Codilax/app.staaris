
import style from './preview-dialog-content.module.css'
import HLine from '../../num/line';
import Tippy from '@tippyjs/react';
import { useEffect, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';

export function PreviewDialog({ ptitle, pdata, onClose } ){

    const [data, setData] = useState([]);
    const [title, setTitle] = useState("");

    useEffect(
        ()=>{

            setData(pdata);
            setTitle(ptitle)

        }, [pdata]
    )


    return(

       
        <div className={`${style.menuItems}`} > 

            <div style={{padding:"0 10px"}} className=' mb-2'>
                <label className='dialogTitle'>{title}</label>
            </div>

            <HLine/>


            <div className={`${style.previewPane}`} >

                <table>

                    <thead>
                        <tr>
                        {
                            (data.length>0)?Object.keys(data[0]).map(
                                (k, index)=>{
                                    return <th key={index}> {k} </th>
                                }
                            )
                            :
                            <th></th>
                        }
                        </tr>
                    </thead>


                    <tbody>

                    {   (data.length>0)?data.map(
                        ( item, index )=>{ //rows
                            return <tr key={index}>
                                {
                                    Object.keys(item).map(
                                        (key, index)=>{
                                            return <td key={index} className={style.item}> {item[key]} </td>
                                        }
                                    )
                                }
                            </tr>
                        }
                    )
                    :
                    <></>
                }


                    </tbody>

            </table>

            </div>


        </div>
    )
}