import { useContext } from "react";
import { Table, TableContext } from "../App";
import css from "./tableList.module.css";

interface Props {
    table_list?: Table[];
    onClick: (tableName: string) => void;
}

export default ({ table_list, onClick }: Props) => {
    const selectTable = useContext(TableContext);
    return (
        <>
            <div className={css["table-list"]}>
                {table_list?.map((table) => (
                    <button
                        key={table.TABLE_NAME}
                        className={
                            selectTable == table.TABLE_NAME ? css["active"] : ""
                        }
                        onClick={() => onClick(table.TABLE_NAME)}
                    >
                        {table.TABLE_NAME}
                    </button>
                ))}
            </div>
        </>
    );
};
