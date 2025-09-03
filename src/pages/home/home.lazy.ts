import { lazyNamed } from '@utils/lazy-named.util';

import type { HourlyWeatherPoint, DailyWeatherPoint } from '../../types/weather.type';

type HourlyProps = { data: HourlyWeatherPoint[] };
type DailyProps = { data: DailyWeatherPoint[] };

export const HourlyTempChartLazy = lazyNamed<HourlyProps>(
  () => import('@components/ui/hourly-temp-chart'),
  'HourlyTempChart'
);

export const DailyRangeChartLazy = lazyNamed<DailyProps>(
  () => import('@components/ui/daily-range-chart'),
  'DailyRangeChart'
);
