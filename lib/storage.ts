import type { Dds, Sector } from "@/data/dds.schema";
import { toIsoDate } from "./day";

const HISTORY_KEY = "365dds:history";
const ONBOARDING_KEY = "365dds:onboarding-seen";

export interface HistoryEntry {
  id: number;
  date: string; // YYYY-MM-DD
  titulo: string;
  setores: Sector[];
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readHistory(): HistoryEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function writeHistory(entries: HistoryEntry[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

export function getHistory(): HistoryEntry[] {
  return [...readHistory()].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function markDone(dds: Dds, date: Date = new Date()): void {
  const dateIso = toIsoDate(date);
  const entries = readHistory();
  const alreadyMarked = entries.some((e) => e.id === dds.id && e.date === dateIso);
  if (alreadyMarked) return;
  entries.push({ id: dds.id, date: dateIso, titulo: dds.titulo, setores: dds.setores });
  writeHistory(entries);
}

export function isDoneOn(id: number, date: Date = new Date()): boolean {
  const dateIso = toIsoDate(date);
  return readHistory().some((e) => e.id === id && e.date === dateIso);
}

export function isDoneEver(id: number): boolean {
  return readHistory().some((e) => e.id === id);
}

export function clearHistory(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(HISTORY_KEY);
}

export function getMonthCount(date: Date = new Date()): number {
  const prefix = toIsoDate(date).slice(0, 7); // YYYY-MM
  return readHistory().filter((e) => e.date.startsWith(prefix)).length;
}

export function hasSeenOnboarding(): boolean {
  if (!isBrowser()) return true;
  return window.localStorage.getItem(ONBOARDING_KEY) === "1";
}

export function markOnboardingSeen(): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(ONBOARDING_KEY, "1");
}
