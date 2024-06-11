import express,{Request} from "express";
import mariadb from "mariadb";
import path from "path";
import cors from "cors";

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
    COLUMN_COMMENT: string;
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

const getClientIP = (req:Request) => {
    // x-forwarded-for 헤더가 있는 경우 그 값을 사용
    let clientIp = req.headers['x-forwarded-for'] as string | undefined;
    
    // x-forwarded-for 헤더가 없는 경우 req.connection.remoteAddress 사용
    if (!clientIp) {
        clientIp = req.socket.remoteAddress || '';
    }

    // IPv6 형식의 주소가 "::ffff:"로 시작하는 경우 IPv4 주소만 가져오도록 처리
    if (clientIp.startsWith('::ffff:')) {
        clientIp = clientIp.substring(7);
    }
    return clientIp;
}


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
                            COLUMN_COMMENT,
                            '${table.TABLE_NAME}' as TABLE_NAME,
                            '${table.TABLE_COMMENT}' as TABLE_COMMENT
                        FROM 
                            INFORMATION_SCHEMA.COLUMNS 
                        WHERE 
                            TABLE_SCHEMA = '${schema}' 
                        AND TABLE_NAME = '${table.TABLE_NAME}'`
        )
        .join("\r\nunion\r\n");

    return query(unionQuery);
};

const getMessage = async () => {
    return query(`
        select * from comm_msg_m
    `);
}

const getCommonCodes = async () => {
    const rootCodes = await query(`select code_grp,
                code_cd,
                code_knm,
                code_enm,
                sub_cd,
                sub_cd1,
                code_ex
            from tb_cs0100
            where CODE_GRP = '000'
    `);

    const childCodesString = rootCodes.map( (code:any) => {        
        return `select code_grp,
                    code_cd,
                    code_knm,
                    code_enm,
                    sub_cd,
                    sub_cd1,
                    code_ex
                from tb_cs0100
                where CODE_GRP = '${code.code_cd}'`
    }).join('union ')

    return await query(childCodesString);
}

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
    
    console.log(`요청 URL = ${req.url}, Client IP => ${getClientIP(req)}, Date => ${new Date().toLocaleTimeString()}`);
    const tableList = await getTables();
    
    const tableInfo:any = {};
    const columns: Columns[] = await getColumns(tableList);

    columns.forEach((column) => {
        tableInfo[column.TABLE_NAME] = tableInfo[column.TABLE_NAME] || [];
        tableInfo[column.TABLE_NAME].push(column);
    });
    

    await res.json({ table_list: tableList, table_info: tableInfo });
});

app.get("/message", async (req,res) => {
    await res.json(await getMessage());
});

app.get('/common-code', async (req,res) => {
    await res.json(await getCommonCodes());
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
});

app.listen(port, () => {
    console.log(`Server Running on http://localhost:${port}`);
});
