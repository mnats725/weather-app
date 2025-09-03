import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import styles from './hourly-temp-chart.module.css';

import type { HourlyWeatherPoint } from '../../types/weather.type';

type HourlyTempChartProps = {
  data: HourlyWeatherPoint[];
};

const toLabel = (iso: string) => {
  const d = new Date(iso);
  const hh = d.getHours().toString().padStart(2, '0');
  return `${hh}:00`;
};

export const HourlyTempChart = ({ data }: HourlyTempChartProps) => {
  const chartData = data.slice(0, 24).map((p) => ({
    time: toLabel(p.time),
    t: Math.round(p.temperature2m),
    feels: Math.round(p.apparentTemperature),
  }));

  return (
    <section className={styles.card} aria-label="Почасовая температура">
      <h3>Почасовая температура (24ч)</h3>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" minTickGap={24} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="t" />
            <Line type="monotone" dataKey="feels" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
