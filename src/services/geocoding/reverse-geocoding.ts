import { fetchJson } from '@utils/fetch-json.util';

import type { GeoLocation } from '../../types/location.type';

type ReverseItem = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
};
type ReverseResponse = { results?: ReverseItem[] };

const buildUrl = (lat: number, lon: number) =>
  `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=ru&format=json`;

export const reverseGeocode = async (lat: number, lon: number): Promise<GeoLocation> => {
  const data = await fetchJson<ReverseResponse>(buildUrl(lat, lon));
  const first = data.results?.at(0);

  if (!first) {
    return { name: `${lat.toFixed(3)}, ${lon.toFixed(3)}`, latitude: lat, longitude: lon };
  }

  return {
    name: first.name,
    latitude: first.latitude,
    longitude: first.longitude,
    country: first.country,
    admin1: first.admin1,
  };
};
