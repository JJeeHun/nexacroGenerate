import { useContext, useState } from "react";
import { Table, TableContext } from "../App";
import CopyPaste from '../util/CopyPaste'
import css from "./tableList.module.css";

interface Props {
    table_list?: Table[];
    isShow?: boolean;
    onClick: (tableName: string) => void;
}

export default ({ table_list,isShow, onClick }: Props) => {
    const [filterString, setFilterString] = useState<string>('');
    const selectTable = useContext(TableContext);

    if(filterString) {
        table_list = table_list?.filter(
            table => (table.TABLE_NAME+table.TABLE_COMMENT).toUpperCase().includes(filterString.toUpperCase())
        );
    }

    return (
        <>
            <div className={css["table-list"]} style={{width : isShow ? '' : 0}}>
                <div style={{padding: '10px 20px'}}>
                    <label htmlFor="searchTable" style={{marginRight:10}}>테이블명</label>
                    <input type="text" id="searchTable" style={{width: 150}} onChange={({target}) => setFilterString(target.value)}/>
                </div>
                <hr />
                <div className={css["box"]}>
                    {table_list?.map((table) => (
                        <button
                            key={table.TABLE_NAME}
                            className={
                                selectTable == table.TABLE_NAME ? css["active"] : ""
                            }
                            onClick={() => onClick(table.TABLE_NAME)}
                            onDoubleClick={() => CopyPaste(table.TABLE_NAME)}
                        >
                            {`${table.TABLE_NAME} ( ${table.TABLE_COMMENT} )`}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};
