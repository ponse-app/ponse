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
  if (feature.properties.hasOwnProperty(parameter)) return feature;

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
        [parameter]: feature.properties[equivalencyTable[parameter]],
      },
    };
  }

  // Calculate properties based on these options
  const definitionMap = {
    vakimaara: {
      parameters: ["miehet", "naiset"],
      operator: "+",
    },
    ika_13_17: {
      parameters: ["he_13_15", "he_16_17"],
      operator: "+",
    },
    ika_18_24: {
      parameters: ["he_18_19", "he_20_24"],
      operator: "+",
    },
    ika_13_24: {
      parameters: ["ika_13_17", "ika_18_24"],
      operator: "+",
    },
    ika_13_17_p: {
      parameters: ["ika_13_17", "vaesto"],
      operator: "/",
    },
    ika_65: {
      parameters: ["he_65_69", "he_70_74", "he_75_79", "he_80_84", "he_85_"],
      operator: "+",
    },
    
    ika_65_p: {
      parameters: ["ika_65", "vaesto"],
      operator: "/",
    },
  };

  const calc = (feature) => {
    switch (definitionMap[parameter].operator) {
      case "+":
        const sum = definitionMap[parameter].parameters.reduce((sum, cur) => {
          return fixMinusOne(processData(feature, cur).properties[cur] + sum);
        }, 0);
        return sum;

      case "/":
        const [firstCalculatedParameter, secondCalculatedParameter] =
        definitionMap[parameter].parameters;
        
        const divider = fixMinusOne(processData(feature, secondCalculatedParameter).properties[secondCalculatedParameter]);

        // TODO: ei haluta aina kertoa sadalla, vaan ainoastaan jakaa.
        // Pitää siis luoda erillinen kertolaskuoperaatio
        if (divider === 0) {
          return 0;
        }
        return (
          (fixMinusOne(processData(feature, firstCalculatedParameter).properties[firstCalculatedParameter])
          / divider) * 100
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
    tr_mtu: {
      function: calcMedian,
    },
    hr_mtu: {
      function: calcMedian,
    },
    tr_ktu: {
      function: calcAverage,
    },
    hr_ktu: {
      function: calcAverage,
    }
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
