export const parseQuery = (raw: string) => {
  const trimmed = raw.trim();
  const coordMatch = trimmed.match(/^(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)$/);

  if (coordMatch) {
    const latitude = Number(coordMatch[1]);
    const longitude = Number(coordMatch[3]);
    return { isCoords: true as const, latitude, longitude, name: `${latitude}, ${longitude}` };
  }

  return { isCoords: false as const, name: trimmed };
};
