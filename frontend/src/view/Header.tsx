import { Link } from "react-router-dom";
import css from "./header.module.css";
import { TableDataContext } from "../App";
import { useContext } from "react";

export default () => {
    const ctx = useContext<any>(TableDataContext);
    const showText = ctx.isShow ? '<' : '>';
    const setShow = ctx?.setShow;

    return (
        <>
            <header style={{ borderBottom: "1px solid black" ,position:'relative'}}>
                <nav className={css.nav}>
                    <Link to="/columns" className={css["link-button"]}>
                        Columns
                    </Link>
                    <Link to="/dataset" className={css["link-button"]}>
                        Dataset
                    </Link>
                    <Link to="/requires" className={css["link-button"]}>
                        Requires
                    </Link>
                    <Link to="/crud" className={css["link-button"]}>
                        CRUD
                    </Link>
                    <Link to="/message" className={css["link-button"]}>
                        Message
                    </Link>
                    <Link to="/common-code" className={css["link-button"]}>
                        Common Codes
                    </Link>
                </nav>
                <button className={css['slide-button']} onClick={() => setShow((prev:boolean) => !prev)}>{showText}</button>
            </header>
        </>
    );
};
