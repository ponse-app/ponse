import pno_stat from "@/app/pno_tilasto_2024.json";

const preProcessData = (features, parameter) => {
  if (features.length === 0) return;

  // If parameter is found from features, then nothing is needed to do
  if (features[0].properties.hasOwnProperty(parameter)) return features;

  // Try find corresponding parameter with mapping
  // TODO: mieti halutaanko tätä, vai vaaditaanko vain että kutsujalla on vastuu oikean parametrin käyttämisestä
  // Hyöty olisi ehkä se, että tässä tulee tehtyä vähän turhaa työtä, kun voitaisiin vaan käyttää suoraan oikeaa
  // parametria sen sijaan että muokataan json kutsujalle sopivaksi
  const equivalencyTable = {
    miehet: "he_miehet",
    naiset: "he_naiset",
    vakimaara: "he_vakiy",
  };

  if (features[0].properties.hasOwnProperty(equivalencyTable[parameter])) {
    return features.map((feature) => {
      return {
        ...feature,
        properties: {
          ...feature.properties,
          [parameter]: feature.properties[equivalencyTable[parameter]],
        },
      };
    });
  }

  // Calculate properties based on these options
  const calculationMap = {
    vakimaara: {
      parameters: ["miehet", "naiset"],
      operator: "+",
    },
  };

  const calc = (feature) => {
    switch (calculationMap[parameter].operator) {
      case "+":
        const sum = calculationMap[parameter].parameters.reduce((sum, cur) => {
          if (feature.properties.hasOwnProperty(cur))
            return feature.properties[cur] + sum;

          if (feature.properties.hasOwnProperty(equivalencyTable[cur]))
            return feature.properties[equivalencyTable[cur]] + sum;
        }, 0);
        return sum;
    }
  };

  if (calculationMap.hasOwnProperty(parameter)) {
    return features.map((feature) => {
      return {
        ...feature,
        properties: {
          ...feature.properties,
          [parameter]: calc(feature),
        },
      };
    });
  }

  // Municipality data needs calculated from postnumber data
  const values = {};

  pno_stat.features.forEach((feature) => {
    const municipalityId = feature.properties.kunta;

    if (!values.hasOwnProperty(municipalityId)) {
      values[municipalityId] = [feature.properties[parameter]];
    } else {
      values[municipalityId].push(feature.properties[parameter]);
    }
  });

  return features.map((feature) => {
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
  });
};

export { preProcessData };
