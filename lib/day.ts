export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diffMs = date.getTime() - start.getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;
  return Math.floor(diffMs / oneDayMs) + 1;
}

const WEEKDAYS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export function formatDateLong(date: Date = new Date()): string {
  const weekday = WEEKDAYS[date.getDay()];
  const month = MONTHS[date.getMonth()];
  return `${weekday}, ${date.getDate()} de ${month}`;
}

export function toIsoDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** "14/04/26" — usado na folha de impressão. */
export function formatDateShort(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

/** "Segunda" — usado na folha de impressão. */
export function getWeekdayName(date: Date = new Date()): string {
  return WEEKDAYS[date.getDay()];
}
