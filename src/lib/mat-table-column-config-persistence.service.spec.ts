import { effect } from "@angular/core";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { createMockStorage, type MockStorage, Test } from "../test";
import {
  COLUMN_CONFIG_PERSISTENCE_STORAGE,
  TableColumn,
} from "./mat-table-column-config";
import { MatTableColumnConfigPersistenceService } from "./mat-table-column-config-persistence.service";

describe("MatTableColumnConfigPersistenceService", () => {
  let storage: MockStorage;
  let service: MatTableColumnConfigPersistenceService<Test>;

  beforeEach(() => {
    storage = createMockStorage();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: COLUMN_CONFIG_PERSISTENCE_STORAGE,
          useValue: storage,
        },
      ],
    });
    service = TestBed.inject(MatTableColumnConfigPersistenceService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
    expect(storage.getItem).toHaveBeenCalled();
  });

  it("should have an empty columns array initially", () => {
    expect(service.columns).toEqual([]);
  });

  it("should notify subscribers when columns change", fakeAsync(() => {
    const test: TableColumn<Test>[] = [
      { id: "id", label: "ID", visible: false },
      { id: "name", label: "Name", visible: true },
      { id: "value", label: "Value", visible: true },
    ];
    let count = 0;
    service.getColumns().subscribe((columns) => {
      switch (count++) {
        case 0:
          expect(columns).toEqual([]);
          return;
        case 1:
          expect(columns).toEqual(test);
          return;
        default:
          expect.unreachable("Unexpected call");
      }
    });
    expect(service.columns).toEqual([]);
    service.columns = test;
    tick();
    expect(service.columns).toEqual(test);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
  }));

  it("should expose the columns as a read-only signal", () => {
    const test: TableColumn<Test>[] = [
      { id: "id", label: "ID", visible: false },
      { id: "name", label: "Name", visible: true },
    ];
    expect(service.columnsSignal()).toEqual([]);
    service.columns = test;
    expect(service.columnsSignal()).toBe(test);
    expect(service.columns).toBe(test);
    expect("set" in service.columnsSignal).toBe(false);
  });

  it("should notify signal consumers when a mutated array is reassigned", () => {
    const test: TableColumn<Test>[] = [
      { id: "id", label: "ID", visible: false },
    ];
    service.columns = test;
    const values: TableColumn<Test>[][] = [];
    const ref = TestBed.runInInjectionContext(() =>
      effect(() => {
        values.push(service.columnsSignal());
      })
    );
    TestBed.tick();
    test[0].visible = true;
    service.columns = test;
    TestBed.tick();
    expect(values).toHaveLength(2);
    expect(storage.setItem).toHaveBeenCalledTimes(2);
    ref.destroy();
  });

  it("should emit every update synchronously on the deprecated observable", () => {
    const first: TableColumn<Test>[] = [
      { id: "id", label: "ID", visible: false },
    ];
    const second: TableColumn<Test>[] = [
      { id: "name", label: "Name", visible: true },
    ];
    const values: TableColumn<Test>[][] = [];
    const subscription = service
      .getColumns()
      .subscribe((columns) => values.push(columns));
    service.columns = first;
    service.columns = second;
    expect(values).toEqual([[], first, second]);
    subscription.unsubscribe();
  });

  it("should not persist columns if persistence is disabled", () => {
    const test: TableColumn<Test>[] = [
      { id: "id", label: "ID", visible: false },
      { id: "name", label: "Name", visible: true },
      { id: "value", label: "Value", visible: true },
    ];
    service.isPersistenceEnabled = false;
    service.columns = test;
    expect(storage.setItem).not.toHaveBeenCalled();
    service.isPersistenceEnabled = true;
    service.columns = test;
    expect(storage.setItem).toHaveBeenCalledTimes(1);
  });

  it("should load persisted value when key changes", () => {
    expect(service.key).toBe("mat-table-persistence-column-config");
    const test: TableColumn<Test>[] = [
      { id: "id", label: "ID", visible: false },
      { id: "name", label: "Name", visible: true },
      { id: "value", label: "Value", visible: true },
    ];
    service.columns = test;
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    service.setPersistenceKey("test-key");
    expect(service.key).toBe("test-key");
    expect(storage.getItem).toHaveBeenCalledWith("test-key");
    expect(service.columns).toEqual([]);
    storage.getItem.mockReturnValue(JSON.stringify(test));
    service.setPersistenceKey("test-key1");
    expect(service.key).toBe("test-key1");
    expect(service.columns).toEqual(test);
    expect(service.columnsSignal()).toEqual(test);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
  });

  it("should overwrite persisted columns when key changes", () => {
    const test: TableColumn<Test>[] = [
      { id: "id", label: "ID", visible: false },
      { id: "name", label: "Name", visible: true },
      { id: "value", label: "Value", visible: true },
    ];
    service.columns = test;
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    service.setPersistenceKey("test-key", true);
    expect(storage.setItem).toHaveBeenCalledWith(
      "test-key",
      JSON.stringify(test)
    );
    expect(storage.getItem).toHaveBeenCalledTimes(1);
  });
});

describe("MatTableColumnConfigPersistenceService", () => {
  it("should restore persisted settings", () => {
    const test: TableColumn<Test>[] = [
      { id: "id", label: "ID", visible: false },
      { id: "name", label: "Name", visible: true },
      { id: "value", label: "Value", visible: true },
    ];
    const storage = createMockStorage({
      "mat-table-persistence-column-config": JSON.stringify(test),
    });
    TestBed.configureTestingModule({
      providers: [
        {
          provide: COLUMN_CONFIG_PERSISTENCE_STORAGE,
          useValue: storage,
        },
      ],
    });
    const service = TestBed.inject(MatTableColumnConfigPersistenceService);
    expect(service.columns).toEqual(test);
  });
});
