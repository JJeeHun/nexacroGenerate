import { useContext } from "react";
import { Columns, TableContext, TableDataContext } from "../App";

const DatasetType:any = {
    varchar: 'STRING',
    int: 'INT',
    float: 'FLOAT',
    BIGDICEMAL: 'BIGDECIMAL',
    date: 'DATE',
    time: 'TIME',
    datetime: 'DATETIME',
    text: 'BLOB',
}


const getDataset = (column: Columns) => {
    return `<Column id="${column.COLUMN_NAME}" type="${DatasetType[column.DATA_TYPE] || ''}" size="${column.CHARACTER_MAXIMUM_LENGTH || 256}" />`;
};

function copyMainText() {
    // Get the text from the main tag
    var mainText:any = document.querySelector("main")?.textContent;

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
    return (
        <>
            <button style={{position:'absolute' ,top:0,right:0}} onClick={() => {
                copyMainText();
            }}>
                Copy
            </button>
            <main style={{ padding: 20 }}>
                {'<ColumnInfo>'}
                {targetColumns?.map((column) => {
                    return <p key={column.COLUMN_NAME}>{getDataset(column)}</p>;
                })}
                {'</ColumnInfo>'}
            </main>
        </>
    );
};
