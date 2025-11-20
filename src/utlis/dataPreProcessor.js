import pno_stat from "@/app/pno_tilasto_2024.json";

const preProcessData = (features, parameter) => {
  if (features.length === 0) return;

  return features.map((feature) => processData(feature, parameter));
};

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
  const calculationMap = {
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
  };

  const calc = (feature) => {
    switch (calculationMap[parameter].operator) {
      case "+":
        const sum = calculationMap[parameter].parameters.reduce((sum, cur) => {
          return processData(feature, cur).properties[cur] + sum;
        }, 0);
        return sum;

      case "/":
        const [firstCalculatedParameter, secondCalculatedParameter] =
          calculationMap[parameter].parameters;

        // TODO: ei haluta aina kertoa sadalla, vaan ainoastaan jakaa.
        // Pitää siis luoda erillinen kertolaskuoperaatio
        return (
          (processData(feature, firstCalculatedParameter).properties[
            firstCalculatedParameter
          ] /
            processData(feature, secondCalculatedParameter).properties[
              secondCalculatedParameter
            ]) *
          100
        );
    }
  };
  
  const round = (num) => {
      return Math.round((num + Number.EPSILON) * 10) / 10;
  }

  if (calculationMap.hasOwnProperty(parameter)) {
    return {
      ...feature,
      properties: {
        ...feature.properties,
        [parameter]: round(calc(feature)),
      },
    };
  }

  // Municipality data needs calculated from postnumber data
  const values = {};

  pno_stat.features
    .filter((pno) => pno.properties.kunta === feature.properties.kunta)
    .forEach((feature) => {
      const municipalityId = feature.properties.kunta;

      if (!values.hasOwnProperty(municipalityId)) {
        values[municipalityId] = [feature.properties[parameter]];
      } else {
        values[municipalityId].push(feature.properties[parameter]);
      }
    });

  return {
    ...feature,
    properties: {
      ...feature.properties,
      [parameter]: values[feature.properties.kunta].reduce(
        (sum, current) => sum + current,
        0
      ),
    },
  };
};

export { preProcessData };
