import { Header } from '@components/header';
import { HomePage } from '@pages/home';

import styles from './app.module.css';

const appTitle = 'Weather App';

const renderHeader = () => <Header title={appTitle} />;

export const App = () => {
  return (
    <div className={styles.wrapper}>
      {renderHeader()}
      <main className={styles.container}>
        <HomePage />
      </main>
    </div>
  );
};
