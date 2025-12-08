"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ParameterSelector from "./ParameterSelector";

const DataSelector = ({ setParameter }) => {

    const [t, i18n] = useTranslation();

    const [Category, setCategory] = useState("Yleiset tiedot");
    const Categories = {
        "Yleiset tiedot": {
            "pinta_ala_km2" : "Pinta-ala (km²)",
            "pt_tyoll_p" : "Työllisten määrä (%)",
            "pt_tyott_p" : "Työttömien määrä (%)",
            "pt_opisk_p" : "Opiskelijoiden määrä (%)",
            "pt_elakel_p" : "Eläkeläisten määrä (%)",
        },
        "Asukasrakenne": {
            "vaesto" : "Väkiluku",
            "miehet" : "Miesten määrä",
            "he_miehet_p" : "Miesten osuus väkiluvusta (%)",
            "naiset" : "Naisten määrä",
            "he_naiset_p" : "Naisten osuus väkiluvusta (%)",
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
        },
        "Asukkaiden koulutusaste (korkein suoritettu koulutusaste)": {
            "ko_perus_p" : "Perusasteen suorittaneet (%)",
            "ko_tas_p" : "Toisen asteen suorittaneet (%)",
            "ko_yliop_p" : "Ylioppilastutkinnon suorittaneet (%)",
            "ko_ammat_p" : "Ammatillisen tutkinnon suorittaneet (%)",
            "ko_al_kork_p" : "Alemman korkeakoulututkinnon suorittaneet (%)",
            "ko_yl_kork_p" : "Ylemmän korkeakoulututkinnon suorittaneet (%)",
        },
        "Asukkaiden käytössä olevat rahatulot": {
            "hr_ktu" : "Asukkaiden keskitulot (vuosittain)",
            "hr_mtu" : "Asukkaiden mediaanitulot (vuosittain)",
            "hr_pi_tul_p" : "Alimpaan tuloluokkaan kuuluvat asukkaat (%)",
            "hr_ke_tul_p" : "Keskimmäiseen tuloluokkaan kuuluvat asukkaat (%)",
            "hr_hy_tul_p" : "Ylimpään tuloluokkaan kuuluvat asukkaat (%)",
        },
        "Talouksien koko ja elämänvaihe": {
            "te_taly" : "Talouksia yhteensä",
            "te_takk" : "Talouksien keskikoko (henkilöä)",
            "te_as_valj" : "Asumisväljyys (m²/henkilö)",
            "te_yks_p" : "Yksinasuvien taloudet (%)",
            "te_laps_p" : "Lapsitaloudet (%)",
            "te_yhlap_p" : "Yhden vanhemman lapsitaloudet (%)",
            "te_omis_as_p" : "Omistusasunnoissa asuvat taloudet (%)",
            "te_vuok_as_p" : "Vuokra- ja asumisoikeusasunnoissa asuvat taloudet (%)",
        },
        "Talouksien käytössä olevat rahatulot (vuosittain)": {
            "tr_ktu" : "Talouksien keskitulot (vuosittain)",
            "tr_mtu" : "Talouksien mediaanitulot",
            "tr_pi_tul_p" : "Alimpaan tuloluokkaan kuuluvat taloudet (%)",
            "tr_ke_tul_p" : "Keskimmäiseen tuloluokkaan kuuluvat taloudet (%)",
            "tr_hy_tul_p" : "Ylimpään tuloluokkaan kuuluvat taloudet (%)",
        },
        "Rakennukset ja asunnot": {
            "ra_ke" : "Kesämökkien määrä",
            "ra_raky" : "Rakennukset yhteensä",
            "ra_asrak" : "Asuinrakennukset yhteensä",
            "ra_asrak_p" : "Asuinrakennusten osuus (%)",
            "ra_as_kpa" : "Asuntojen keskipinta-ala (m²)",
            "ra_pt_as_p" : "Pientaloasunnot (%)",
            "ra_kt_as_p" : "Kerrostaloasunnot (%)",
        },
        "Työpaikat toimialoittain": {
            "tp_tyopy" : "Työpaikat yhteensä",
            "tp_alku_a" : "Alkutuotannon työpaikat",
            "tp_jalo_bf" : "Jalostuksen työpaikat",
            "tp_palv_gu" : "Palveluiden työpaikat",
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
                        <legend className="block w-full text-center">{t('chooseParameter')}</legend>
                        <ParameterSelector
                            setParameter={setParameter}
                            inputName={"parameter1"}
                            parameters={Object.entries(Categories[Category])}
                        />
                    </fieldset>
                </div>
                <p className="bg-gray-700 text-center">{t('source')}</p>
            </form>
        </div>
    );
};

export default DataSelector;
