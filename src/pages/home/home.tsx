import { useState } from 'react';

import { SearchBar } from '@components/search-bar';
import { LocationList } from '@components/location-list';
import { WeatherCard } from '@components/weather-card';
import { HourlyTempChart } from '@components/hourly-temp-chart';
import { DailyRangeChart } from '@components/daily-range-chart';
import { FavoritesBar } from '@components/favorites-bar';
import { HistoryList } from '@components/history-list';
import { ShareButton } from '@components/share-button';
import { Tabs } from '@components/tabs';
import { useWeather } from '@hooks/use-weather.hook';

import styles from './home.module.css';

type TabKey = 'today' | 'hourly' | 'daily';

export const HomePage = () => {
  const {
    loading,
    error,
    selectedLocation,
    locationCandidates,
    weather,
    history,
    favorites,
    search,
    pickLocation,
    addFavorite,
    removeFavorite,
    requestMyLocation,
  } = useWeather();

  const [tab, setTab] = useState<TabKey>('today');
  const title = 'Погода по вашему запросу';

  const handleSearch = (q: string) => {
    search({ query: q });
  };

  const pickFromHistory = (lat: number, lon: number, name: string) => {
    pickLocation({ name, latitude: lat, longitude: lon });
  };

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

  const renderTabs = () => {
    if (!selectedLocation || !weather) return null;

    const city = [selectedLocation.name, selectedLocation.admin1, selectedLocation.country].filter(Boolean).join(', ');
    const t = Math.round(weather.current.temperature);
    const wind = Math.round(weather.current.windSpeed);

    return (
      <section className={styles.card}>
        <Tabs value={tab} onChange={setTab}>
          <div style={{ display: tab === 'today' ? 'block' : 'none' }}>
            <WeatherCard location={selectedLocation} data={weather} />
            <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button type="button" onClick={() => addFavorite(selectedLocation)}>
                  ★ В избранное
                </button>
                <ShareButton city={city} t={t} wind={wind} tz={weather.timezone} />
                <button type="button" onClick={requestMyLocation} disabled={loading}>
                  📍 Моя геолокация
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: tab === 'hourly' ? 'block' : 'none' }}>
            <HourlyTempChart data={weather.hourly} />
          </div>

          <div style={{ display: tab === 'daily' ? 'block' : 'none' }}>
            <DailyRangeChart data={weather.daily} />
          </div>
        </Tabs>
      </section>
    );
  };

  const renderIntro = () => (
    <section className={styles.card} aria-label="Инструкция">
      <h2>{title}</h2>
      <p>Введите город или координаты, либо воспользуйтесь определением местоположения.</p>
      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={requestMyLocation} disabled={loading}>
          📍 Определить автоматически
        </button>
      </div>
    </section>
  );

  return (
    <section className={styles.grid}>
      <section aria-label="Поиск">
        <SearchBar onSearch={handleSearch} loading={loading} />
      </section>

      {renderError()}

      <section className={styles.card} aria-label="Быстрый доступ">
        <FavoritesBar items={favorites} onSelect={pickLocation} onRemove={removeFavorite} />
        <HistoryList items={history} onPick={pickFromHistory} />
      </section>

      {renderCandidates()}
      {renderTabs() || renderIntro()}
    </section>
  );
};
