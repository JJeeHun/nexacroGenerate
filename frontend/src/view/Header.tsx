import { Link } from "react-router-dom";
import css from "./header.module.css";

export default () => {
    return (
        <>
            <header style={{ borderBottom: "1px solid black" }}>
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
            </header>
        </>
    );
};
