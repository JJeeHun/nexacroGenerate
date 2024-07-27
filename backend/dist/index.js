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
const port = process.env.PORT || 3000;
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
const getClientIP = (req) => {
    // x-forwarded-for 헤더가 있는 경우 그 값을 사용
    let clientIp = req.headers['x-forwarded-for'];
    // x-forwarded-for 헤더가 없는 경우 req.connection.remoteAddress 사용
    if (!clientIp) {
        clientIp = req.socket.remoteAddress || '';
    }
    // IPv6 형식의 주소가 "::ffff:"로 시작하는 경우 IPv4 주소만 가져오도록 처리
    if (clientIp.startsWith('::ffff:')) {
        clientIp = clientIp.substring(7);
    }
    return clientIp;
};
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
                            COLUMN_COMMENT,
                            '${table.TABLE_NAME}' as TABLE_NAME,
                            '${table.TABLE_COMMENT}' as TABLE_COMMENT
                        FROM 
                            INFORMATION_SCHEMA.COLUMNS 
                        WHERE 
                            TABLE_SCHEMA = '${schema}' 
                        AND TABLE_NAME = '${table.TABLE_NAME}'`)
        .join("\r\nunion\r\n");
    return query(unionQuery);
});
const getMessage = () => __awaiter(void 0, void 0, void 0, function* () {
    return query(`
        select * from comm_msg_m
    `);
});
const getCommonCodes = () => __awaiter(void 0, void 0, void 0, function* () {
    const rootCodes = yield query(`select code_grp,
                code_cd,
                code_knm,
                code_enm,
                sub_cd,
                sub_cd1,
                code_ex
            from tb_cs0100
            where CODE_GRP = '000'
    `);
    if (!Array.isArray(rootCodes))
        return [];
    const childCodesString = rootCodes === null || rootCodes === void 0 ? void 0 : rootCodes.map((code) => {
        return `select code_grp,
                    code_cd,
                    code_knm,
                    code_enm,
                    sub_cd,
                    sub_cd1,
                    code_ex
                from tb_cs0100
                where CODE_GRP = '${code.code_cd}'`;
    }).join('union ');
    return yield query(childCodesString);
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
const temp_copy = (tableList) => {
    tableList.forEach(tableInfo => {
        console.log(`INSERT INTO sycwdev.${tableInfo.TABLE_NAME} SELECT * FROM sycw.${tableInfo.TABLE_NAME}`);
    });
};
app.get("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`요청 URL = ${req.url}, Client IP => ${getClientIP(req)}, Date => ${new Date().toLocaleString()}`);
        let tableList = yield getTables();
        tableList = (tableList === null || tableList === void 0 ? void 0 : tableList.filter(table => !(table.TABLE_NAME.includes('_del') || table.TABLE_NAME.includes('_bak')))) || [];
        const tableInfo = {};
        const columns = yield getColumns(tableList);
        columns.forEach((column) => {
            tableInfo[column.TABLE_NAME] = tableInfo[column.TABLE_NAME] || [];
            tableInfo[column.TABLE_NAME].push(column);
        });
        yield res.json({ table_list: tableList, table_info: tableInfo });
    }
    catch (e) {
        console.log(e);
        res.json({ table_list: [], table_info: {} });
    }
}));
app.get("/message", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield res.json(yield getMessage());
}));
app.get('/common-code', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield res.json(yield getCommonCodes());
}));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../frontend/build", "index.html"));
});
app.listen(port, () => {
    console.log(`Server Running on http://localhost:${port}`);
});
