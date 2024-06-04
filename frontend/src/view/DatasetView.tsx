import { useContext } from "react";
import { Columns, TableContext, TableDataContext } from "../App";

const getDataset = (column: Columns) => {
    return `<Column type="${column.COLUMN_NAME}" />`;
};

export default () => {
    const selectTable = useContext(TableContext);
    const tableInfo = useContext<any>(TableDataContext);
    const targetColumns: Columns[] = tableInfo.tableInfo?.[selectTable];
    return (
        <>
            <div style={{ padding: 20 }}>
                {targetColumns?.map((column) => {
                    return <p key={column.COLUMN_NAME}>{getDataset(column)}</p>;
                })}
            </div>
        </>
    );
};
