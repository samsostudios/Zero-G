export const formatFlightLink = (text: string) => {
  const stateAbbreviations: { [key: string]: string } = {
    AL: 'alabama',
    AK: 'alaska',
    AZ: 'arizona',
    AR: 'arkansas',
    CA: 'california',
    CO: 'colorado',
    CT: 'connecticut',
    DE: 'delaware',
    FL: 'florida',
    GA: 'georgia',
    HI: 'hawaii',
    ID: 'idaho',
    IL: 'illinois',
    IN: 'indiana',
    IA: 'iowa',
    KS: 'kansas',
    KY: 'kentucky',
    LA: 'louisiana',
    ME: 'maine',
    MD: 'maryland',
    MA: 'massachusetts',
    MI: 'michigan',
    MN: 'minnesota',
    MS: 'mississippi',
    MO: 'missouri',
    MT: 'montana',
    NE: 'nebraska',
    NV: 'nevada',
    NH: 'new-hampshire',
    NJ: 'new-jersey',
    NM: 'new-mexico',
    NY: 'new-york',
    NC: 'north-carolina',
    ND: 'north-dakota',
    OH: 'ohio',
    OK: 'oklahoma',
    OR: 'oregon',
    PA: 'pennsylvania',
    RI: 'rhode-island',
    SC: 'south-carolina',
    SD: 'south-dakota',
    TN: 'tennessee',
    TX: 'texas',
    UT: 'utah',
    VT: 'vermont',
    VA: 'virginia',
    WA: 'washington',
    WV: 'west-virginia',
    WI: 'wisconsin',
    WY: 'wyoming',
  };

  const [city, stateAbbr] = text.split(', ');
  const formattedCity = city.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
  const formattedState =
    stateAbbr && stateAbbreviations[stateAbbr.toUpperCase()]
      ? stateAbbreviations[stateAbbr.toUpperCase()]
      : stateAbbr.toLowerCase();

  // console.log('!!!!', formattedCity, formattedState);

  return `/flight-locations/${formattedCity}-${formattedState}`;
};
