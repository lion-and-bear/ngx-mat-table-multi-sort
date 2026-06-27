import { type MockInstance, vi } from "vitest";
import { TableColumn } from "./lib/mat-table-column-config";

export interface Test {
  id: string;
  name: string;
  value: number;
}

export function generateColumns(): TableColumn<Test>[] {
  return [
    { id: "id", label: "ID", visible: false },
    { id: "name", label: "Name", visible: true },
    { id: "value", label: "Value", visible: true },
  ];
}

export type MockStorage = Storage & {
  getItem: MockInstance<(key: string) => string | null>;
  setItem: MockInstance<(key: string, value: string) => void>;
};

export function createMockStorage(
  initial: Record<string, string> = {}
): MockStorage {
  const store = new Map<string, string>(Object.entries(initial));
  return {
    get length(): number {
      return store.size;
    },
    clear: vi.fn(() => store.clear()),
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    key: vi.fn(
      (index: number): string | null => [...store.keys()][index] ?? null
    ),
  };
}
