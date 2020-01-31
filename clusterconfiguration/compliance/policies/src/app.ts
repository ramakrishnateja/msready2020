import { Server } from 'http';
import express from 'express';
import * as bodyParser from "body-parser";
import { NoPublicIpController } from './controllers/nopublicipController';

export class App {
    start(): Server {
        console.log('called start');
        const app: express.Express = express();
        app.use(bodyParser.json());
        app.use(this.getNoPublicIpRouter());

        const port = process.env.PORT || '8000';

        app.get("/", (req, res, next) => {
            res.send("I am ready and healthy");
        });

        var server = app.listen(port, () => {
            console.log(`listening on port ${port}`);
        });

        return server;
    }

    private getNoPublicIpRouter(): express.Router {
        const router = express.Router();
        const controller: NoPublicIpController = new NoPublicIpController();
        router.post('/nopublicip', controller.validate);
        return router;
    }
};