import dotenv from 'dotenv';
dotenv.config();
import express, { Application, Request, Response } from 'express';
import socketIo ,{ Server as SocketIOServer } from 'socket.io';
import mongoose, { Mongoose } from 'mongoose';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import { createServer, Server as HttpServer } from 'http';
import cookieParser from 'cookie-parser';

import { IndexRoute } from './../routes/IndexRoute';

import Admin from './../config/adminCreate'
import dbConfig from './../config/database';
import passportConfig from './../config/passport';

export class StartServer {
  private app: Application;
  private server: HttpServer;
  private io: SocketIOServer;
  private db: Mongoose;

  constructor () {
    this.app = express();
    this.server = createServer(this.app);
    this.io = socketIo(this.server);
    this.db = mongoose;

    passportConfig();
    this.setStaticConfig();
    this.startServer();
    this.setRouter();
    this.setDatabaseConnect();
    Admin.adminCreate();
  }
  private async setRouter () {
    this.app.use('/api', await new IndexRoute().getRoutes());
  }
  private setDatabaseConnect() {
    const mongo = `${dbConfig.mongoUrl}${process.env.MONGO_DATABASE_NAME}`;
    const { settings, databaseActions } = dbConfig;
    this.db.connect(mongo, settings);
    this.db.Promise = global.Promise;
    for(const { type, callback } of databaseActions) {
      if (type === 'error') this.db.connection.on(type, () => {
        console.log(callback);
        this.db.connect(mongo, settings);
      });
      else this.db.connection.on(type, () => console.log(callback));
    }
  }
  private setStaticConfig () {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(bodyParser.urlencoded({
      extended: true,
    }));
    this.app.use((req: Request, res: Response, next: any) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
    this.app.use(express.static(path.join(__dirname, '../../../dist/')));
    // this.hooks.set('io', this.io);
  }
  private startServer () {
    this.server.listen(process.env.PORT, () => console.log('\x1b[36m', 'Serwer uruchomiony'));
  }
  public static bootstrap (): StartServer {
    return new StartServer();
  }
}
