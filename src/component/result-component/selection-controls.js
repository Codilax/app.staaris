import style from './selection-controls.module.css';


import Num2 from '../../component/num/num2';
import Tippy from '@tippyjs/react';
import { Space } from '../../component/space/space';
import constants from '../../constants';
import HBar from '../../component/bar/hbar';
import GButton from '../../component/button/generic-button';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { FaBroom, FaCircleXmark, FaFileExport, FaTrash } from 'react-icons/fa6';

const SelectionControls = forwardRef(( props , selectionControlsRef ) => {

    const [count, setCount] = useState(0);
    const [display, setDisplay] = useState(false);
    

    useImperativeHandle( selectionControlsRef, () => ({

        onDisplay(){
            setCount(constants.selectedRows.length);
            setDisplay(true);
        },

        onClose(){
            setCount(0);
            setDisplay(false);
        }

    }))



    const contextBox = useMemo(

        ()=>{

            return <div className={` ${ style.boxCover } } ${(display)?style.reveal:style.conceal} `}> 

            <div className={` ${style.boxContent } `} >

                <div className={style.controlX}><Num2 tooltipText="Number Selected" num={count} />  </div>
                <HBar />

                <GButton onClick={()=>{

                    var objectsToDelete = [];
                    constants.selectedRows.forEach((row)=>{
                        objectsToDelete.push(constants.resultObject[row])
                    })

                    setConfirmDelSelection(true);

                }}  tooltip="Delete Selection" title='Delete' icon={<FaTrash size={12} />} />
                
                <Space/>
                <GButton onClick={()=>setConfirmClearSelection(true)}  tooltip="Clear Selection" title='Clear'  icon={<FaBroom size={13} />} />
                <Space/>
                <GButton  onClick={()=>setConfirmExportSelection(true)}  tooltip="Export Selection" title='Export'  icon={<FaFileExport size={13} />} />
                
                <Tippy  theme='tomato' delay={150} content="Close" placement='bottom'>
                <div  className={style.close} onClick={()=>{

                    setCount(0);
                    setDisplay(false);
                    props.onCloseSelection();
                    
                }}> <FaCircleXmark/> </div>
                </Tippy>

            </div>

            </div>
        }, [count, display]
    )


    return(
        contextBox
    )

}
)


SelectionControls.displayName = "SelectionControls";
export default SelectionControls;
