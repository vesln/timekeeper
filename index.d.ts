export as namespace timekeeper;

interface Timekeeper {
  freeze(): void;
  travel(date: Date): void;
  reset(): void;
  isKeepingTime(): boolean;
}

declare const timekeeper: Timekeeper;

export = timekeeper;
