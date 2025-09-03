import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Area } from 'recharts';

import styles from './daily-range-chart.module.css';

import type { DailyWeatherPoint } from '../../../types/weather.type';

type DailyRangeChartProps = { data: DailyWeatherPoint[] };

const tickDay = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  return new Intl.DateTimeFormat('ru', { weekday: 'short' }).format(d);
};

const tooltipDay = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  const wd = new Intl.DateTimeFormat('ru', { weekday: 'long' }).format(d);
  const dm = d.toLocaleDateString('ru', { day: '2-digit', month: '2-digit' });
  return `${wd}, ${dm}`;
};

export const DailyRangeChart = ({ data }: DailyRangeChartProps) => {
  const chartData = data.slice(0, 7).map((p) => ({
    date: p.date,
    min: Math.round(p.tempMin),
    max: Math.round(p.tempMax),
  }));

  return (
    <section className={styles.card} aria-label="Прогноз на 7 дней">
      <h3>Диапазон температур (7 дней)</h3>
      <div className={styles.chart}>
        <ResponsiveContainer>
          <ComposedChart data={chartData}>
            <XAxis
              dataKey="date"
              tickFormatter={tickDay}
              tick={{ fill: 'var(--text)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,.25)' }}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis
              tick={{ fill: 'var(--text)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,.25)' }}
              tickLine={false}
              width={36}
            />
            <Tooltip
              labelFormatter={tooltipDay}
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
            <Area dataKey="min" />
            <Area dataKey="max" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
