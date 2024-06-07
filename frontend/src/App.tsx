import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DatasetView from "./view/DatasetView";
import Header from "./view/Header";
import TableList from "./view/TableList";
import Requires from "./view/Requires";
import Columns from "./view/Columns";
import Crud from "./view/Crud";

export type Columns = {
    COLUMN_NAME: string;
    DATA_TYPE: string;
    CHARACTER_MAXIMUM_LENGTH: number;
    COLUMN_DEFAULT: string;
    IS_NULLABLE: string;
    TABLE_NAME: string;
    COLUMN_KEY: string;
    COLUMN_COMMENT: string;
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

export const TableContext = createContext("");
export const TableDataContext = createContext({});

const App: React.FC = () => {
    const [response, setReponse] = useState<Response>({});
    const tableList = response.table_list;
    const tableInfo = response.table_info;
    const [selectTable, setSelectTable] = useState<string>("board");

    useEffect(() => {
        fetch("http://192.168.0.217:5110/list")
            .then((res) => res.json())
            .then((data) => setReponse(data))
            .catch((error) => console.log(error));
    }, []);

    const onClick = (tableName: string) => {
        setSelectTable(tableName);
    };

    return (
        <>
            <BrowserRouter>
                <Header />
                <TableDataContext.Provider value={{ tableInfo }}>
                    <TableContext.Provider value={selectTable}>
                        <div
                            style={{
                                display: "flex",
                                height: "calc(100% - 51px)",
                                position: 'relative'
                            }}
                        >
                            <TableList
                                table_list={tableList}
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
                            </Routes>
                        </div>
                    </TableContext.Provider>
                </TableDataContext.Provider>
            </BrowserRouter>
        </>
    );
};

export default App;
