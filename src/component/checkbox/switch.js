import { useState } from "react";
import { FaToggleOff, FaToggleOn }  from 'react-icons/fa6'
import React from 'react';

function Switch({ state, onCheck }){

    // const [state, setState] = useState( false );


    return(
         <div onClick={ 
            ()=>{ 
                    var newState = !state;
                    // setState( newState ); 
                    onCheck( newState );
                } 
            } 
            >
                

            {(state==true)?
                <FaToggleOn size={30} color="var(--brand-color-dark)"/>
                  :
                <FaToggleOff size={30} color="var(--black-text)"/>
            }
            
        </div>
    )
};

export default Switch;