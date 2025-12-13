"use client";

import { memo } from "react";

import React from "react";
import { useTranslation } from "react-i18next";

const PreviewStatTable = ({
  chosePostnumbers,
  parameter,
  preProcessedData,
}) => {
  const [t, i18n] = useTranslation();

  const fixMinusOne = (value) => {
    if (value === -1) return t("statTable.noData");
    return value;
  };

  const chosePostnumberFeatures = [...chosePostnumbers].map((postnumber) =>
    preProcessedData.features.find(
        (postnumberFeature) => postnumberFeature.properties.postinumeroalue === postnumber)
  );

  return (
    chosePostnumberFeatures.length !== 0 && (
      <div className="max-h-1/2 lg:max-h-[40vh] overflow-y-auto max-w-[100%] flex justify-center">
        <table className="m-2.5">
          <thead>
            <tr>
              <th>{t("statTable.postalCodeArea")}</th>
              <th>{t("statTable.value")}</th>
            </tr>
          </thead>
          <tbody>
            {chosePostnumberFeatures.map((feature) => (
              <tr key={feature.properties["postinumeroalue"]}>
                <td className="p-3 border-2 border-blue-400 border-collapse text-wrap">
                  {feature.properties["nimi"]}
                  <br/>
                  {feature.properties["postinumeroalue"]}
                </td>
                <td className="p-3 border-2 border-blue-400 border-collapse">
                  {fixMinusOne(feature.properties[parameter])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
};

export default memo(PreviewStatTable);
