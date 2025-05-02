'use client'

import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { LoginDialogBase } from "@/component/dialog/login-dialog-base";
import Login from "@/component/login/login";
import { Loading } from "@/component/loading/loading";
import { useEffect, useState } from "react";
import { createAppDirectories, listFiles, read } from "@/utils/files";
import constants from "../constants";
import {StaarisStructure} from '../component/staaris-struct/staaris-structure';
import {usePathname, useRouter} from 'next/navigation'


export default function RootLayout({ children }) {

  const [loginDialog, setLoginDialog] = useState(false);


  useEffect(
    ()=>{

      async function fetchData() {

        await createAppDirectories();

        var data = await listFiles( constants.dir_results, false );
        data.sort(  (a , b)=> (b.ctimeMS - a.ctimeMS)  );
        constants.existingResultList = data;


        var t = await listFiles( constants.dir_templates, true );
        t.sort(  ( a, b )=> (a.ctimeMS - b.ctimeMS)  );
        constants.templates = [ constants.nucTemplate, constants.topfaithTemplate ];
        constants.templates = [ constants.nucTemplate, constants.topfaithTemplate, ... t];
  
    
        var gr = await listFiles( constants.dir_gradingSystems, true );
        gr.sort(  ( a, b )=> (a.ctimeMS - b.ctimeMS)  );
        constants.gradingSystems = [ constants.nucGrading, constants.nbteGrading, constants.topfaithGrading ];
        constants.gradingSystems = [constants.nucGrading, constants.nbteGrading, constants.topfaithGrading, ...gr];


        var s = await read(constants.dir_settings, "settings" );
        onSettingsReceived(s);

        setRefresh(Math.random());

      }

      fetchData();

    }, []

  )


  function onSettingsReceived(data){

    if( data ){

      constants.darkMode = data.darkMode;
      constants.menuExpandable = data.menuExpandable;
      constants.menuState = data.menuState;

      constants.secure  = data.secure;
      constants.secureQuestion = data.secureQuestion;
      constants.secureAnswer = data.secureAnswer;

      constants.selectedGradingSystem = data.selectedGradingSystem;
      constants.selectedTemplate = data.selectedTemplate;
      constants.warningDialog = data.warningDialog;
      constants.haptic = data.haptic;
      constants.talkback = data.talkback;
      constants.talkbackvoiceindex = data.talkbackvoiceindex;

      applyTheme( constants.darkMode );

      if( constants.secure != ""){
        setLoginDialog(true);
      }

    }

  }
  

  function applyTheme( state ){

    var root = document.documentElement;

    if( state ){        //DARK MODE

      root.style.setProperty( '--barImg', "url('/images/sideBarBgDark.png')" );
      root.style.setProperty( '--loginImg', "url('/images/loginDark.png')" );
      
      root.style.setProperty( '--bar-head-color', 'rgb(4, 157, 131)' );

      root.style.setProperty( '--base-color', 'rgb(18,30,46)' );
      root.style.setProperty( '--base-color-light', 'rgb(20, 34, 53)' );

      root.style.setProperty( '--brand-color', 'rgb(4, 157, 131)' );
      root.style.setProperty( '--brand-color-light', 'rgba(4, 157, 131, 0.8 )' );

  
      root.style.setProperty( '--brand-color-dark', 'rgb(4, 157, 131)' );

      root.style.setProperty( '--white-text', 'rgb( 255,255,255 )' );
      root.style.setProperty( '--black-text', 'rgba( 255,255,255, 0.8 )' );
      root.style.setProperty( '--shadow-color', 'rgba( 0,0,0, 0.1 )' );
      root.style.setProperty( '--hover-color', 'rgba( 0,202,170, 0.1 )' );
      root.style.setProperty( '--hover-color-dark', 'rgba( 0,202,170, 0.2 )' );

      root.style.setProperty( '--scroll-color', 'rgba( 0,202,170, 0.1 )' );

      root.style.setProperty( '--resultBorderColor', 'rgb(5,10,15)' );

      root.style.setProperty( '--pass-color', 'rgb(4, 157, 131)' );
      root.style.setProperty( '--fail-color', 'rgb(255, 125, 194)' );
      root.style.setProperty( '--dialog-color', 'rgba(255,255,255,0.1)' );

      }else{          //LIGHT MODE ACTIVATED
          
          root.style.setProperty( '--dialog-color', 'rgba(255,255,255,0.6)' );
          root.style.setProperty( '--barImg', "url('/images/sideBarBgLight.png')" );
          root.style.setProperty( '--loginImg', "url('/images/loginLight.png')" );
              
          root.style.setProperty( '--bar-head-color', 'rgb(77, 8, 107)' );
          root.style.setProperty( '--base-color', 'rgb(255,255,255)' );
          root.style.setProperty( '--base-color-light', 'rgb(255,255,255)' );
      
          root.style.setProperty( '--brand-color', 'rgb(77, 8, 107)' );
          root.style.setProperty( '--brand-color-light', 'rgba( 77, 8, 107, 0.8 )' );
          root.style.setProperty( '--brand-color-dark', 'rgb(77, 8, 107)' );

          root.style.setProperty( '--white-text', 'rgb( 255,255,255 )' );
          root.style.setProperty( '--black-text', 'rgba( 0,0,0,0.8 )' );
          root.style.setProperty( '--shadow-color', 'rgba( 100,100,100, 0.3 )' );
          root.style.setProperty( '--hover-color', 'rgba( 123,31,162, 0.1 )' );
          root.style.setProperty( '--hover-color-dark', 'rgba( 123,31,162, 0.2 )' );
          
          root.style.setProperty( '--scroll-color', 'rgba( 100,100,100, 0.2 )' );

          root.style.setProperty( '--resultBorderColor', 'rgb(200,200,200)' );

          root.style.setProperty( '--pass-color', 'rgb(77, 8, 107)' );
          root.style.setProperty( '--fail-color', 'rgb(227, 18, 129)' );

      }

}

return (

    <html lang="en">
      <body >

      <StaarisStructure onLockCalled={()=>{ setLoginDialog(true);  }}>

        <LoginDialogBase
          dialogState={loginDialog}
          items={<Login dialogState={loginDialog} onLoggedIn={ ()=>{ setLoginDialog(false); } } />}
        />

        {/* <Loading state={loadingState} /> */}

        {children}

      </StaarisStructure>


      </body>
    </html>

  );
}
