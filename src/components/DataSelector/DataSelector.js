"use client";
import { useState } from "react";
import ParameterSelector from "./ParameterSelector";

const DataSelector = ({ setParameter }) => {
    const [Category, setCategory] = useState("Asukasrakenne")
    const Categories = {
        "Asukasrakenne": {
            "miehet" : "Miesten määrä",
            "naiset" : "Naisten määrä",
            "ika_65_p": "ika_65_p"
        },
        "Rakennukset ja asunnot": {
            "ra_ke" : "Kesämökkien määrä",
            "ra_raky" : "Rakennukset yhteensä",
        },
        "Asukkaiden käytettävissä olevat rahatulot": {
            "hr_mtu" : "Asukkaiden mediaanitulot",
            "hr_ktu": "Asukkaiden keskitulot",
        }
    }
    
    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory)
        const firstParameter = Object.keys(Categories[newCategory])[0]
        setParameter(firstParameter)
    }
    
    return (
        <div className="top-0 w-full lg:w-[50%] flex flex-col items-center lg:items-baseline mb-2">
            <form action={""} method="post" className="z-10 ml-3">
                <div className="flex bg-gray-500 w-fit p-1 mt-5">
                    <fieldset className="text-center flex items-center">
                        <legend className="block w-full text-center">Valitse kategoria:</legend>
                        <ParameterSelector
                            setParameter={handleCategoryChange}
                            inputName={"parameter1"}
                            parameters={Object.keys(Categories).map(key => [key, key])}
                        />
                    </fieldset>
                    <fieldset className="text-center flex items-center">
                        <legend className="block w-full text-center">Valitse parametri:</legend>
                        <ParameterSelector
                            setParameter={setParameter}
                            inputName={"parameter1"}
                            parameters={Object.entries(Categories[Category])}
                        />
                    </fieldset>
                </div>
                <p className="bg-gray-700 text-center">Lähde: Tilastokeskus</p>
            </form>
        </div>
    );
};

export default DataSelector;
