import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Area } from 'recharts';

import styles from './daily-range-chart.module.css';

import type { DailyWeatherPoint } from '../../types/weather.type';

type DailyRangeChartProps = {
  data: DailyWeatherPoint[];
};

const toDay = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit' });
};

export const DailyRangeChart = ({ data }: DailyRangeChartProps) => {
  const chartData = data.slice(0, 7).map((p) => ({
    day: toDay(p.date),
    min: Math.round(p.tempMin),
    max: Math.round(p.tempMax),
  }));

  return (
    <section className={styles.card} aria-label="Прогноз на 7 дней">
      <h3>Диапазон температур (7 дней)</h3>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <ComposedChart data={chartData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area dataKey="min" />
            <Area dataKey="max" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
