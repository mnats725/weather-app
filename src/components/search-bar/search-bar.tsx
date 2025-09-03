import React, { useState } from 'react';

import styles from './search-bar.module.css';

type SearchBarProps = {
  onSearch: (query: string) => void;
  loading?: boolean;
};

export const SearchBar = ({ onSearch, loading }: SearchBarProps) => {
  const [query, setQuery] = useState('London');

  const placeholder = 'Город или координаты (например: Moscow / 55.75, 37.62)';

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const value = query.trim();
    if (value.length === 0) return;
    onSearch(value);
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuery(e.target.value);
  };

  return (
    <form className={styles.form} role="search" onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="search"
        inputMode="search"
        placeholder={placeholder}
        value={query}
        onChange={onChange}
        aria-label="Поиск города"
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        Искать
      </button>
      <p className={styles.hint}>Источники: Open-Meteo • Open-Meteo Geocoding</p>
    </form>
  );
};
