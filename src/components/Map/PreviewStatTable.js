"use client";

import { memo, use, useEffect, useState } from "react";
import pno_stat from "../../app/pno_tilasto.json";
import React from "react";

const PreviewStatTable = ({pnoInfo, kuntaName, parameter}) => {

    const [rows, setRows] = useState([]);

    //console.log(pnoInfo);
    console.log("parameter", parameter);

    const [kuntaNameCurrent, setKuntaNameCurrent] = useState("");

    const [parameterCurrent, setParameterCurrent] = useState("he_miehet");

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
        if (parameterCurrent != parameter) {
            setParameterCurrent(parameter);
        }

        setRows(previousRows => {
           return previousRows.map(previousRow => {
                for (let pno of pno_stat.features) {
                    if (pno.properties.id == previousRow.key) {
                        return {
                            ...previousRow,
                            value: pno.properties[parameterCurrent]
                        };
                    };
                }

                // If for loop can't find a match returns the previousRow. This shouldn't happen but can implement
                //something better if needed.
                return previousRow;
            })
        })
    }, [parameter, parameterCurrent])

    useEffect(() => {
        if (!pnoInfo) {
            return;
        }
        for (let property in pnoInfo) {
            //console.log(typeof(pnoInfo));
        if (property == parameter) {
            setRows(previousRows => {
                if (previousRows.some(previousRow => previousRow.key === pnoInfo.id)) {
                    return previousRows;
                }
                
                return [...previousRows, {
                key: pnoInfo.id,
                name: pnoInfo.nimi,
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
    }, [pnoInfo, parameter])

    return (
        <div className="max-h-1/2 lg:max-h-[50vh] overflow-y-auto max-w-[100%] flex justify-center">
            <table className="m-2.5">
                {rows.length!=0 ? (
                    <thead>
                    <tr>
                        <th>Postinumeroalue</th>
                        <th>Arvo</th>
                    </tr>
                </thead>                    
                ) : null}
                <tbody>
                    {rows.map((row) => 
                    <tr key={row.key}>
                        <td className="p-3 border-2 border-blue-400 border-collapse text-wrap">{row.name}<br/>{row.postnumber}</td>
                        <td className="p-3 border-2 border-blue-400 border-collapse">{row.value}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    )
}

export default memo(PreviewStatTable);