import { Server } from 'http';
import express from 'express';
import * as bodyParser from "body-parser";
import { NoPublicIpController } from './controllers/nopublicipController';
//import { OnBoardController } from './controllers/onboardController';

export class App {
    start(): Server {
        const app: express.Express = express();
        app.use(bodyParser.json());
        app.use(this.getOnBoardRouter());

        app.get("/", (req, res, next) => {
            res.send("I am ready and healthy");
        });

        return app.listen(3200, () => {
            console.log(`listening on port: ${process.env.PORT}`);
        });
    }

    private getOnBoardRouter(): express.Router {
        const router = express.Router();
        const controller: NoPublicIpController = new NoPublicIpController();
        router.post('/nopublicip', controller.validate);
        return router;
    }
};