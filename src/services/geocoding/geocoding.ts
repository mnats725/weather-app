import { fetchJson } from '@utils/fetch-json.util';

import type { GeoLocation } from '../../types/location.type';

type GeocodingApiItem = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
};
type GeocodingApiResponse = { results?: GeocodingApiItem[] };

const buildUrl = (name: string) =>
  `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=5&language=ru&format=json`;

export const geocodeByName = async (name: string): Promise<GeoLocation[]> => {
  const data = await fetchJson<GeocodingApiResponse>(buildUrl(name));
  const items = data.results ?? [];
  return items.map((x) => ({
    name: x.name,
    latitude: x.latitude,
    longitude: x.longitude,
    country: x.country,
    admin1: x.admin1,
  }));
};
