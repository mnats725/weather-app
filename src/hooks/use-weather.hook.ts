import { useCallback, useMemo, useState } from 'react';

import { geocodeByName } from '@services/geocoding';
import { fetchWeather } from '@services/weather';
import { parseQuery } from '@utils/parse-query.util';

import type { GeoLocation } from '../types/location.type';
import type { WeatherBundle } from '../types/weather.type';

type UseWeatherState = {
  loading: boolean;
  error?: string;
  selectedLocation?: GeoLocation;
  locationCandidates: GeoLocation[];
  weather?: WeatherBundle;
};

type SearchParams = { query: string };

export const useWeather = () => {
  const [state, setState] = useState<UseWeatherState>({
    loading: false,
    locationCandidates: [],
  });

  const search = useCallback(async ({ query }: SearchParams) => {
    const parsedQuery = parseQuery(query);

    setState((prev) => ({ ...prev, loading: true, error: undefined }));

    if (parsedQuery.isCoords) {
      const coordsLocation: GeoLocation = {
        name: parsedQuery.name,
        latitude: parsedQuery.latitude,
        longitude: parsedQuery.longitude,
      };

      try {
        const weatherData = await fetchWeather(parsedQuery.latitude, parsedQuery.longitude);
        setState({ loading: false, selectedLocation: coordsLocation, locationCandidates: [], weather: weatherData });
        return;
      } catch (err) {
        setState({ loading: false, locationCandidates: [], error: (err as Error).message });
        return;
      }
    }

    try {
      const locations = await geocodeByName(parsedQuery.name);

      if (locations.length === 0) {
        setState({ loading: false, locationCandidates: [], error: 'Ничего не найдено' });
        return;
      }

      if (locations.length === 1) {
        const onlyMatch = locations.at(0);
        if (!onlyMatch) {
          setState({ loading: false, locationCandidates: [], error: 'Ошибка: пустой результат' });
          return;
        }

        const weatherData = await fetchWeather(onlyMatch.latitude, onlyMatch.longitude);
        setState({
          loading: false,
          selectedLocation: onlyMatch,
          locationCandidates: [],
          weather: weatherData,
        });
        return;
      }

      setState({ loading: false, locationCandidates: locations });
    } catch (err) {
      setState({ loading: false, locationCandidates: [], error: (err as Error).message });
    }
  }, []);

  const pickLocation = useCallback(async (location: GeoLocation) => {
    setState((prev) => ({ ...prev, loading: true, error: undefined }));
    try {
      const weatherData = await fetchWeather(location.latitude, location.longitude);
      setState({ loading: false, selectedLocation: location, locationCandidates: [], weather: weatherData });
    } catch (err) {
      setState({ loading: false, locationCandidates: [], error: (err as Error).message });
    }
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      search,
      pickLocation,
    }),
    [state, search, pickLocation]
  );

  return value;
};
