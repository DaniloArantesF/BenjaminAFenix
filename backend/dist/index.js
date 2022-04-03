"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bot_1 = __importDefault(require("./bot"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const Auth_1 = __importDefault(require("./apis/Auth"));
const Discord_1 = __importDefault(require("./apis/Discord"));
const Youtube_1 = __importDefault(require("./apis/Youtube"));
const apis_1 = __importDefault(require("./apis/"));
const Metrics_1 = __importDefault(require("./apis/Metrics"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("./config");
const morgan_1 = __importDefault(require("morgan"));
class App {
    constructor() {
        this.express = (0, express_1.default)();
        this.middleware();
        this.routes();
        // Set up web server to use with socket.io
        this.server = http_1.default.createServer(this.express);
        // Create bot client and pass it to API
        this.bot = (0, bot_1.default)(this.server);
        Discord_1.default.setClient(this.bot);
        apis_1.default.setClient(this.bot);
        this.server.listen(config_1.PORT, () => {
            console.log(`Server listening at ${config_1.PORT}`);
        });
    }
    middleware() {
        this.express.use(express_1.default.urlencoded({ extended: true }));
        this.express.use(express_1.default.json());
        this.express.use((0, cors_1.default)());
        this.express.options('*', (0, cors_1.default)({
            origin: [config_1.CLIENT_URL],
            methods: ['GET', 'POST']
        }));
        this.express.use((0, morgan_1.default)('dev'));
        this.express.use((0, express_rate_limit_1.default)({
            windowMs: 1000,
            max: 10,
            message: 'Exceeded 10 requests/s',
            headers: true,
        }));
    }
    routes() {
        this.express.use('/', apis_1.default.router);
        this.express.use('/auth', Auth_1.default.router);
        this.express.use('/discord', Discord_1.default.router);
        this.express.use('/youtube', Youtube_1.default.router);
        this.express.use('/metrics', Metrics_1.default.router);
    }
}
exports.default = new App().express;
//# sourceMappingURL=index.js.map