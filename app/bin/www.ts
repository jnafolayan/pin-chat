import http from 'http';
import dotenv from 'dotenv';
import app from '../app';

dotenv.config();

const PORT: string = process.env.PORT || '8080';
const server: http.Server = http.createServer(app);

server.listen(PORT, () => console.log(`artlib listening on port ${PORT}`));