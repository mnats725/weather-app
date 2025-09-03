import styles from './history-list.module.css';

import type { HistoryEntry } from '@hooks/use-weather.hook';

type HistoryListProps = {
  items: HistoryEntry[];
  onPick: (lat: number, lon: number, name: string) => void;
};

export const HistoryList = ({ items, onPick }: HistoryListProps) => {
  if (items.length === 0) return null;

  return (
    <section className={styles.wrap} aria-label="Недавние">
      <div className={styles.items}>
        {items.map((h) => (
          <button
            key={`${h.name}-${h.latitude}-${h.longitude}`}
            className={styles.item}
            type="button"
            onClick={() => onPick(h.latitude, h.longitude, h.name)}
            aria-label={`Выбрать ${h.name}`}
          >
            {h.name}
          </button>
        ))}
      </div>
    </section>
  );
};
