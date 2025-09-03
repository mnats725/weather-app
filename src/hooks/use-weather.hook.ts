import { useCallback, useEffect, useMemo, useState } from 'react';

import { geocodeByName, reverseGeocode } from '@services/geocoding';
import { fetchWeather } from '@services/weather';
import { parseQuery } from '@utils/parse-query.util';
import { readJson, writeJson } from '@utils/storage.util';
import { HISTORY_LIMIT, LS_KEY_FAVORITES, LS_KEY_HISTORY } from '@constants/storage-keys.const';

import type { GeoLocation } from '../types/location.type';
import type { WeatherBundle } from '../types/weather.type';

export type FavoriteLocation = GeoLocation;
export type HistoryEntry = { name: string; latitude: number; longitude: number };

type UseWeatherState = {
  loading: boolean;
  error?: string;
  selectedLocation?: GeoLocation;
  locationCandidates: GeoLocation[];
  weather?: WeatherBundle;
  history: HistoryEntry[];
  favorites: FavoriteLocation[];
};

type SearchParams = { query: string };

const uniqKey = (x: { latitude: number; longitude: number }) => `${x.latitude.toFixed(3)}_${x.longitude.toFixed(3)}`;

export const useWeather = () => {
  const [state, setState] = useState<UseWeatherState>({
    loading: false,
    locationCandidates: [],
    history: readJson<HistoryEntry[]>(LS_KEY_HISTORY, []),
    favorites: readJson<FavoriteLocation[]>(LS_KEY_FAVORITES, []),
  });

  const persistHistory = useCallback((items: HistoryEntry[]) => {
    writeJson(LS_KEY_HISTORY, items.slice(0, HISTORY_LIMIT));
  }, []);

  const persistFavorites = useCallback((items: FavoriteLocation[]) => {
    writeJson(LS_KEY_FAVORITES, items);
  }, []);

  const pushToHistory = useCallback(
    (loc: GeoLocation) => {
      const entry: HistoryEntry = { name: loc.name, latitude: loc.latitude, longitude: loc.longitude };
      setState((prev) => {
        const map = new Map(prev.history.map((h) => [uniqKey(h), h]));
        map.delete(uniqKey(entry));
        map.set(uniqKey(entry), entry);
        const next = Array.from(map.values()).reverse().slice(0, HISTORY_LIMIT);
        persistHistory(next);
        return { ...prev, history: next };
      });
    },
    [persistHistory]
  );

  const search = useCallback(
    async ({ query }: SearchParams) => {
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
          setState((prev) => ({
            ...prev,
            loading: false,
            selectedLocation: coordsLocation,
            locationCandidates: [],
            weather: weatherData,
          }));
          pushToHistory(coordsLocation);
          return;
        } catch (err) {
          setState((prev) => ({ ...prev, loading: false, locationCandidates: [], error: (err as Error).message }));
          return;
        }
      }

      try {
        const locations = await geocodeByName(parsedQuery.name);
        if (locations.length === 0) {
          setState((prev) => ({ ...prev, loading: false, locationCandidates: [], error: 'Ничего не найдено' }));
          return;
        }

        if (locations.length === 1) {
          const onlyMatch = locations.at(0);
          if (!onlyMatch) {
            setState((prev) => ({ ...prev, loading: false, error: 'Ошибка: пустой результат' }));
            return;
          }
          const weatherData = await fetchWeather(onlyMatch.latitude, onlyMatch.longitude);
          setState((prev) => ({
            ...prev,
            loading: false,
            selectedLocation: onlyMatch,
            locationCandidates: [],
            weather: weatherData,
          }));
          pushToHistory(onlyMatch);
          return;
        }

        setState((prev) => ({ ...prev, loading: false, locationCandidates: locations }));
      } catch (err) {
        setState((prev) => ({ ...prev, loading: false, locationCandidates: [], error: (err as Error).message }));
      }
    },
    [pushToHistory]
  );

  const pickLocation = useCallback(
    async (location: GeoLocation) => {
      setState((prev) => ({ ...prev, loading: true, error: undefined }));
      try {
        const weatherData = await fetchWeather(location.latitude, location.longitude);
        setState((prev) => ({
          ...prev,
          loading: false,
          selectedLocation: location,
          locationCandidates: [],
          weather: weatherData,
        }));
        pushToHistory(location);
      } catch (err) {
        setState((prev) => ({ ...prev, loading: false, locationCandidates: [], error: (err as Error).message }));
      }
    },
    [pushToHistory]
  );

  const pickCoordinates = useCallback(
    async (latitude: number, longitude: number) => {
      setState((prev) => ({ ...prev, loading: true, error: undefined }));
      try {
        const loc = await reverseGeocode(latitude, longitude);
        const data = await fetchWeather(latitude, longitude);
        setState((prev) => ({
          ...prev,
          loading: false,
          selectedLocation: loc,
          locationCandidates: [],
          weather: data,
        }));
        pushToHistory(loc);
      } catch (err) {
        setState((prev) => ({ ...prev, loading: false, error: (err as Error).message }));
      }
    },
    [pushToHistory]
  );

  const addFavorite = useCallback(
    (loc: GeoLocation) => {
      const key = uniqKey(loc);
      const exists = state.favorites.some((f) => uniqKey(f) === key);
      if (exists) return;
      const next = [...state.favorites, loc];
      setState((prev) => ({ ...prev, favorites: next }));
      persistFavorites(next);
    },
    [state.favorites, persistFavorites]
  );

  const removeFavorite = useCallback(
    (loc: GeoLocation) => {
      const key = uniqKey(loc);
      const next = state.favorites.filter((f) => uniqKey(f) !== key);
      setState((prev) => ({ ...prev, favorites: next }));
      persistFavorites(next);
    },
    [state.favorites, persistFavorites]
  );

  const requestMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({ ...prev, error: 'Геолокация недоступна в браузере' }));
      return;
    }
    setState((prev) => ({ ...prev, loading: true, error: undefined }));
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const weatherData = await fetchWeather(lat, lon);
          const loc: GeoLocation = { name: `${lat.toFixed(3)}, ${lon.toFixed(3)}`, latitude: lat, longitude: lon };
          setState((prev) => ({
            ...prev,
            loading: false,
            selectedLocation: loc,
            locationCandidates: [],
            weather: weatherData,
          }));
          pushToHistory(loc);
        } catch (err) {
          setState((prev) => ({ ...prev, loading: false, error: (err as Error).message }));
        }
      },
      (err) => {
        setState((prev) => ({ ...prev, loading: false, error: err.message }));
      },
      { enableHighAccuracy: true, maximumAge: 60_000, timeout: 12_000 }
    );
  }, [pushToHistory]);

  useEffect(() => {
    if (state.selectedLocation || state.weather) return;
    requestMyLocation();
  }, [requestMyLocation, state.selectedLocation, state.weather]);

  const value = useMemo(
    () => ({
      ...state,
      search,
      pickLocation,
      pickCoordinates,
      addFavorite,
      removeFavorite,
      requestMyLocation,
    }),
    [state, search, pickLocation, pickCoordinates, addFavorite, removeFavorite, requestMyLocation]
  );

  return value;
};
