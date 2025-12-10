"use client";

import { useTranslation } from "react-i18next";

const ParameterSelector = ({ inputName, setParameter, parameters }) => {

    // i18n
    const [t, i18n] = useTranslation();

    return (
        <div className="bg-gray-500 w-fit m-5">
            <select
                onChange={(event) => setParameter(event.target.value)}
                className="bg-gray-700 w-[100%]"
                id="input1">

                {parameters?.map((dataName) => <option key={dataName} value={dataName}>{t(`parameter.${dataName}`)}</option> )}
            </select>
        </div>
    );
};

export default ParameterSelector;
