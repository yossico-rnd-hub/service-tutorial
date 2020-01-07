"use strict"

// Register services.
const container = require("./containerConfig");
const logger = container.get("logger");

const swaggerTools = require("swagger-tools");
const serveStatic = require("serve-static");
const yamlParser = require("js-yaml");
const fs = require("fs");
const cors = require("cors");
const http = require("http");
const swaggerConfig = require("config").swagger;

// Create a web service reference.
const connect = require("connect");
const service = connect();


// Define middlewares.

// Serve static files - readme.
service.use(serveStatic("."));

let options = {
    swaggerUi: "/swagger.json",
    controllers: "./controllers"
};

let spec = fs.readFileSync("./api/swagger.yaml", "utf8");
let swaggerDoc = yamlParser.safeLoad(spec);

swaggerTools.initializeMiddleware(swaggerDoc, (middleware)=>{
    service.use(cors({
        origin: '*',
        allowMethods: ['GET'],
        exposeHeaders: ['X-Request-Id']
    }));

    service.use(middleware.swaggerMetadata());
    service.use(middleware.swaggerRouter(options));

    service.use(middleware.swaggerUi({
        apiDocs: "/service-tutorial-internal/api-docs",
        swaggerUi: `/service-tutorial/docs`
    }));

    http.createServer(service).listen(swaggerConfig.port, ()=>{
        logger.log("info", "server is up");
    });

});