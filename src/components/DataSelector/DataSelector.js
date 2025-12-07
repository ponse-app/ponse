"use client";
import { useState } from "react";
import ParameterSelector from "./ParameterSelector";

const DataSelector = ({ setParameter }) => {
    const [Category, setCategory] = useState("Asukasrakenne")
    const Categories = {
        "Yleiset tiedot": {
            "pinta_ala" : "Pinta-ala (m²)",
            "pt_tyoll" : "Työllisten määrä",
            "pt_tyott" : "Työttömien määrä",
            "pt_opisk" : "Opiskelijoiden määrä",
            "pt_elakel" : "Eläkeläisten määrä",
        },
        "Asukasrakenne": {
            "vaesto" : "Väkiluku",
            "miehet" : "Miesten määrä",
            "naiset" : "Naisten määrä",
            "he_kika" : "Asukkaiden keski-ikä",
            "he_0_2" : "0-2 -vuotiaat",
            "ika_3_12" : "3-12 -vuotiaat",
            "ika_13_19" : "13-19 -vuotiaat",
            "ika_20_29" : "20-29 -vuotiaat",
            "ika_30_64" : "30-64 -vuotiaat",
            "ika_65" : "65-vuotiaat ja vanhemmat",
            "ika_0_17_p" : "Alaikäisten osuus väkiluvusta (%)",
            "ika_25_64_p" : "25-64 -vuotiaiden osuus väkiluvusta (%)",
            "ika_65_p" : "Yli 65-vuotiaiden osuus väkiluvusta (%)",
            "he_miehet_p" : "Miesten osuus väkiluvusta (%)",
            "he_naiset_p" : "Naisten osuus väkiluvusta (%)"
        },
        "Rakennukset ja asunnot": {
            "ra_ke" : "Kesämökkien määrä",
            "ra_raky" : "Rakennukset yhteensä",
        },
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
