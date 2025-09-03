import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import styles from './hourly-temp-chart.module.css';

import type { HourlyWeatherPoint } from '../../../types/weather.type';

type HourlyTempChartProps = { data: HourlyWeatherPoint[] };

const tickLabel = (iso: string) => {
  const d = new Date(iso);
  const wd = new Intl.DateTimeFormat('ru', { weekday: 'short' }).format(d);
  const tm = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${wd} ${tm}`;
};

const tooltipLabel = (iso: string) => {
  const d = new Date(iso);
  const wd = new Intl.DateTimeFormat('ru', { weekday: 'long' }).format(d);
  const tm = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${wd}, ${tm}`;
};

export const HourlyTempChart = ({ data }: HourlyTempChartProps) => {
  const chartData = data.slice(0, 24).map((p) => ({
    time: p.time,
    t: Math.round(p.temperature2m),
    feels: Math.round(p.apparentTemperature),
  }));

  return (
    <section className={styles.card} aria-label="Почасовая температура">
      <h3>Почасовая температура (24ч)</h3>
      <div className={styles.chart}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.15)" />
            <XAxis
              dataKey="time"
              tickFormatter={tickLabel}
              tick={{ fill: 'var(--text)', fontSize: 12 }}
              tickMargin={8}
              minTickGap={24}
              axisLine={{ stroke: 'rgba(255,255,255,.25)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--text)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,.25)' }}
              tickLine={false}
              width={36}
            />
            <Tooltip
              labelFormatter={tooltipLabel}
              wrapperStyle={{
                background: 'rgba(7,11,20,.95)',
                border: '1px solid rgba(255,255,255,.15)',
                borderRadius: 10,
                boxShadow: 'var(--shadow)',
              }}
              contentStyle={{ background: 'transparent', border: '0' }}
              labelStyle={{ color: 'var(--text)' }}
              itemStyle={{ color: 'var(--text)' }}
            />
            <Line type="monotone" dataKey="t" dot={{ r: 3 }} />
            <Line type="monotone" dataKey="feels" dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
