import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Server } from 'socket.io'
import http from 'http'
import path from 'path';
import webChatSocket from '../sockets/webChat';
import errorMiddleware from '../middlewares/errorMiddleware';

type port = string | undefined;

class App {
  public app: express.Application;
  public port: port;
  public httpServer: http.Server;
  public io: any;
  constructor(port: port) {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.port = port;
    this.io = new Server(this.httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    this.initializeViews();
    this.initializeMiddlewares();
    this.callSockets();
    this.callRoutes();
    this.handleErrors();
  }

  private initializeViews() {
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, '../views'));
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private callSockets() {
    webChatSocket(this.io);
  }

  private callRoutes() {
    this.app.get('/', (_req: express.Request, res: express.Response) => {
      res.render('webchat');
    });
  }

  private handleErrors() {
    this.app.use(errorMiddleware);
  }

  public startServer() {
    this.app.listen(this.port, () => {
      console.log(`API online on port: ${this.port}`);
    });
  }

  public startHttpServer() {
    this.httpServer.listen(this.port, () => {
      console.log(`Http server online on port: ${this.port}`);
    });
  }

}

export default App;
