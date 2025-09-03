import styles from './tabs.module.css';

import type { ReactNode } from 'react';

type TabKey = 'today' | 'hourly' | 'daily';

type TabsProps = {
  value: TabKey;
  onChange: (key: TabKey) => void;
  children?: ReactNode;
};

export const Tabs = ({ value, onChange, children }: TabsProps) => {
  const change = (key: TabKey) => onChange(key);

  return (
    <section className={styles.tabs} aria-label="Разделы прогноза">
      <div role="tablist" className={styles.list} aria-label="Выбор раздела">
        <button className={styles.btn} role="tab" aria-selected={value === 'today'} onClick={() => change('today')}>
          Сегодня
        </button>
        <button className={styles.btn} role="tab" aria-selected={value === 'hourly'} onClick={() => change('hourly')}>
          Почасовой
        </button>
        <button className={styles.btn} role="tab" aria-selected={value === 'daily'} onClick={() => change('daily')}>
          7 дней
        </button>
      </div>
      {children}
    </section>
  );
};
