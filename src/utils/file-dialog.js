import { appDataDir } from '@tauri-apps/api/path';

export function openDialog(){
    return "c://...desktop/file.png";
}

export async function saveDialog(){
    return await appDataDir();
}