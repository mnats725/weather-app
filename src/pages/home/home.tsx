import { SearchBar } from '@components/search-bar';
import { LocationList } from '@components/location-list';
import { WeatherCard } from '@components/weather-card';
import { HourlyTempChart } from '@components/hourly-temp-chart';
import { DailyRangeChart } from '@components/daily-range-chart';
import { useWeather } from '@hooks/use-weather.hook';

import styles from './home.module.css';

export const HomePage = () => {
  const { loading, error, selectedLocation, locationCandidates, weather, search, pickLocation } = useWeather();

  const title = 'Погода по вашему запросу';

  const handleSearch = (q: string) => {
    search({ query: q });
  };

  const renderIntro = () => (
    <section className={styles.card} aria-label="Инструкция">
      <h2>{title}</h2>
      <p>Введите город или координаты, затем получите текущую, почасовую и недельную погоду с графиками.</p>
    </section>
  );

  const renderError = () => {
    if (!error) return null;
    return (
      <section className={styles.card} role="alert">
        <strong>Ошибка:</strong> {error}
      </section>
    );
  };

  const renderCandidates = () => {
    if (locationCandidates.length === 0) return null;
    return (
      <section className={styles.card}>
        <LocationList items={locationCandidates} onPick={pickLocation} />
      </section>
    );
  };

  const renderWeather = () => {
    if (!selectedLocation || !weather) return null;
    return (
      <>
        <section className={styles.card}>
          <WeatherCard location={selectedLocation} data={weather} />
        </section>
        <section className={styles.card}>
          <HourlyTempChart data={weather.hourly} />
        </section>
        <section className={styles.card}>
          <DailyRangeChart data={weather.daily} />
        </section>
      </>
    );
  };

  return (
    <section className={styles.grid}>
      <section aria-label="Поиск">
        <SearchBar onSearch={handleSearch} loading={loading} />
      </section>

      {renderError()}
      {renderCandidates()}
      {renderWeather() || renderIntro()}
    </section>
  );
};
