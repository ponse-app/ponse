"use client";

import { memo, use, useEffect, useState } from "react";

const PreviewStatTable = ({pnoInfo, kuntaName}) => {

    const parameter = "he_miehet";

    const [rows, setRows] = useState([]);

    console.log(pnoInfo);

    const [kuntaNameCurrent, setKuntaNameCurrent] = useState("");

    useEffect(() => {
        if (!pnoInfo) {
            return;
        }
        if (kuntaNameCurrent != kuntaName) {
            setKuntaNameCurrent(kuntaName)
            setRows([]);
        }
    }, [pnoInfo, kuntaNameCurrent, kuntaName])

    useEffect(() => {
        for (let property in pnoInfo) {
            //console.log(typeof(pnoInfo));
        if (property == parameter) {
            setRows(previousRows => {
                if (previousRows.some(previousRow => previousRow.key === pnoInfo.id)) {
                    return previousRows;
                }
                
                return [...previousRows, {
                key: pnoInfo.id,
                postnumber: pnoInfo.postinumeroalue,
                value: pnoInfo[property]
            }]
        })
            //console.log(rows);
            /* setRows(previousRows => [...previousRows,
                <tr key={pnoInfo.id}>
                    <td>{pnoInfo.postinumeroalue}</td>
                    <td>{pnoInfo[property]}</td>
                </tr>]
            ) */
        }
    }   
    }, [pnoInfo])

    return (
        <div>
            <table className="m-2.5">
                <thead>
                    <tr>
                        <th>Postinumero</th>
                        <th>Arvo</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => 
                    <tr key={row.key}>
                        <td className="p-3 border-2 border-blue-400 border-collapse">{row.postnumber}</td>
                        <td className="p-3 border-2 border-blue-400 border-collapse">{row.value}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    )
}

export default memo(PreviewStatTable);