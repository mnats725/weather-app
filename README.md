# Weather App

Небольшое приложение погоды: поиск города/координат, авто‑геолокация, избранное/история, вкладки (Сегодня • Почасовой • 7 дней • Карта), карта OSM с радаром RainViewer, графики с ленивой подгрузкой.

## Что умеет

- 📍 Определять местоположение и показывать погоду сразу
- 🔎 Поиск по названию и `lat, lon`
- ⭐ Избранные города и недавние запросы (LocalStorage)
- 🗂️ Вкладки: Today / Hourly / 7 days / Map
- 🌧️ Радар осадков поверх OSM
- 📊 Ленивая загрузка графиков (React.lazy + Suspense)
- 🔗 Поделиться: Web Share → Clipboard

## Технологии

- React 18 + TypeScript, Vite
- Leaflet + react‑leaflet (карта), Recharts (графики)
- Open‑Meteo API (прогноз, геокодинг/реверс)
- CSS Modules с native nesting

## Структура

```text
src/
  app/
  components/
    ui/        # презентационные компоненты
    lib/       # базовые блоки/обёртки
  pages/home/
  hooks/      # use-weather.hook.ts
  services/   # weather, geocoding, reverse-geocoding
  utils/      # fetch-json, parse-query, storage, share, lazy-named
  constants/
  types/
  styles/
```

## Запуск

```bash
yarn
yarn dev    # http://localhost:5173
yarn build  # сборка
```
