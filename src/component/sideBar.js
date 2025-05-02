import React from 'react';
import style from './sideBar.module.css'
import 'bootstrap/dist/css/bootstrap.css';


// import {FaUser, FaWindowClose, FaWindowMaximize, FaWindowMinimize, FaWindowRestore} from 'react-icons/fa'
import {FaBars, FaCircleInfo, FaCircleMinus, FaCircleStop, FaCircleXmark, FaFolderClosed, FaHouseChimney, FaTableList, FaUber} from 'react-icons/fa6'
import SideBarItem from './sideBarItem';
import ToggleMenuItem from './toggleMenuItem';
import {FaCog} from 'react-icons/fa'
import constants from '@/constants';

function SideBar( { onSelect, selectedMenu } ) {

  const [ menuState, setMenuState] = React.useState( false );


  function setSelectedMenu( index ){
    // collapse();
    //setSelectMenu(index);
    onSelect( index );
  }


  function toggleSideMenu(){
    var root = document.documentElement;
    if(menuState){
        setMenuState( false )
        root.style.setProperty( '--sidebarWidth', '55px' );
    }else{
        setMenuState( true )
        root.style.setProperty( '--sidebarWidth', '200px' );
        
    }
  }

  function expand() {
    var root = document.documentElement;
    setMenuState( true )
    root.style.setProperty( '--sidebarWidth', '200px' );
  }

  function collapse() {
    var root = document.documentElement;
    setMenuState( false )
    root.style.setProperty( '--sidebarWidth', '55px' );
  }


  return (

      <div onMouseEnter={()=>{
        if(constants.menuExpandable){
          expand();
        }
      }} 
      
      onMouseLeave={
        ()=>{if(constants.menuExpandable){
          collapse();
        }}
      } 
      
      className={`${style.sideBar}  `}>
        
        <div>

            <ToggleMenuItem collapseState={menuState} callback={
              ()=>{ toggleSideMenu() }
            } />

            <div className={`${style.header}`}> </div>

            <div className={style.sideItemsPane}>

            <SideBarItem 
            onSelect={ (index)=>{ setSelectedMenu(index); } } 
            icon={<FaHouseChimney size={20}/>} title='Home' collapseState={menuState} index={0} sIndex={selectedMenu} />
            
            <SideBarItem onSelect={ (index)=>{ setSelectedMenu(index); } } 
            icon={<FaTableList size={20}/>} title='Results'  collapseState={menuState} index={1} sIndex={selectedMenu} />
            
            <SideBarItem onSelect={ (index)=>{ setSelectedMenu(index); } } 
            icon={<FaFolderClosed size={20}/>} title='Archives' collapseState={menuState} index={2} sIndex={selectedMenu} />

            <SideBarItem onSelect={ (index)=>{ setSelectedMenu(index); } } 
            icon={<FaCircleInfo size={20}/>} title='About' collapseState={menuState} index={3} sIndex={selectedMenu} />

            <SideBarItem onSelect={ (index)=>{ setSelectedMenu(index); } } 
            icon={<FaCog size={20}/>} title='Settings' collapseState={menuState} index={4} sIndex={selectedMenu} />

        </div>
        
        </div>
      </div>

  );
};

export default SideBar;
