import { WebSocketServer } from 'ws';

let wss;

export const initWebSocket = (server)=>{
  
  wss = new WebSocketServer({ server });
  
  wss.on('connection', (ws)=>{
    console.log('Dashboard connected via WebSocket');
    
    ws.on('close', ()=>{
      console.log('Dashboard disconnected');
    });

  });
};

export const broadcast = (data)=>{
  if(!wss) return;
  
  const message = JSON.stringify(data);
  
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
};