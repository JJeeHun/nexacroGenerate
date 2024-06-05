import { useContext, useState } from "react";
import { Columns, TableContext, TableDataContext } from "../App";
import css from './Columns.module.css';

interface Props {
    column:Columns,
    tableName:string,
}

const Column = ({column,tableName}:Props) => {
    return <>
        <div className={css.cell}>
            {tableName}
        </div>
        <div className={css.cell}>
            {column.COLUMN_NAME}
        </div>
        <div className={css.cell}>
            {column.CHARACTER_MAXIMUM_LENGTH}
        </div>
        <div className={css.cell}>
            {column.DATA_TYPE}
        </div>
        <div className={css.cell}>
            {column.IS_NULLABLE}
        </div>
        <div className={css.cell}>
            {column.COLUMN_KEY === 'PRI' ? <input type="checkbox" checked/> : ''}
        </div>
    </>
}


export default () => {
    const [filterColumn,setFilterColumn] = useState<string>('');
    const selectTable = useContext(TableContext);
    let tableInfo:{[any:string]: Columns[]} = useContext<any>(TableDataContext)?.tableInfo || {};        
    
    if(!filterColumn) {
        tableInfo = {[selectTable]: tableInfo[selectTable]};
    } else {
        const newTableInfo:{[any:string]: Columns[]} = {};
        for(const tableName in tableInfo) {
            const columns = tableInfo[tableName];
            const filterData = columns.filter(column => column.COLUMN_NAME.toUpperCase().includes( filterColumn.toUpperCase()) );
            newTableInfo[tableName] = filterData;
        }
        tableInfo = newTableInfo;
    }

    return <main className={css['main-container']}>
        <section style={{padding: '10px 20px'}}>
            <label htmlFor="search_column">찾을 컬럼명: </label>
            <input type="text" id="search_column" onChange={({target}) => {
                setFilterColumn(target.value);
            }}/>
        </section>
        <section className={css['grid-container']}>
            <div className={css.header}>Table</div>
            <div className={css.header}>Column</div>
            <div className={css.header}>Length</div>
            <div className={css.header}>Data Type</div>
            <div className={css.header}>is Null</div>
            <div className={css.header}>PK</div>
            {
                Object?.entries(tableInfo)
                ?.map(([tableName,columns]) => {
                    return columns?.map(column => <Column key={tableName+column.COLUMN_NAME} tableName={tableName} column={column} />)
                })
            }
        </section>
    </main>
}