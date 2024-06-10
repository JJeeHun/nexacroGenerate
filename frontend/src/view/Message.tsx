import { useContext, useState } from "react";
import { TableDataContext, MessageType } from "../App";
import CopyPaste from '../util/CopyPaste'
import css from './Message.module.css';



const Message = ({message}:{message:MessageType}) => {
    return <>
        <div className={css.cell} onDoubleClick={e => CopyPaste(e.target)}>
            {message.MSG_ID}
        </div>
        <div className={css.cell} style={{fontSize:'0.8rem'}}>
            {message.MSG_TEXT}
        </div>
        <div className={css.cell}>
            {message.MSG_ENG_TEXT}
        </div>
        <div className={css.cell}>
            {message.MSG_TYPE}
        </div>
    </>
}


export default () => {
    const dataContext = useContext<any>(TableDataContext);
    const [filter, setFilter] = useState<string>('');
    let messages:MessageType[] = dataContext.messages;

    if(filter) messages = messages.filter(message => (message.MSG_ID+message.MSG_TEXT+message.MSG_ENG_TEXT).toLocaleUpperCase().includes(filter.toUpperCase()) );

    return <>
        <div>
            <div>
                <label htmlFor="filter">Find Text : </label>
                <input type="text" id="filter" onChange={e => {
                    setFilter(e.target.value);
                }}/>
            </div>
            <section className={css['grid-container']}>
                <div className={css.header}>ID</div>
                <div className={css.header}>Text</div>
                <div className={css.header}>Eng Text</div>
                <div className={css.header}>Type</div>

                {messages?.map((message) => <Message key={message.MSG_ID} message={message}/>)}
            </section>
        </div>
    </>
    
}