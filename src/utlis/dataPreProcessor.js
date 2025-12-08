import pno_stat from "@/app/pno_tilasto_2024.json";

const preProcessData = (features, parameter) => {
  if (features.length === 0) return;

  return features.map((feature) => processData(feature, parameter));
};


const fixMinusOne = (value) => {
  if (value === -1) return 0;
  return value;
}

const processData = (feature, parameter) => {
  // If parameter is found from features, then nothing is needed to do
  if (feature.properties.hasOwnProperty(parameter)) {
    feature.properties[parameter] = fixMinusOne(feature.properties[parameter]);

    return feature;
  }


  // Try find corresponding parameter with mapping
  const equivalencyTable = {
    miehet: "he_miehet",
    naiset: "he_naiset",
    vaesto: "he_vakiy",
  };

  if (feature.properties.hasOwnProperty(equivalencyTable[parameter])) {
    return {
      ...feature,
      properties: {
        ...feature.properties,
        [parameter]: fixMinusOne(feature.properties[equivalencyTable[parameter]]),
      },
    };
  }

  // Calculate properties based on these options
  const definitionMap = {
    pinta_ala_km2: {
      parameters: ["pinta_ala", 1000000],
      operator: "pinta-ala/",
    },

    vakimaara: {
      parameters: ["miehet", "naiset"],
      operator: "+",
    },
    ika_3_12: {
      parameters: ["he_3_6", "he_7_12"],
      operator: "+",
    },
    ika_13_19: {
      parameters: ["he_13_15", "he_16_17", "he_18_19"],
      operator: "+",
    },
    ika_20_29: {
      parameters: ["he_20_24", "he_25_29"],
      operator: "+",
    },
    ika_30_64: {
      parameters: ["he_30_34", "he_35_39", "he_40_44", "he_45_49", "he_50_54", "he_55_59", "he_60_64"],
      operator: "+",
    },
    ika_65: {
      parameters: ["he_65_69", "he_70_74", "he_75_79", "he_80_84", "he_85_"],
      operator: "+",
    },
    ika_65_p: {
      parameters: ["ika_65", "vaesto"],
      operator: "/",
    },
    ika_0_17: {
      parameters: ["he_0_2", "he_3_6", "he_7_12", "he_13_15", "he_16_17"],
      operator: "+"
    },
    ika_0_17_p: {
      parameters: ["ika_0_17", "vaesto"],
      operator: "/"
    },
    ika_25_64: {
      parameters: ["he_25_29", "he_30_34", "he_35_39", "he_40_44", "he_45_49", "he_50_54", "he_55_59", "he_60_64"],
      operator: "+",
    },
    ika_25_64_p: {
      parameters: ["ika_25_64", "vaesto"],
      operator: "/"
    },
    he_miehet_p: {
      parameters: ["miehet", "vaesto"],
      operator: "/",
    },
    he_naiset_p: {
      parameters: ["naiset", "vaesto"],
      operator: "/",
    },

    //Use paremeter "ko_ika18y" as divider (which is ready in data) beacuse the data uses only over 18 year olds.
    ko_perus_p: {
      parameters: ["ko_perus", "ko_ika18y"],
      operator: "/",
    },
    ko_tas: {
      parameters: ["ko_yliop", "ko_ammat"],
      operator: "+",
    },
    ko_tas_p: {
      parameters: ["ko_tas", "ko_ika18y"],
      operator: "/",
    },
    ko_yliop_p: {
      parameters: ["ko_yliop", "ko_ika18y"],
      operator: "/",
    },
    ko_ammat_p: {
      parameters: ["ko_ammat", "ko_ika18y"],
      operator: "/",
    },
    ko_al_kork_p: {
      parameters: ["ko_al_kork", "ko_ika18y"],
      operator: "/",
    },
    ko_yl_kork_p: {
      parameters: ["ko_yl_kork", "ko_ika18y"],
      operator: "/",
    },

    //Use paremeter "ko_ika18y" as divider (which is ready in data) beacuse the data uses only over 18 year olds.
    hr_pi_tul_p: {
      parameters: ["hr_pi_tul", "ko_ika18y"],
      operator: "/",
    },
    hr_ke_tul_p: {
      parameters: ["hr_ke_tul", "ko_ika18y"],
      operator: "/",
    },
    hr_hy_tul_p: {
      parameters: ["hr_hy_tul", "ko_ika18y"],
      operator: "/",
    },

    //Use paremeter "te_taly" as divider (which is ready in data) beacuse the data uses households.
    te_yks_p: {
      parameters: ["te_yks", "te_taly"],
      operator: "/",
    },
    te_laps_p: {
      parameters: ["te_laps", "te_taly"],
      operator: "/",
    },
    te_yhlap_p: {
      parameters: ["te_yhlap", "te_taly"],
      operator: "/",
    },
    te_omis_as_p: {
      parameters: ["te_omis_as", "te_taly"],
      operator: "/",
    },
    te_vuok_as_p: {
      parameters: ["te_vuok_as", "te_taly"],
      operator: "/",
    },

    //Use paremeter "te_taly" as divider (which is ready in data) beacuse the data uses households.
    tr_pi_tul_p: {
      parameters: ["tr_pi_tul", "te_taly"],
      operator: "/",
    },
    tr_ke_tul_p: {
      parameters: ["tr_ke_tul", "te_taly"],
      operator: "/",
    },
    tr_hy_tul_p: {
      parameters: ["tr_hy_tul", "te_taly"],
      operator: "/",
    },

    ra_asrak_p: {
      parameters: ["ra_asrak", "ra_raky"],
      operator: "/"
    },
    //Use parameter "ra_asunn" as divider (which is ready in data) so we can calcute the % only from residental buildings.
    ra_pt_as_p: {
      parameters: ["ra_pt_as", "ra_asunn"],
      operator: "/"
    },
    ra_kt_as_p: {
      parameters: ["ra_kt_as", "ra_asunn"],
      operator: "/"
    },

  };

  const calc = (feature) => {
    switch (definitionMap[parameter].operator) {
      case "+":
        const parameters = definitionMap[parameter].parameters;

        let sum = 0;
        for (let i = 0; i < parameters.length; i++) {
          const value = processData(feature, parameters[i]).properties[parameters[i]];

          // If there's even one -1, we cannot calculate the sum
          if (value === -1) return -1;

          sum += value;
        }

        return sum;

      case "/":
        const [firstCalculatedParameter, secondCalculatedParameter] =
        definitionMap[parameter].parameters;

        const dividend = processData(feature, firstCalculatedParameter).properties[firstCalculatedParameter];
        const divider = processData(feature, secondCalculatedParameter).properties[secondCalculatedParameter];

        // If there are bad values, we cannot calculate the value
        if (dividend === -1 || divider === -1
                            || divider === 0) return -1;

        // TODO: ei haluta aina kertoa sadalla, vaan ainoastaan jakaa.
        // Pitää siis luoda erillinen kertolaskuoperaatio
        if (divider === 0) {
          return 0;
        }
        return (
          (dividend / divider) * 100
        );

        case "pinta-ala/":
          const [areaParameter, divisor] =
          definitionMap[parameter].parameters;

          const areaValue = processData(feature, areaParameter).properties[areaParameter];

          // If there are bad values, we cannot calculate the value
          if (areaValue === -1 || areaValue === 0) return -1;

          return (
            areaValue / divisor
          );
    }
  };


  const round = (num) => {
    return Math.round((num + Number.EPSILON) * 10) / 10;
  };

  if (definitionMap.hasOwnProperty(parameter)) {
    return {
      ...feature,
      properties: {
        ...feature.properties,
        [parameter]: round(calc(feature)),
      },
    };
  }


  const calcMedian = (values) => {
    if (values.length === 0) return 0;

    values = [...values].sort((a, b) => a - b);

    const half = Math.floor(values.length / 2);

    return values.length % 2
      ? values[half]
      : (values[half - 1] + values[half]) / 2;
  };

  const calcAverage = (values) => {
    if (values.length === 0) return 0;

    const sum = [...values].reduce((partialSum, a) => partialSum + a, 0);

    return sum / values.length;
  };

  // Municipality data needs calculated from postnumber data
  const calculationMap = {
    he_kika: {
      function: calcAverage,
    },

    tr_mtu: {
      function: calcMedian,
    },
    hr_mtu: {
      function: calcMedian,
    },

    te_takk: {
      function: calcAverage,
    },
    te_as_valj: {
      function: calcAverage,
    },

    tr_ktu: {
      function: calcAverage,
    },
    hr_ktu: {
      function: calcAverage,
    },

    ra_as_kpa: {
      function: calcAverage,
    },
  };

  const postnumberValues = pno_stat.features
    .filter((pno) => pno.properties.kunta === feature.properties.kunta)
    .map((feature) => feature.properties[parameter]);

  if (calculationMap[parameter]) {
    return {
      ...feature,
      properties: {
        ...feature.properties,
        [parameter]: round(calculationMap[parameter].function(
          postnumberValues.filter(value => value != 0 && value != -1)
        )),
      },
    };
  }

  return {
    ...feature,
    properties: {
      ...feature.properties,
      [parameter]: postnumberValues.reduce(
        (sum, current) => sum + fixMinusOne(current),
        0
      ),
    },
  };
};

export { preProcessData };
