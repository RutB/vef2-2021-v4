export async function fetchEarthquakes(type, period) {
  let result;
  const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${period}_${type}.geojson`;
  try {
    //result = await fetch(`/proxy?period=${period}&type=${type}`);
    result = await fetch(URL);
  } catch (e) {
    console.error('Villa við að sækja', e);
    return null;
  }

  if (!result.ok) {
    console.error('Ekki 200 svar', await result.text());
    return null;
  }

  const data = await result.json();

  return data;
}
