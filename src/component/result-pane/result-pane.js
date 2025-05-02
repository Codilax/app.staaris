
import style from './result-pane.module.css'
import constants from '../../constants';
import { Virtuoso } from 'react-virtuoso'
import RowItem from '../result-rows/row-item';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';


// let refs = React.useRef([])
// array.map((object, index) => (
//   <Component
//     ref={ref => refs.current[index] = ref}
// ))


const ResultPane = forwardRef(( props , resultPaneRef ) => {

    let rowRefs = useRef([]);
    let sidRef = useRef([]);

    const [refresh, setRefresh] = useState("");

     useImperativeHandle( resultPaneRef, () => ({

        setPresentation( value ){
          try{
            setPMode(value)
          }catch(e){}

        },

        refreshSheet(){
            try{
              refreshAll();
            }catch(e){}
        },


        refreshRows(){
          try{
            refreshAll();
          }catch(e){}
        },


        //send message to parent
        sendMessage( action ){
          try{
            props.sendMessage(action)
          }catch(e){}
        },

        toggleName(){
          try{
            sidRef.current.forEach(
              (e)=> e.refresh()
            )
          }catch(e){}
        },


        refreshGivenRows(rows){
          try{
            rows.forEach(
              (e)=>rowRefs.current[e].refresh()
            )
          }catch(e){}
        },


        clearSelection(){
            var rows = Array.from( constants.selectedRows );
            constants.selectedRows = [];
            try{
              rows.forEach(
                (e)=>rowRefs.current[e].refresh()
              )
            }catch(e){}
        },

        clearDuplicate(){
          var rows = Array.from( constants.duplicateStudents )
          constants.duplicateStudents = [];
          try{
            rows.forEach(
              (e)=>rowRefs.current[e].refresh()
            )
          }catch(e){}
        }



       }));


       function clearRows(){

        var rows = Array.from( constants.selectedRows )
        constants.selectedRows = [];

        try{
          
          rows.forEach(
            (e)=>rowRefs.current[e].refresh()
          )
        }catch(e){}


        // sidRef.current.forEach(
        //   (e)=> e.refresh()
        // )

        // rowRefs.current[0].refresh()

       }


       const InnerRowItem = useMemo(() => {

        return ({index}) => {

          return (

            <RowItem 

                sidRef={ref => sidRef.current[index] = ref}
                ref={ rowRef => rowRefs.current[index] = rowRef }

                rowIndex={index}  
                onAddRow={(x)=>{
                    props.onAddRow(x, index);
                }}

                onDeleteRow={()=>{
                    props.onDeleteRow(index)
                }}

                onPaste={(event, rowIndex, colIndex, dataType)=>{
                    props.onPaste( event, rowIndex, colIndex, dataType );
                }}

                columnConfig={constants.template} 

                onRowsSelected = {()=>props.onRowsSelected()}

                clearSelection = { ()=>{ clearRows() } }

                onForceUpdate={(param)=>{ 
                  // refreshAll();
                    // props.onForceUpdate(param); //manage update of ui from within
                }}
            />
          );

        };

      }, [refresh] );


    const itemContent = useCallback(
        (index)=>{
            return <InnerRowItem index={index} />;
        }, [refresh]
    )



    const [pMode, setPMode] = useState(false);

    function refreshAll(){setRefresh(Math.random())}



    return(
        <div ref={resultPaneRef}  className={` ${style.resultPane} ${(pMode)? style.pMode:  style.offPMode } `}> 

            <Virtuoso 
               
                defaultItemHeight={constants.rowHeight}
                skipAnimationFrameInResizeObserver={true}
                ref={props.virtuosoRef}
                overscan={6000} //25*200 items
                fixedItemHeight={constants.rowHeight}

                style={{ height: '100%' }} 
                totalCount={constants.resultObject.length} 
                className={style.resultRowSection}
                itemContent={ itemContent }
                
            />
        </div>
    )

})

ResultPane.displayName = "resultpane";
export default ResultPane;


// export function ResultPane({ resultPaneRef, presentationMode, onAddRow, onDeleteRow, onForceUpdate, onPaste }){

   
//     // const InnerRowItem = useMemo(() => {
//     //     return ({index}) => {

//     //       return (

//     //         <RowItem 
//     //             rowIndex={index}  
//     //             onAddRow={(x)=>{
//     //                 onAddRow(x, index);
//     //             }}

//     //             onDeleteRow={()=>{
//     //                 onDeleteRow(index)
//     //             }}

//     //             onPaste={(event, rowIndex, colIndex, dataType)=>{
//     //                 onPaste( event, rowIndex, colIndex, dataType );
//     //             }}

//     //             columnConfig={constants.template} 

//     //             onForceUpdate={(param)=>{ 
//     //                 onForceUpdate(param);
//     //             }}
//     //         />
//     //       );

//     //     };

//     //   }, );



//     // const itemContent = (index) => {
//     //     return <InnerRowItem index={index} />;
//     // }


//     // return(
//     //     <div  className={` ${style.resultPane} ${(presentationMode)?style.pMode:""} `}> 

//     //         <Virtuoso 
               
//     //             defaultItemHeight={constants.rowHeight}
//     //             skipAnimationFrameInResizeObserver={true}
//     //             ref={resultPaneRef}
//     //             overscan={6000} //25*200 items
//     //             fixedItemHeight={constants.rowHeight}

//     //             style={{ height: '100%' }} 
//     //             totalCount={constants.resultObject.length} 
//     //             className={style.resultRowSection}
//     //             itemContent={ itemContent }
                
//     //         />
//     //     </div>
//     // )




//     //OLD
//     // return(
//     //     <div  className={` ${style.resultPane} ${(presentationMode)?style.pMode:style.offPMode} `}> 
//     //         <ReactVirtualizedAutoSizer disableWidth >
//     //         {({ height, }) => (
//     //         <VariableSizeList
//     //             ref={resultPaneRef}
//     //             useIsScrolling={true}
//     //             height={height}
//     //             width="100%"
//     //             overscanCount={50} //previously 20
//     //             itemSize={getSize}
//     //             itemCount={constants.resultObject.length}
//     //             className={style.resultRowSection}
//     //             >
//     //             { getRowItem }
//     //         </VariableSizeList>

//     //          )}

//     //          </ReactVirtualizedAutoSizer>

//     //     </div>

//     // )
// }