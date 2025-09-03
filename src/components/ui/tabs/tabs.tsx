import styles from './tabs.module.css';

import type { ReactNode } from 'react';

type TabKey = 'today' | 'hourly' | 'daily' | 'map';

type TabsProps = {
  value: TabKey;
  onChange: (key: TabKey) => void;
  children?: ReactNode;
};

export const Tabs = ({ value, onChange, children }: TabsProps) => {
  const select = (key: TabKey) => onChange(key);

  return (
    <section className={styles.tabs} aria-label="Разделы прогноза">
      <div role="tablist" className={styles.list} aria-label="Выбор раздела">
        <button className={styles.btn} role="tab" aria-selected={value === 'today'} onClick={() => select('today')}>
          Сегодня
        </button>
        <button className={styles.btn} role="tab" aria-selected={value === 'hourly'} onClick={() => select('hourly')}>
          Почасовой
        </button>
        <button className={styles.btn} role="tab" aria-selected={value === 'daily'} onClick={() => select('daily')}>
          7 дней
        </button>
        <button className={styles.btn} role="tab" aria-selected={value === 'map'} onClick={() => select('map')}>
          Карта
        </button>
      </div>
      {children}
    </section>
  );
};
