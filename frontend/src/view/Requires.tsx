import { useContext } from "react";
import { Columns, TableContext, TableDataContext } from "../App";



export default () => {
    const selectTable = useContext(TableContext);
    const tableInfo = useContext<any>(TableDataContext);
    const targetColumns: Columns[] = tableInfo.tableInfo?.[selectTable];
    return <main>
        <pre>// validation 설정</pre>
        <pre>var config = {'{'}</pre>
        <pre>   dataset: this.ds_{selectTable},</pre>
        <pre>   {'setting: ['}</pre>
        <pre>
            {
            targetColumns?.filter(column => column?.IS_NULLABLE?.toLocaleLowerCase() == 'no')
            .map((column,i) => {
                return <pre>        ["{column.COLUMN_NAME}","message_{column.COLUMN_NAME}"] ,</pre>
            })
            }
        </pre>
        <pre>   {']'}</pre>
        <pre>{'}'}</pre>
        <br />
        <pre>// 실패시 Error로 종료 처리</pre>
        <pre>this.gfn_requireValidation(config);</pre>
        
    </main>
}