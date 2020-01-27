import { App } from "./app";
//import * as dotenv from "dotenv";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//dotenv.config();
const app: App = new App();
app.start();