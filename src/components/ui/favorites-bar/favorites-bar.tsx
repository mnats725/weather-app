import styles from './favorites-bar.module.css';

import type { FavoriteLocation } from '@hooks/use-weather.hook';

type FavoritesBarProps = {
  items: FavoriteLocation[];
  onSelect: (loc: FavoriteLocation) => void;
  onRemove: (loc: FavoriteLocation) => void;
};

const label = (x: FavoriteLocation) => [x.name, x.admin1, x.country].filter(Boolean).join(', ') || x.name;

export const FavoritesBar = ({ items, onSelect, onRemove }: FavoritesBarProps) => {
  if (items.length === 0) return null;

  return (
    <nav className={styles.bar} aria-label="Избранные города">
      {items.map((f) => (
        <span className={styles.chip} key={`${f.name}-${f.latitude}-${f.longitude}`}>
          <button type="button" onClick={() => onSelect(f)} aria-label={`Открыть ${label(f)}`}>
            {label(f)}
          </button>
          <button type="button" onClick={() => onRemove(f)} aria-label={`Удалить ${label(f)}`}>
            ✕
          </button>
        </span>
      ))}
    </nav>
  );
};
