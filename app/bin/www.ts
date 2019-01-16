import http from 'http';
import * as WebSocket from 'ws';

import dotenv from 'dotenv';
import app from '../app';
import * as chat from '../chat';

dotenv.config();

const PORT: string = process.env.PORT || '8080';
const server: http.Server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
	chat.setupClient(wss, ws);
});

chat.startWatcher(wss);

server.listen(PORT, () => console.log(`artlib listening on port ${PORT}`));