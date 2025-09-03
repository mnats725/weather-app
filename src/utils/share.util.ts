export const makeForecastText = (args: { city: string; t: number; wind: number; tz: string }) => {
  return [
    `Погода — ${args.city}`,
    `Температура: ${Math.round(args.t)}°C`,
    `Ветер: ${Math.round(args.wind)} м/с`,
    `Часовой пояс: ${args.tz}`,
  ].join('\n');
};

export const shareOrCopy = async (text: string) => {
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return true;
    } catch {
      return false;
    }
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  return false;
};
