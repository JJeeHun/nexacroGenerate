"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mariadb_1 = __importDefault(require("mariadb"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5110;
const schema = "sycw";
const pool = mariadb_1.default.createPool({
    host: "192.168.0.50",
    user: "sycwa",
    password: "sycwwms1234",
    database: schema,
    port: 3306,
    bigNumberStrings: true,
    bigIntAsNumber: true,
    connectionLimit: 5,
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/build")));
let tableList;
let tableInfo; // = {};
const query = (query) => __awaiter(void 0, void 0, void 0, function* () {
    let conn;
    try {
        conn = yield pool.getConnection();
        return yield conn.query(query);
    }
    catch (err) {
        return err;
    }
    finally {
        if (conn)
            conn.release();
    }
});
const getTables = () => __awaiter(void 0, void 0, void 0, function* () {
    return query(`SELECT 
                        TABLE_NAME ,
                        TABLE_COMMENT
                    FROM 
                        INFORMATION_SCHEMA.TABLES 
                    WHERE 
                        TABLE_SCHEMA = '${schema}'`);
});
const getColumns = (tables) => __awaiter(void 0, void 0, void 0, function* () {
    const unionQuery = tables
        .map((table) => `SELECT 
                            COLUMN_NAME, 
                            DATA_TYPE, 
                            CHARACTER_MAXIMUM_LENGTH, 
                            IS_NULLABLE, 
                            COLUMN_DEFAULT,
                            COLUMN_KEY,
                            '${table.TABLE_NAME}' as TABLE_NAME
                        FROM 
                            INFORMATION_SCHEMA.COLUMNS 
                        WHERE 
                            TABLE_SCHEMA = '${schema}' 
                        AND TABLE_NAME = '${table.TABLE_NAME}'`)
        .join("\r\nunion\r\n");
    return query(unionQuery);
});
// app.get("/list", async (req, res) => {
//     if (!tableList) tableList = await getTables();
//     if (!tableInfo) {
//         tableInfo = {};
//         const columns: Columns[] = await getColumns(tableList);
//         columns.forEach((column) => {
//             tableInfo[column.TABLE_NAME] = tableInfo[column.TABLE_NAME] || [];
//             tableInfo[column.TABLE_NAME].push(column);
//         });
//     }
//     res.json({ table_list: tableList, table_info: tableInfo });
// });
app.get("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tableList = yield getTables();
    const tableInfo = {};
    const columns = yield getColumns(tableList);
    columns.forEach((column) => {
        tableInfo[column.TABLE_NAME] = tableInfo[column.TABLE_NAME] || [];
        tableInfo[column.TABLE_NAME].push(column);
    });
    yield res.json({ table_list: tableList, table_info: tableInfo });
}));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../frontend/build", "index.html"));
});
app.listen(port, () => {
    console.log(`Server Running on http://localhost:${port}`);
});
