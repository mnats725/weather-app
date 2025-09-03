import { useState } from 'react';

import { makeForecastText, shareOrCopy } from '@utils/share.util';

import styles from './share-button.module.css';

type ShareButtonProps = {
  city: string;
  t: number;
  wind: number;
  tz: string;
};

export const ShareButton = ({ city, t, wind, tz }: ShareButtonProps) => {
  const [done, setDone] = useState(false);

  const handle = async () => {
    const text = makeForecastText({ city, t, wind, tz });
    const ok = await shareOrCopy(text);
    if (!ok) return;
    setDone(true);
    window.setTimeout(() => setDone(false), 1500);
  };

  return (
    <button type="button" className={styles.button} onClick={handle} aria-live="polite">
      {done ? 'Скопировано ✓' : 'Поделиться'}
    </button>
  );
};
