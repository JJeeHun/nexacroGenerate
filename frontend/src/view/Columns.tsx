import { useContext, useState } from "react";
import { Columns, TableContext, TableDataContext } from "../App";
import css from './Columns.module.css';

interface Props {
    column:Columns,
    tableName:string,
}

const tableColors:{[any:string]:string} = {};

function getRandomDarkColor() {
    // Function to generate a random integer between min and max (inclusive)
    function getRandomInt(min:number, max:number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generate random RGB values for a light color
    // Ensuring the colors are sufficiently bright but not too close to the background color
    const r = getRandomInt(10, 200);
    const g = getRandomInt(10, 200);
    const b = getRandomInt(10, 200);

    // Convert RGB to hex
    const color = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;

    return color;
}

const Column = ({column,tableName}:Props) => {
    if(!tableColors[tableName]) tableColors[tableName] = getRandomDarkColor();
    const color = tableColors[tableName];
    return <>
        <div className={css.cell} style={{color}}>
            {column.TABLE_NAME}
        </div>
        <div className={css.cell} style={{color}}>
            {column.TABLE_COMMENT}
        </div>
        <div className={css.cell}>
            {column.COLUMN_NAME}
        </div>
        <div className={css.cell}>
            {column.COLUMN_COMMENT}
        </div>
        <div className={css.cell}>
            {column.CHARACTER_MAXIMUM_LENGTH}
        </div>
        <div className={css.cell}>
            {column.DATA_TYPE}
        </div>
        <div className={css.cell}>
            {column.IS_NULLABLE == 'YES' ? '' : <input type="checkbox" checked  readOnly/>}
        </div>
        <div className={css.cell}>
            {column.COLUMN_KEY === 'PRI' ? <input type="checkbox" checked readOnly/> : ''}
        </div>
    </>
}

export default () => {
    const [filterColumn,setFilterColumn] = useState<string>('');
    const selectTable = useContext(TableContext);
    const ctx = useContext<any>(TableDataContext);
    const isShow:boolean = ctx.isShow;
    let tableInfo:{[any:string]: Columns[]} = ctx?.tableInfo || {};
    
    if(!filterColumn) {
        tableInfo = {[selectTable]: tableInfo[selectTable]};
    } else {
        const newTableInfo:{[any:string]: Columns[]} = {};
        for(const tableName in tableInfo) {
            const columns = tableInfo[tableName];
            let filterData;
            
            if(filterColumn.includes(',')) {
                const findList = filterColumn.split(',').map(find => find.toUpperCase());
                filterData = columns.filter(column => findList.some(find => ( (column.TABLE_NAME + column.COLUMN_NAME + column.COLUMN_COMMENT).toUpperCase()).includes(find) ) );
            }else {
                filterData = columns.filter(column => (column.TABLE_NAME + column.COLUMN_NAME + column.COLUMN_COMMENT).toUpperCase().includes( filterColumn.toUpperCase()) );
            }

            newTableInfo[tableName] = filterData;
        }
        tableInfo = newTableInfo;
    }

    return <main className={css['main-container']} style={{width: (isShow ? '' : '100%')}}>
        <section style={{padding: '10px 20px'}}>
            <label htmlFor="search_column">Find Table or Column or Comment : </label>
            <input type="text" id="search_column" onKeyUp={(e) => {
                if( e.key != 'Enter') return;
                
                const target = e.target as HTMLInputElement;
                setFilterColumn(target.value);
            }}/>
        </section>
        <section className={css['grid-container']}>
            <div className={css.header}>Table</div>
            <div className={css.header}>Table Comment</div>
            <div className={css.header}>Column</div>
            <div className={css.header}>Comment</div>
            <div className={css.header}>Length</div>
            <div className={css.header}>Data Type</div>
            <div className={css.header}>is Require</div>
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