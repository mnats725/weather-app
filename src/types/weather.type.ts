export type CurrentWeather = {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  time: string;
};

export type HourlyWeatherPoint = {
  time: string;
  temperature2m: number;
  apparentTemperature: number;
  precipitation: number;
};

export type DailyWeatherPoint = {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
};

export type WeatherBundle = {
  current: CurrentWeather;
  hourly: HourlyWeatherPoint[];
  daily: DailyWeatherPoint[];
  timezone: string;
};
