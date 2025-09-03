import { SearchBar } from '@components/search-bar';

import styles from './home.module.css';

const title = 'Погода по вашему запросу';

const renderIntro = () => (
  <section className={styles.card} aria-label="Инструкция">
    <h2>{title}</h2>
    <p>Введите город или координаты, затем получите текущую, почасовую и недельную погоду с графиками.</p>
  </section>
);

export const HomePage = () => {
  return (
    <section className={styles.grid}>
      <section aria-label="Поиск">
        <SearchBar />
      </section>
      {renderIntro()}
    </section>
  );
};
