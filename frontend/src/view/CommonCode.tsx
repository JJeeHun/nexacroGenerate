
import React, { useContext, useState } from 'react'
import {CommonCodeType, TableDataContext} from '../App'
import CopyPaste from '../util/CopyPaste'
import css from './CommonCode.module.css'


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

const Code = React.memo(({code}:{code:CommonCodeType}) => {
    if(!tableColors[code.code_grp]) tableColors[code.code_grp] = getRandomDarkColor();
    const color = tableColors[code.code_grp];
    return <>
        <div className={css.cell} style={{color}}>
            {code.code_grp}
        </div>
        <div className={css.cell} onDoubleClick={e => CopyPaste(e.target)}>
            {code.code_cd}
        </div>
        <div className={css.cell}>
            {code.code_enm}
        </div>
        <div className={css.cell}>
            {code.code_ex}
        </div>
        <div className={css.cell}>
            {code.sub_cd}
        </div>
        <div className={css.cell}>
            {code.sub_cd1}
        </div>
    </>
})

export default () => {
    const ctx = useContext<any>(TableDataContext);
    let allCodes:CommonCodeType[] = ctx?.commonCodes;
    let codes:CommonCodeType[] = allCodes;
    let filterGroupCodes:CommonCodeType[] = [];

    const [filter,setFilter] = useState<string>('');
    
    if(filter) {
        codes = codes.filter(code => (code.code_grp+code.code_cd+code.code_enm).toLocaleUpperCase().includes(filter.toUpperCase()) );

        const findGroups = codes.map(code => code.code_grp);
        filterGroupCodes = allCodes.filter(code => findGroups.includes(code.code_grp));
    }

    return <div style={{overflow:'auto'}}>
            <div>
                <label htmlFor="filter">Find Text : </label>
                <input type="text" id="filter" onKeyDown={(e:React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                        setFilter((e.target as HTMLInputElement).value);
                    }
                }}/>
            </div>
            <section className={css['grid-container']}>
                <div className={css.header}>Group</div>
                <div className={css.header}>Code</div>
                <div className={css.header}>EN Name</div>
                <div className={css.header}>Ex</div>
                <div className={css.header}>Sub1</div>
                <div className={css.header}>Sub2</div>

                {codes?.map((code) => <Code key={code.code_grp+code.code_cd} code={code}/>)}
                <hr />
                <hr />
                <hr />
                <hr />
                <hr />
                <hr />
                {filterGroupCodes?.map((code) => <Code key={code.code_grp+code.code_cd} code={code}/>)}
            </section>
    </div>
}