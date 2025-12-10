"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ParameterSelector from "./ParameterSelector";

const DataSelector = ({ setParameter, parameter }) => {
  const [t, i18n] = useTranslation();

  const [category, setCategory] = useState("Yleiset tiedot");

  const categories = {
        "Yleiset tiedot": [
            "pinta_ala_km2",
            "pt_tyoll_p",
            "pt_tyott_p",
            "pt_opisk_p",
            "pt_elakel_p",
        ],
        "Asukasrakenne": [
            "vaesto",
            "miehet",
            "he_miehet_p",
            "naiset",
            "he_naiset_p",
            "he_kika",
            "he_0_2",
            "ika_3_12",
            "ika_13_19",
            "ika_20_29",
            "ika_30_64",
            "ika_65",
            "ika_0_17_p",
            "ika_25_64_p",
            "ika_65_p",
        ],
        "Asukkaiden koulutusaste (korkein suoritettu koulutusaste)": [
            "ko_perus_p",
            "ko_tas_p",
            "ko_yliop_p",
            "ko_ammat_p",
            "ko_al_kork_p",
            "ko_yl_kork_p",
        ],
        "Asukkaiden käytössä olevat rahatulot": [
            "hr_ktu",
            "hr_mtu",
            "hr_pi_tul_p",
            "hr_ke_tul_p",
            "hr_hy_tul_p",
        ],
        "Talouksien koko ja elämänvaihe": [
            "te_taly",
            "te_takk",
            "te_as_valj",
            "te_yks_p",
            "te_laps_p",
            "te_yhlap_p",
            "te_omis_as_p",
            "te_vuok_as_p",
        ],
        "Talouksien käytössä olevat rahatulot (vuosittain)": [
            "tr_ktu",
            "tr_mtu",
            "tr_pi_tul_p",
            "tr_ke_tul_p",
            "tr_hy_tul_p",
        ],
        "Rakennukset ja asunnot": [
            "ra_ke",
            "ra_raky",
            "ra_asrak",
            "ra_asrak_p",
            "ra_as_kpa",
            "ra_pt_as_p",
            "ra_kt_as_p",
        ],
        "Työpaikat toimialoittain": [
            "tp_tyopy",
            "tp_alku_a",
            "tp_jalo_bf",
            "tp_palv_gu",
        ],
}

console.log(Object.entries(categories).map(category => category[0]), Object.values(categories[category]))

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    const firstParameter = Object.keys(categories[newCategory])[0];
    setParameter(firstParameter);
  };

  return (
    <div className="top-0 w-full lg:w-[50%] flex flex-col items-center lg:items-baseline mb-2">
      <form action={""} method="post" className="z-10 ml-3">
        <div className="flex bg-gray-500 w-fit p-1 mt-5">
          <fieldset className="text-center flex items-center">
            <legend className="block w-full text-center">
              {t("chooseCategory")}
            </legend>
            <ParameterSelector
              setParameter={handleCategoryChange}
              inputName={"parameter1"}
              parameters={Object.entries(categories).map(category => category[0])}
            />
          </fieldset>
          <fieldset className="text-center flex items-center">
            <legend className="block w-full text-center">
              {t("chooseParameter")}
            </legend>
            <ParameterSelector
              setParameter={setParameter}
              inputName={"parameter1"}
              parameters={Object.values(categories[category])}
            />
            <span >?</span>
          </fieldset>
        </div>
        <p className="bg-gray-700 text-center">{t("source")}</p>
      </form>
    </div>
  );
};

export default DataSelector;
