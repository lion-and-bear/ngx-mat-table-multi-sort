import { Injectable, Signal, inject, signal } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import {
  COLUMN_CONFIG_PERSISTENCE_ENABLED,
  COLUMN_CONFIG_PERSISTENCE_KEY,
  COLUMN_CONFIG_PERSISTENCE_STORAGE,
  TableColumn,
} from "./mat-table-column-config";

@Injectable({
  providedIn: "root",
})
export class MatTableColumnConfigPersistenceService<T> {
  // Every write is treated as a change so that callers assigning a mutated
  // array instance still notify consumers.
  private readonly _columns = signal<TableColumn<T>[]>([], {
    equal: () => false,
  });
  // Mirrors the signal for the deprecated `getColumns()` stream, which keeps
  // emitting synchronously.
  private readonly columns$ = new BehaviorSubject<TableColumn<T>[]>([]);
  private readonly storage =
    inject<Storage>(COLUMN_CONFIG_PERSISTENCE_STORAGE, { optional: true }) ??
    localStorage;
  private persistenceKey =
    inject(COLUMN_CONFIG_PERSISTENCE_KEY, { optional: true }) ??
    "mat-table-persistence-column-config";
  isPersistenceEnabled =
    inject(COLUMN_CONFIG_PERSISTENCE_ENABLED, { optional: true }) ?? true;

  /**
   * A read-only signal holding the current table columns configuration.
   */
  public readonly columnsSignal: Signal<TableColumn<T>[]> =
    this._columns.asReadonly();

  /**
   * Gets the current table columns configuration.
   *
   * @returns {TableColumn<T>[]} An array of table columns.
   */
  public get columns(): TableColumn<T>[] {
    return this._columns();
  }

  /**
   * Sets the columns configuration for the table and persists the configuration.
   *
   * @param value - An array of `TableColumn<T>` representing the new column configuration.
   */
  public set columns(value: TableColumn<T>[]) {
    this.setColumns(value);
    this.persistColumnConfig(value);
  }

  /**
   * Gets the key used for column configuration persistence.
   *
   * @returns {string} The key used for column configuration persistence.
   */
  public get key(): string {
    return this.persistenceKey;
  }

  constructor() {
    if (!this.isPersistenceEnabled) return;

    this.setColumns(this.readPersistedColumns());
  }

  /**
   * Retrieves an observable stream of table columns.
   *
   * @deprecated Read {@link columnsSignal} instead. Will be removed in a future major version.
   * @returns {Observable<TableColumn<T>[]>} An observable that emits an array of table columns.
   */
  public getColumns(): Observable<TableColumn<T>[]> {
    return this.columns$.asObservable();
  }

  private setColumns(value: TableColumn<T>[]): void {
    this._columns.set(value);
    this.columns$.next(value);
  }

  private readPersistedColumns(): TableColumn<T>[] {
    const columnsSerialized = this.storage.getItem(this.persistenceKey);
    return columnsSerialized ? JSON.parse(columnsSerialized) : [];
  }

  private persistColumnConfig(columns: TableColumn<T>[]): void {
    if (!this.isPersistenceEnabled) return;
    this.storage.setItem(this.persistenceKey, JSON.stringify(columns));
  }

  /**
   * Sets the persistence key for storing column configurations.
   *
   * @param key - The key to be used for persistence.
   * @param overwritePersistedValue - If true, the current column configuration will be persisted immediately overwriting any exising value stored under the new key.
   *                                  If false, the persisted column configuration will be loaded and applied.
   *                                  Defaults to false.
   *
   * @returns void
   */
  public setPersistenceKey(key: string, overwritePersistedValue = false): void {
    this.persistenceKey = key;
    if (overwritePersistedValue) {
      this.persistColumnConfig(this.columns);
      return;
    }

    this.setColumns(this.readPersistedColumns());
  }
}
