
import Button from '../button/button';
import style from './clear-results.module.css'

import HLine from '../num/line';
import { Space } from '../space/space';
import constants from '../../constants';
import { TextField } from '../text-boxes/text-box';
import { useMemo, useState } from 'react';
import { FaCircle, FaCircleCheck, FaCircleDot, FaRadio, FaRegCircleDot, FaRegSquare, FaSquareCheck } from 'react-icons/fa6';
import { FullDialogBase } from '../dialog/full-dialog-base';
import { InfoDialog } from '../dialog/dialog-contents/infoDialog';


export function AddToColumn({pasteInfo, onAddSubtract, onClose } ){

    const [op, setOp] = useState("Add");
    const [preventOverflow, setPreventOverflow] = useState(true);
    const [marks, setMarks] = useState("");

    const [infoDialog, setInfoDialog] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");



    function setInfo(state, title, body){
        setInfoDialog(state);
        setTitle(title);
        setBody(body);
    }


    const infoBox = useMemo(
        ()=>{
            return <FullDialogBase isOpaque={true} isCloseButton="true" isCenter="true" isScaleAnim="true" id="AddClinfo" items={ <InfoDialog title={title} body={body} /> } 
                onClose={ ()=>{ setInfoDialog(!infoDialog); } }
                dialogState={infoDialog}
            />
        }
    )


    return(

        <div className={`${style.menuItems}`} > 

        <label className='dialogTitle' >Add, Subtract or Multiply - {constants.template[pasteInfo.col]['name']}</label> 

        <HLine />


            <div style={{marginTop:"15px"}} className={style.row}>
                <label className={style.choose}>Choose an Operation:</label>
                
                <div style={{display:"flex", marginTop:"10px"}}>

                <div onClick={()=>setOp("Add")} className={`${style.radio} ${(op=="Add")?style.nofade:style.fade} `}>
                    {(op=="Add")? <FaCircleCheck color='var(--brand-color)' size='16' /> : <FaRegCircleDot size='16' />}
                    <label>Add Marks Across</label>
                </div>


                <div onClick={()=>setOp("Subtract")} className={`${style.radio} ${(op=="Subtract")?style.nofade:style.fade} `}>
                {(op=="Subtract")? <FaCircleCheck color='var(--brand-color)' size='16' /> : <FaRegCircleDot size='16' />}
                <label>Subtract Marks Across</label>
                </div>


                
                
                </div>


                <div  onClick={()=>setOp("Multiply")} className={`mt-2 ${style.radio} ${(op=="Multiply")?style.nofade:style.fade} `}>
                    {(op=="Multiply")? <FaCircleCheck color='var(--brand-color)' size='16' /> : <FaRegCircleDot size='16' />}
                    <label>Multiply Colum  By</label>
                </div>


            </div>



            <div style={{marginTop:"15px"}} className={style.row}>
                <label className={style.choose}>{(op=="Multiply"? "Enter a Multiplier":"Enter a Score:")}</label>
                <TextField 
                    type="number" 
                    placehoder={ (op=="Multiply"? "Multiplier": "Score to " + op )  } 
                    onChange={(score)=>{
                        setMarks(parseFloat(score))
                    }} 
                />
            </div>


            <div style={{marginTop:"10px"}} className={style.check} onClick={()=>setPreventOverflow(!preventOverflow)}>
                {(preventOverflow)? <FaSquareCheck size={16}/> : <FaRegSquare size={16}/>}
                <label>{ (op=="Multiply")? "Prevent Overflow or Underflow": (op=="Add")? "Prevent Overflow": "Prevent Underflow"}</label>
            </div>

            <div className='mt-3 d-flex justify-content-end'>
                <Button title={ (op=="Multiply")? op+" Column By": op + " Marks Across" } onClick={()=>{
                    if( marks === "" || isNaN(marks) ){
                        setInfo(true, "Warning", (op=="Multiply")?"Please enter a multiplier":"Please enter a score.");
                    }else{
                        onAddSubtract(pasteInfo.col, op, preventOverflow, marks)
                    }

                }} />

                <Space />
                
                <Button title="Cancel" onClick={()=>{
                    onClose()
                }} />
            </div>



            {infoBox}


        </div>
    )
}