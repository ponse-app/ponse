"use client";
import { useTranslation } from "react-i18next";
import ParameterSelector from "./ParameterSelector";

const DataSelector = ({ setParameter }) => {

    const [t, i18n] = useTranslation();

    return (
        <div className="top-0 w-full flex flex-col items-center lg:items-baseline mb-2">
            <form action={""} method="post" className="z-10 ml-3">
                <div className="bg-gray-500 w-fit p-1 mt-5">
                    <fieldset className="text-center flex items-center">
                        <legend className="block w-full text-center">{t('chooseParameter')}</legend>
                        <ParameterSelector
                            setParameter={setParameter}
                            inputName={"parameter1"}
                        />
                    </fieldset>
                </div>
                <p className="bg-gray-700 text-center">{t('source')}</p>
            </form>
        </div>
    );
};

export default DataSelector;
