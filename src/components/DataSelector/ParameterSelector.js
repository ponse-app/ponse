"use client";

import i18next from "../../i18n/config"
import { useTranslation } from "react-i18next";

const ParameterSelector = ({ inputName, setParameter }) => {

    // i18n
    const [t, i18n] = useTranslation();

    return (
        <div className="bg-gray-500 w-fit m-5">
            <select
                onChange={(event) => setParameter(event.target.value)}
                className="bg-gray-700"
                id="input1"
            >
                <option value="miehet">{t('parameter.miehet')}</option>
                <option value="naiset">{t('parameter.naiset')}</option>
                <option value="ika_65_p">{t('parameter.ika_65_p')}</option>
                <option value="ika_13_17">{t('parameter.ika_13_17')}</option>
                <option value="ika_13_17_p">{t('parameter.ika_13_17_p')}</option>
                <option value="ika_18_24">{t('parameter.ika_18_24')}</option>
                <option value="ika_13_24">{t('parameter.ika_13_24')}</option>
                <option value="vaesto">{t('parameter.vaesto')}</option>
                <option value="ra_ke">{t('parameter.ra_ke')} *</option>
                <option value="pt_opisk">{t('parameter.pt_opisk')} *</option>
                <option value="hr_mtu">{t('parameter.hr_mtu')}</option>
            </select>
        </div>
    );
};

export default ParameterSelector;
