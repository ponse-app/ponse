import pno_stat from "@/app/pno_tilasto.json";

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
