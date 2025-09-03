import { fetchJson } from '@utils/fetch-json.util';

import type { WeatherBundle, CurrentWeather, HourlyWeatherPoint, DailyWeatherPoint } from '../../types/weather.type';

type ApiResponse = {
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    precipitation: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
};

const buildUrl = (lat: number, lon: number) => {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: ['temperature_2m', 'wind_speed_10m', 'wind_direction_10m', 'weather_code'].join(','),
    hourly: ['temperature_2m', 'apparent_temperature', 'precipitation'].join(','),
    daily: ['temperature_2m_max', 'temperature_2m_min', 'precipitation_sum'].join(','),
    timezone: 'auto',
  });
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
};

const mapCurrent = (r: ApiResponse): CurrentWeather => ({
  temperature: r.current.temperature_2m,
  windSpeed: r.current.wind_speed_10m,
  windDirection: r.current.wind_direction_10m,
  weatherCode: r.current.weather_code,
  time: r.current.time,
});

const mapHourly = (r: ApiResponse): HourlyWeatherPoint[] => {
  const { time, temperature_2m, apparent_temperature, precipitation } = r.hourly;
  const len = Math.min(time.length, temperature_2m.length, apparent_temperature.length, precipitation.length);

  return Array.from({ length: len }).flatMap((_, i) => {
    const t = time[i];
    const t2 = temperature_2m[i];
    const feels = apparent_temperature[i];
    const pr = precipitation[i];

    if (t == null || t2 == null || feels == null || pr == null) {
      return [];
    }

    return [
      {
        time: t,
        temperature2m: t2,
        apparentTemperature: feels,
        precipitation: pr,
      },
    ];
  });
};

const mapDaily = (r: ApiResponse): DailyWeatherPoint[] => {
  const { time, temperature_2m_max, temperature_2m_min, precipitation_sum } = r.daily;
  const len = Math.min(time.length, temperature_2m_max.length, temperature_2m_min.length, precipitation_sum.length);

  return Array.from({ length: len }).flatMap((_, i) => {
    const d = time[i];
    const max = temperature_2m_max[i];
    const min = temperature_2m_min[i];
    const psum = precipitation_sum[i];

    if (d == null || max == null || min == null || psum == null) {
      return [];
    }

    return [
      {
        date: d,
        tempMax: max,
        tempMin: min,
        precipitationSum: psum,
      },
    ];
  });
};

export const fetchWeather = async (latitude: number, longitude: number): Promise<WeatherBundle> => {
  const data = await fetchJson<ApiResponse>(buildUrl(latitude, longitude));
  return {
    current: mapCurrent(data),
    hourly: mapHourly(data),
    daily: mapDaily(data),
    timezone: data.timezone,
  };
};
