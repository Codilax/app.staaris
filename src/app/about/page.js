'use client'

import style from './page.module.css';
import constants from '../../constants';
import { FaEnvelope, FaGlobe } from 'react-icons/fa6';
import { Space } from '../../component/space/space';
import { open } from '@tauri-apps/plugin-shell';


function About({  }) {


    return(

        <div className={` ${style.aboutPane}`}>

            <div className={style.logoArea}>
                <div className={style.appLogo}></div>
                <label className={style.deap} > {constants.appName} </label>
            </div>

            
            <label className={style.meaning} > {constants.appDescription } </label>
            <label className={style.version} > Version {constants.appVersion} </label>
            
            <div className={style.email}>
            <label onClick={
                async ()=>{
                    await open(constants.website );
                }
                } className={style.pointer} > <FaGlobe color='var(--brand-color)' /> {constants.website}</label>

            <Space/> <Space/>

            <a className={style.a} href={`mailto:${constants.email}`} > <FaEnvelope color='var(--brand-color)' /> {constants.email}</a>
                
            </div>
            

            <div className={style.definition} > 

            <p className={style.p}>
            Staaris is a <span>Template-Based</span> automated digital solution for planning, preparing, and evaluating students&apos; results.
            </p>

            <p className={style.p}>
            Staaris features faster and accurate result processing, increased efficiency, easy error detection, and reduced workload. Thanks to Staaris&apos;  SMART-Search, <span>SMART-Entry</span>, SMART-Feedback, SMART-Detect, SMART-Backup, and an <span>AI-Assisted</span> result computation engine.
            </p>

            <p className={style.p}>
            Staaris helps Lecturers automate their result processes. Staaris handles the entry, computation, storage, report generation, and security of students&apos; results.
            </p>

            <p className={style.p}>
            As a dynamic system, Staaris fits to your specification and requirements.
            </p>


            </div>

        
    </div>

)
};

export default About;
