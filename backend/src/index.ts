import express from "express";
import mariadb from "mariadb";
import path from "path";
import cors from "cors";
import { createCipheriv } from "crypto";

const app = express();
const port = process.env.PORT || 5110;
const schema = "sycw";

const pool = mariadb.createPool({
    host: "192.168.0.50",
    user: "sycwa",
    password: "sycwwms1234",
    database: schema,
    port: 3306,
    bigNumberStrings: true,
    bigIntAsNumber: true,
    connectionLimit: 5,
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../frontend/build")));

type Table = {
    TABLE_NAME: string;
    TABLE_COMMENT: string;
};

type Tables = Table[];

type Columns = {
    COLUMN_NAME: string;
    DATE_TYPE: string;
    CHARACTER_MAXIMUM_LENGTH: number;
    COLUMN_DEFAULT: string;
    IS_NULLABLE: string;
    TABLE_NAME: string;
    COLUMN_KEY: string;
};

let tableList: Tables;
let tableInfo: any; // = {};

const query = async (query: string) => {
    let conn;

    try {
        conn = await pool.getConnection();

        return await conn.query(query);
    } catch (err) {
        return err;
    } finally {
        if (conn) conn.release();
    }
};

const getTables = async () => {
    return query(`SELECT 
                        TABLE_NAME ,
                        TABLE_COMMENT
                    FROM 
                        INFORMATION_SCHEMA.TABLES 
                    WHERE 
                        TABLE_SCHEMA = '${schema}'`);
};

const getColumns = async (tables: Tables) => {
    const unionQuery = tables
        .map(
            (table) => `SELECT 
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
                        AND TABLE_NAME = '${table.TABLE_NAME}'`
        )
        .join("\r\nunion\r\n");

    return query(unionQuery);
};

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

app.get("/list", async (req, res) => {
    console.log('조회');
    const tableList = await getTables();
    
    const tableInfo:any = {};
    const columns: Columns[] = await getColumns(tableList);

    columns.forEach((column) => {
        tableInfo[column.TABLE_NAME] = tableInfo[column.TABLE_NAME] || [];
        tableInfo[column.TABLE_NAME].push(column);
    });
    

    await res.json({ table_list: tableList, table_info: tableInfo });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
});

app.listen(port, () => {
    console.log(`Server Running on http://localhost:${port}`);
});
