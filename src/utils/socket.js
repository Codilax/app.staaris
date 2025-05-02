
import WebSocket from '@tauri-apps/plugin-websocket';


// const ws;

export async function start(  ) {

    const ws = await WebSocket.connect('ws://127.0.0.1:8080');

    ws.addListener(
        
        (msg) => {
          console.log('Received Message:', msg);
          alert('Received Message:' + msg)
        }
      
      );

      await ws.send('Hello World!');


}

export async function listen() {

    ws.addListener(
        
      (msg) => {
        console.log('Received Message:', msg);
        alert('Received Message:' + msg)
      }
    
    );

}


export async function send( data ) {
    await ws.send('Hello World!');
}



// await ws.disconnect();