import { useState, Suspense } from 'react';

import { SearchBar } from '@components/ui/search-bar';
import { LocationList } from '@components/ui/location-list';
import { WeatherCard } from '@components/ui/weather-card';
import { FavoritesBar } from '@components/ui/favorites-bar';
import { HistoryList } from '@components/ui/history-list';
import { ShareButton } from '@components/ui/share-button';
import { Tabs } from '@components/ui/tabs';
import { MapView } from '@components/ui/map-view';
import { useWeather } from '@hooks/use-weather.hook';

import { HourlyTempChartLazy, DailyRangeChartLazy } from './home.lazy';

import styles from './home.module.css';

type TabKey = 'today' | 'hourly' | 'daily' | 'map';

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
    pickCoordinates,
    addFavorite,
    removeFavorite,
    requestMyLocation,
  } = useWeather();

  const [tab, setTab] = useState<TabKey>('today');
  const [showRadar, setShowRadar] = useState(false);
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
          {tab === 'today' && (
            <section>
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
            </section>
          )}

          {tab === 'hourly' && (
            <section>
              <Suspense fallback={<p>Загружаю график…</p>}>
                <HourlyTempChartLazy data={weather.hourly} />
              </Suspense>
            </section>
          )}

          {tab === 'daily' && (
            <section>
              <Suspense fallback={<p>Загружаю график…</p>}>
                <DailyRangeChartLazy data={weather.daily} />
              </Suspense>
            </section>
          )}

          {tab === 'map' && (
            <section style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <label>
                  <input type="checkbox" checked={showRadar} onChange={(e) => setShowRadar(e.target.checked)} />{' '}
                  Показать радар осадков (RainViewer)
                </label>
              </div>
              <MapView
                center={{ lat: selectedLocation.latitude, lon: selectedLocation.longitude }}
                marker={{ lat: selectedLocation.latitude, lon: selectedLocation.longitude }}
                showRadar={showRadar}
                onPickCoords={(lat, lon) => pickCoordinates(lat, lon)}
                zoom={9}
              />
            </section>
          )}
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
