import { useContext, useState } from "react";
import { Columns, TableContext, TableDataContext } from "../App";

const getInsert = (tableName?:string, columns?:Columns[]) => {
    return <>
        <pre>insert into {tableName}</pre>
        <pre>(</pre>
            {columns?.map((column,i) => <pre key={column.COLUMN_NAME}>       {column.COLUMN_NAME} {i !== columns.length-1 ? ',':''}</pre>)}
        <pre>) values (</pre>
        {columns?.map((column,i) => <pre key={column.COLUMN_NAME}>       {`#{${column.COLUMN_NAME}}`} {i !== columns.length-1 ? ',':''}</pre>)}
        <pre>)</pre>
    </>
}
const getUpdate = (tableName:string, columns:Columns[]) => {
    return <>
        <pre>update {tableName}</pre>
        <pre>set</pre>
            {columns?.filter( column=> column.COLUMN_KEY !== 'PRI')
                    .map((column,i) => <pre key={column.COLUMN_NAME}>       {column.COLUMN_NAME} = {`#{${column.COLUMN_NAME}}`} {i !== columns.length-1 ? ',':''}</pre>)}
        <pre>where</pre>
        {columns?.filter(column => column.COLUMN_KEY === 'PRI')
                .map((column,i) => <pre key={column.COLUMN_NAME}>       {i !== 0 ? 'and ':''}{column.COLUMN_NAME} = {`#{${column.COLUMN_NAME}}`} </pre>)}
    </>
}
const getSelect = (tableName:string, columns:Columns[]) => {
    return <>
        <pre>select</pre>
        {columns?.map((column,i) => <pre key={column.COLUMN_NAME}>       {column.COLUMN_NAME}{i !== columns.length-1 ? ',':''}</pre>)}
        <pre>from {tableName}</pre>
    </>
}
const getDelete = (tableName:string, columns:Columns[]) => {
    return <>
        <pre>delete from {tableName}</pre>
        <pre>where</pre>
        {columns?.filter(column => column.COLUMN_KEY === 'PRI')
                .map((column,i) => <pre key={column.COLUMN_NAME}>       {i !== 0 ? 'and ':''}{column.COLUMN_NAME} = {`#{${column.COLUMN_NAME}}`} </pre>)}
    </>
}

const crudInfo:any = {
    C: getInsert,
    R: getSelect,
    U: getUpdate,
    D: getDelete,
}


function copyMainText() {
    // Get the text from the main tag
    var mainText:any = document.querySelector("#copy-area")?.textContent;

    // Use the Clipboard API to copy the text
    if(navigator.clipboard) {
        navigator.clipboard
            .writeText(mainText)
            .then(function() {
                alert('Copy Success');
            }).catch(function(err) {
                console.error('Failed to copy text: ', err);
            });
    }else {
        fallbackCopyTextToClipboard(mainText);
    }
}

function fallbackCopyTextToClipboard(text:string) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile devices

    try {
        var successful = document.execCommand("copy");
        alert(successful)
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

export default () => {
    const selectTable = useContext(TableContext);
    const tableInfo = useContext<any>(TableDataContext);
    const targetColumns: Columns[] = tableInfo.tableInfo?.[selectTable];
    const [target,setTarget] = useState<string>('C');
    const fn = crudInfo[target];

    return <main>
        <div>
            <button onClick={() => setTarget('C')}>Insert</button>
            <button onClick={() => setTarget('U')}>Update</button>
            <button onClick={() => setTarget('R')}>Select</button>
            <button onClick={() => setTarget('D')}>Delete</button>
            <button onClick={() => copyMainText()}>Copy</button>
        </div>
        <div id="copy-area" style={{padding: 20}}>
            {fn(selectTable,targetColumns)}
        </div>
    </main>
}