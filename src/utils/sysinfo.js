import {
    memoryInfo,
    cpuInfo,
    batteries,
  } from "tauri-plugin-system-info-api";


  export async function getBattery() {
    try{
        var m = await batteries()
        var b = Math.round( (m[0]['state_of_charge']) * 100 );
        return b
    }catch(e){ return -1 }
  }

  export async function getRAM() {
    try{
        var m = await memoryInfo()
        var per = Math.round((m['used_memory'] / m['total_memory']) * 100);
        return per
    }catch(e){ return -1 }
  }

  export async function getProcessor() {
    try{
        var m = (await cpuInfo())
        return JSON.stringify(m)
    }catch(e){ return -1 }
  }