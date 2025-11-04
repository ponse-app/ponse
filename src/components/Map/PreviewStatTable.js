"use client";

import { memo, useEffect, useState } from "react";

const PreviewStatTable = ({pnoInfo}) => {

    const parameter = "he_miehet";

    const [rows, setRows] = useState([]);

    useEffect(() => {
        for (let property in pnoInfo) {
            console.log(typeof(pnoInfo));
        if (property == parameter) {
            setRows(previousRows => [...previousRows,
                <tr key={pnoInfo.id}>
                    <td>{pnoInfo.postinumeroalue}</td>
                    <td>{pnoInfo[property]}</td>
                </tr>]
            )
        }
    }   
    }, [pnoInfo])

    return (
        <div>
            <table>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )
}

export default memo(PreviewStatTable);