"use strict"

// Resolve dependencies required to load a web listener.
const container = require("./containerConfig");
const logger = container.get("logger");
const swaggerConfig = container.get("swaggerConfig");

// Require modules.
const swaggerTools = require("swagger-tools");
const serveStatic = require("serve-static");
const yamlParser = require("js-yaml");

const fs = require("fs");
const cors = require("cors");
const http = require("http");

// Create a web service reference.
const connect = require("connect");
const service = connect();


// Define middlewares - each request to the server will be passed through the configured middlewares.
// Please see 'use' documentation for more information.
// You can also use F12 keyboard shortcut to navigate to the function's public api comments.

// Serve static files - readme.
service.use(serveStatic("./docs/"));

// Read swagger doc and load it to a js object.
let spec = fs.readFileSync("./api/swagger.yaml", "utf8");
let swaggerDoc = yamlParser.safeLoad(spec);

// Initialize swagger middlewares.
swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
    service.use(cors({
        origin: '*',
        allowMethods: ['GET'],
        exposeHeaders: ['X-Request-Id']
    }));

    // Configure swagger middlewares for exposing metadata and validations.
    service.use(middleware.swaggerMetadata());
    service.use(middleware.swaggerValidator());

    // Configure swagger router - this handles the routings specified in the swagger.yaml.
    let options = {
        swaggerUi: "/swagger.json",
        controllers: "./controllers"
    };
    service.use(middleware.swaggerRouter(options));

    // Configure swagger UI.
    service.use(middleware.swaggerUi({
        apiDocs: "/service-tutorial-internal/api-docs",
        swaggerUi: `/service-tutorial/docs`
    }));

    // Create http listener and run it on port.
    http.createServer(service).listen(swaggerConfig.port, () => {
        logger.info(`service is up. listening on port: ${swaggerConfig.port}`);
    });
});
