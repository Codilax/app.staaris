
import Button from '../button/button';
import style from './clear-results.module.css'

import HLine from '../num/line';
import { Space } from '../space/space';
import constants from '../../constants';
import { TextField } from '../text-boxes/text-box';
import { useMemo, useState } from 'react';
import { FaRegSquare, FaSquareCheck } from 'react-icons/fa6';
import { InfoDialog } from '../dialog/dialog-contents/infoDialog';
import { FullDialogBase } from '../dialog/full-dialog-base';


export function MapDimension({pasteInfo, onMapRange, onClose } ){

    const [dim, setDIM] = useState("x");

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
            return <FullDialogBase isOpaque={true} isCloseButton="true" isCenter="true" isScaleAnim="true" id="MapDiminfo" items={ <InfoDialog title={title} body={body} /> } 
                onClose={ ()=>{ setInfoDialog(!infoDialog); } }
                dialogState={infoDialog}
            />
        }
    )


    return(

        <div className={`${style.menuItems}`} > 

        {infoBox}


        <label className='dialogTitle' >{constants.template[pasteInfo.col]['name']} </label> 
        <label style={{marginBottom:"5px", color:'var(--black-text)'}} > Map Column Values to a New Dimension </label> 

        <HLine />


            <div style={{marginTop:"15px"}} className={style.row}>
                <label className={style.choose}>From Dimension:</label>
                <div className={style.fromDim}>
                    {constants.template[pasteInfo.col]['max']}
                </div>
            </div>


            <div style={{marginTop:"15px"}} className={style.row}>
            <label className={style.choose}>To Dimension:</label>
            <label className={style.toDim}>(reasonable dimension values are between 0 and 100)</label>
                <TextField 
                    type="number" 
                    placehoder="Enter new dimension" 
                    onChange={(score)=>{
                        setDIM(parseFloat(score))
                    }} 
                />
            </div>


            <div className='mt-3 d-flex justify-content-end'>

                <Button title={"Map From Range " + constants.template[pasteInfo.col]['max'] + " to " + (isNaN(dim)? "x":dim) } onClick={()=>{
                    if(dim == "x" || isNaN(dim)){
                        
                        setInfo(true, "Warning", "Please enter a new dimension.");
                        }else{
                            onMapRange(pasteInfo.col, constants.template[pasteInfo.col]['max'],  dim)
                    
                    }
                }} />

                <Space />
                
                <Button title="Cancel" onClick={()=>{
                    onClose()
                }} />
            </div>

           

        </div>
    )
}