"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const app = (0, express_1.default)();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8080;
const corOptions = {
    origin: "http://localhost:3000",
    methods: "GET,PATCH,POST,DELETE",
};
app.use((0, cors_1.default)(corOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.json({ message: "Hello from API Services!" });
});
// app.use('/v1', router)
try {
    app.listen(PORT, () => {
        console.log(`Server is listning PORT: ${PORT}`);
    });
}
catch (error) {
    console.log(`Error occureed: ${error.message}`);
}
