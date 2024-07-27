import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DatasetView from "./view/DatasetView";
import Header from "./view/Header";
import TableList from "./view/TableList";
import Requires from "./view/Requires";
import Columns from "./view/Columns";
import Crud from "./view/Crud";
import Message from "./view/Message";
import CommonCode from "./view/CommonCode";

export type Columns = {
    COLUMN_NAME: string;
    DATA_TYPE: string;
    CHARACTER_MAXIMUM_LENGTH: number;
    COLUMN_DEFAULT: string;
    IS_NULLABLE: string;
    TABLE_NAME: string;
    COLUMN_KEY: string;
    COLUMN_COMMENT: string;    
    TABLE_COMMENT: string;
};

export type Table = {
    TABLE_NAME: string;
    TABLE_COMMENT: string;
};

export type Tables = Table[];

interface Response {
    table_list?: Tables;
    table_info?: {
        any: Columns[];
    };
}

export interface MessageType {
    MSG_ID: string,
    MSG_TYPE: string,
    MSG_TEXT: string,
    MSG_ENG_TEXT: string,
}

export interface CommonCodeType {
    code_grp:string,
    code_cd:string,
    code_knm?:string,
    code_enm?:string,
    sub_cd?:string,
    sub_cd1?:string,
    code_ex?:string
}

export const TableContext = createContext("");
export const TableDataContext = createContext({});

const rootUrl = 'http://192.168.0.217:3000';
// const rootUrl = 'http://192.168.0.175:3000';
// const rootUrl = 'http://121.166.127.15:3000';

const App: React.FC = () => {
    const [response, setReponse] = useState<Response>({});
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [commonCodes, setCommonCodes] = useState<MessageType[]>([]);
    const tableList = response.table_list;
    const tableInfo = response.table_info;
    const [selectTable, setSelectTable] = useState<string>("board");
    const [isShow, setShow] = useState<boolean>(true);

    useEffect( () => {
        fetch(rootUrl+"/list")
            .then((res) => res.json())
            .then((tables) => {
                setReponse(tables);
            })
            .catch((error) => console.log(error));

        fetch(rootUrl+"/message")
            .then((res) => res.json())
            .then( messages => {                
                setMessages(messages);
            })
            .catch((error) => console.log(error));

        fetch(rootUrl+"/common-code")
            .then((res) => res.json())
            .then( commonCodes => {
                setCommonCodes(commonCodes);
            })
            .catch((error) => console.log(error));
    }, []);

    const onClick = (tableName: string) => {
        setSelectTable(tableName);
    };

    return (
        <>
            <BrowserRouter>
                <TableDataContext.Provider value={{ tableInfo ,messages ,commonCodes,isShow, setShow }}>
                    <TableContext.Provider value={selectTable}>
                        <Header />
                        <div
                            style={{
                                display: "flex",
                                height: "calc(100% - 51px)",
                                position: 'relative'
                            }}
                        >
                            <TableList
                                table_list={tableList}
                                isShow={isShow}
                                onClick={onClick}
                            />
                            <Routes>
                                <Route
                                    path="/dataset"
                                    element={<DatasetView />}
                                />
                                <Route
                                    path="/requires"
                                    element={<Requires />}
                                />
                                <Route
                                    path="/columns"
                                    element={<Columns />}
                                />
                                <Route
                                    path="/crud"
                                    element={<Crud />}
                                />
                                <Route
                                    path="/message"
                                    element={<Message />}
                                />
                                <Route
                                    path="/common-code"
                                    element={<CommonCode />}
                                />
                            </Routes>
                        </div>
                    </TableContext.Provider>
                </TableDataContext.Provider>
            </BrowserRouter>
        </>
    );
};

export default App;
