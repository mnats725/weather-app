import styles from './location-list.module.css';

import type { GeoLocation } from '../../../types/location.type';

type LocationListProps = {
  items: GeoLocation[];
  onPick: (loc: GeoLocation) => void;
};

const toTitle = (x: GeoLocation) => [x.name, x.admin1, x.country].filter(Boolean).join(', ');

export const LocationList = ({ items, onPick }: LocationListProps) => {
  return (
    <section aria-label="Варианты местоположения">
      <h3>Выберите местоположение</h3>
      <div className={styles.list}>
        {items.map((x) => (
          <article key={`${x.name}-${x.latitude}-${x.longitude}`} className={styles.item}>
            <div>
              <div className={styles.title}>{toTitle(x)}</div>
              <div className={styles.meta}>
                {x.latitude}, {x.longitude}
              </div>
            </div>
            <button type="button" onClick={() => onPick(x)}>
              Выбрать
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};
