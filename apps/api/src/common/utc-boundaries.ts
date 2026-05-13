export function startOfUtcDay(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

export function addUtcDays(start: Date, days: number): Date {
  const t = new Date(start);
  t.setUTCDate(t.getUTCDate() + days);
  return t;
}
