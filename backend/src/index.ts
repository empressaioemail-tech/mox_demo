import { loadConfig } from "./config.js";
import { buildApp, startServer } from "./server.js";

const config = loadConfig();
const app = buildApp(config);
startServer(app, config.port);
