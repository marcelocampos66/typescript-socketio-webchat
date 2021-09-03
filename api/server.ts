import 'dotenv/config';
import App from './App';

const { PORT } = process.env;

const server = new App(PORT);

server.startHttpServer();
