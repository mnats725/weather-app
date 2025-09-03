import type { WeatherBundle } from '../../types/weather.type';
import type { GeoLocation } from '../../types/location.type';

import styles from './weather-card.module.css';

type WeatherCardProps = {
  location: GeoLocation;
  data: WeatherBundle;
};

export const WeatherCard = ({ location, data }: WeatherCardProps) => {
  const city = [location.name, location.admin1, location.country].filter(Boolean).join(', ');
  const t = Math.round(data.current.temperature);

  return (
    <article className={styles.card} aria-label="Текущая погода">
      <header className={styles.header}>
        <h3 className={styles.title}>{city}</h3>
        <span className={styles.meta}>{data.timezone}</span>
      </header>

      <p>
        Сейчас: <strong>{t}°C</strong>
      </p>

      <div className={styles.row} aria-label="Показатели">
        <span className={styles.kv}>Ветер: {Math.round(data.current.windSpeed)} м/с</span>
        <span className={styles.kv}>Направление: {data.current.windDirection}°</span>
      </div>
    </article>
  );
};
