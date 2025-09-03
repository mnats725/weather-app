import styles from './header.module.css';

type HeaderProps = {
  title: string;
};

const renderCaption = () => <p className={styles.caption}>бесплатные источники • красивая визуализация</p>;

export const Header = ({ title }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.brand}>{title}</h1>
        {renderCaption()}
      </div>
    </header>
  );
};
