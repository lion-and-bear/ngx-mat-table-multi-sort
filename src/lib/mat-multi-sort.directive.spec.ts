import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatSortable, Sort } from "@angular/material/sort";
import { vi } from "vitest";
import {
  MatMultiSortDirective,
  SORT_PERSISTENCE_ENABLED,
  SORT_PERSISTENCE_STORAGE,
} from "./mat-multi-sort.directive";
import { createMockStorage, type MockStorage } from "../test";

@Component({
  selector: "mat-multi-sort-test",
  changeDetection: ChangeDetectionStrategy.Eager,
  template: "",
})
class TestComponent extends MatMultiSortDirective {}

describe("MatMultiSortDirective", () => {
  let storage: MockStorage;
  let fixture: ComponentFixture<TestComponent>;
  let directive: TestComponent;

  const flushEffects = (): void => {
    fixture.detectChanges();
  };

  beforeEach(async () => {
    storage = createMockStorage();
    await TestBed.configureTestingModule({
      imports: [TestComponent, MatMultiSortDirective],
      providers: [{ provide: SORT_PERSISTENCE_STORAGE, useValue: storage }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    directive = fixture.componentInstance;
    flushEffects();
    storage.setItem.mockClear();
    directive._sorts.set([
      { active: "col1", direction: "asc" },
      { active: "col2", direction: "desc" },
      { active: "col3", direction: "asc" },
    ]);
    flushEffects();
    storage.setItem.mockClear();
  });

  it("should create an instance", () => {
    expect(directive).toBeTruthy();
  });

  it("should return the sort direction for a given column ID", () => {
    expect(directive.getSortDirection("col1")).toBe("asc");
  });

  it("should return an empty sort direction for a column that is not sorted", () => {
    expect(directive.getSortDirection("unknown")).toBe("");
  });

  it("should return the sort index of the given column ID", () => {
    expect(directive.getSortIndex("col2")).toBe(1);
  });

  it("should return -1 for a column that is not sorted", () => {
    expect(directive.getSortIndex("unknown")).toBe(-1);
  });

  it("should append a new column to the list of sort columns with the specified direction", () => {
    const spy = vi.spyOn(directive.sortChange, "emit");
    directive.sort({ id: "test", start: "desc" } as MatSortable);
    expect(directive._sorts()).toEqual([
      { active: "col1", direction: "asc" },
      { active: "col2", direction: "desc" },
      { active: "col3", direction: "asc" },
      { active: "test", direction: "desc" },
    ]);
    expect(directive.active).toBe("test");
    expect(directive.direction).toBe("desc");
    expect(spy).toHaveBeenCalledWith({ active: "test", direction: "desc" });
    flushEffects();
    expect(storage.setItem).toHaveBeenCalled();
  });

  it("should append a new column to the list of sort columns with the default sort direction unless otherwise specified", () => {
    const spy = vi.spyOn(directive.sortChange, "emit");
    directive.sort({ id: "test" } as MatSortable);
    expect(directive._sorts()).toEqual([
      { active: "col1", direction: "asc" },
      { active: "col2", direction: "desc" },
      { active: "col3", direction: "asc" },
      { active: "test", direction: directive.start },
    ]);
    expect(directive.active).toBe("test");
    expect(directive.direction).toBe("asc");
    expect(spy).toHaveBeenCalledWith({ active: "test", direction: "asc" });
    flushEffects();
    expect(storage.setItem).toHaveBeenCalled();
  });

  it("should update the direction of an existing column", () => {
    const spy = vi.spyOn(directive.sortChange, "emit");
    directive.sort({ id: "col1" } as MatSortable);
    expect(directive._sorts()).toEqual([
      { active: "col1", direction: "desc" },
      { active: "col2", direction: "desc" },
      { active: "col3", direction: "asc" },
    ]);
    expect(directive.active).toBe("col1");
    expect(directive.direction).toBe("desc");
    expect(spy).toHaveBeenCalledWith({ active: "col1", direction: "desc" });
    flushEffects();
    expect(storage.setItem).toHaveBeenCalled();
  });

  it("should remove the direction of an existing column if the direction is empty", () => {
    directive.disableClear = false;
    const spy = vi.spyOn(directive.sortChange, "emit");
    directive.sort({ id: "col2" } as MatSortable);
    expect(directive._sorts()).toEqual([
      { active: "col1", direction: "asc" },
      { active: "col3", direction: "asc" },
    ]);
    expect(directive.active).toBe("col2");
    expect(directive.direction).toBe("");
    expect(spy).toHaveBeenCalledWith({ active: "col2", direction: "" });
    flushEffects();
    expect(storage.setItem).toHaveBeenCalled();
  });

  it("should remove a sort level by its identifier", () => {
    const spy = vi.spyOn(directive.sortChange, "emit");
    directive.removeSortLevel("col2");
    expect(directive._sorts()).toEqual([
      { active: "col1", direction: "asc" },
      { active: "col3", direction: "asc" },
    ]);
    expect(spy).toHaveBeenCalled();
    flushEffects();
    expect(storage.setItem).toHaveBeenCalled();
  });

  it("should not change the sort levels if the identifier is not found", () => {
    const spy = vi.spyOn(directive.sortChange, "emit");
    directive.removeSortLevel("unknown");
    expect(directive._sorts()).toEqual([
      { active: "col1", direction: "asc" },
      { active: "col2", direction: "desc" },
      { active: "col3", direction: "asc" },
    ]);
    expect(spy).not.toHaveBeenCalled();
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it("should reorder the sort levels when previousIndex and currentIndex are different", () => {
    const spy = vi.spyOn(directive.sortChange, "emit");
    directive.reorderSortLevel(0, 2);
    expect(directive._sorts()).toEqual([
      { active: "col2", direction: "desc" },
      { active: "col3", direction: "asc" },
      { active: "col1", direction: "asc" },
    ]);
    expect(spy).toHaveBeenCalledWith({ active: "col1", direction: "asc" });
    flushEffects();
    expect(storage.setItem).toHaveBeenCalled();
  });

  it("should not reorder the sort levels when previousIndex and currentIndex are the same", () => {
    const spy = vi.spyOn(directive.sortChange, "emit");
    directive.reorderSortLevel(1, 1);
    expect(directive._sorts()).toEqual([
      { active: "col1", direction: "asc" },
      { active: "col2", direction: "desc" },
      { active: "col3", direction: "asc" },
    ]);
    expect(spy).not.toHaveBeenCalled();
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it("should toggle the sort direction for an existing column", () => {
    const spy = vi.spyOn(directive.sortChange, "emit");
    directive.toggleSortDirection("col1");
    expect(directive._sorts()).toEqual([
      { active: "col1", direction: "desc" },
      { active: "col2", direction: "desc" },
      { active: "col3", direction: "asc" },
    ]);
    expect(directive.active).toBe("col1");
    expect(directive.direction).toBe("desc");
    expect(spy).toHaveBeenCalledWith({ active: "col1", direction: "desc" });
    flushEffects();
    expect(storage.setItem).toHaveBeenCalled();
  });

  it("should not change the sort direction for a column that is not sorted", () => {
    const spy = vi.spyOn(directive.sortChange, "emit");
    directive.toggleSortDirection("unknown");
    expect(directive._sorts()).toEqual([
      { active: "col1", direction: "asc" },
      { active: "col2", direction: "desc" },
      { active: "col3", direction: "asc" },
    ]);
    expect(spy).not.toHaveBeenCalled();
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it("should cycle through sort directions for an existing column", () => {
    directive.disableClear = false;
    const spy = vi.spyOn(directive.sortChange, "emit");

    directive.toggleSortDirection("col1");
    expect(directive._sorts()).toEqual([
      { active: "col1", direction: "desc" },
      { active: "col2", direction: "desc" },
      { active: "col3", direction: "asc" },
    ]);
    expect(directive.active).toBe("col1");
    expect(directive.direction).toBe("desc");
    expect(spy).toHaveBeenCalledWith({ active: "col1", direction: "desc" });
    flushEffects();
    expect(storage.setItem).toHaveBeenCalledTimes(1);

    directive.toggleSortDirection("col1");
    expect(directive._sorts()).toEqual([
      { active: "col1", direction: "asc" },
      { active: "col2", direction: "desc" },
      { active: "col3", direction: "asc" },
    ]);
    expect(directive.active).toBe("col1");
    expect(directive.direction).toBe("asc");
    expect(spy).toHaveBeenCalledWith({ active: "col1", direction: "asc" });
    flushEffects();
    expect(storage.setItem).toHaveBeenCalledTimes(2);
  });

  it("should clear the current sorting state", () => {
    const spy = vi.spyOn(directive.sortChange, "emit");
    directive.clearSorting();
    expect(directive.active).toBe("");
    expect(directive.direction).toBe("");
    expect(directive._sorts()).toEqual([]);
    expect(spy).toHaveBeenCalled();
    flushEffects();
    expect(storage.setItem).toHaveBeenCalled();
  });

  it("should emit sortChange once with the clicked column, not the last sort entry", () => {
    const sortChangeSpy = vi.spyOn(directive.sortChange, "emit");
    const persistSpy = vi.spyOn(storage, "setItem");

    directive.sort({ id: "col1" } as MatSortable);

    expect(sortChangeSpy).toHaveBeenCalledTimes(1);
    expect(sortChangeSpy).toHaveBeenCalledWith({
      active: "col1",
      direction: "desc",
    });
    flushEffects();
    expect(persistSpy).toHaveBeenCalledTimes(1);
  });

  it("should load persisted value when key changes", () => {
    const test: Sort[] = [
      { active: "col3", direction: "asc" },
      { active: "col2", direction: "desc" },
      { active: "col1", direction: "asc" },
    ];
    expect(directive.key).toBe("mat-table-persistence-sort");
    directive.setPersistenceKey("test-key");
    flushEffects();
    storage.setItem.mockClear();
    expect(directive.key).toBe("test-key");
    expect(storage.getItem).toHaveBeenCalledWith("test-key");
    expect(directive._sorts()).toEqual([]);
    storage.getItem.mockReturnValue(JSON.stringify(test));
    directive.setPersistenceKey("test-key1");
    flushEffects();
    expect(directive.key).toBe("test-key1");
    expect(directive._sorts()).toEqual(test);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
  });

  it("should overwrite persisted columns when key changes", () => {
    const expectation = JSON.stringify(directive._sorts());
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    directive.setPersistenceKey("test-key", true);
    expect(storage.setItem).toHaveBeenCalledWith("test-key", expectation);
    expect(storage.getItem).toHaveBeenCalledTimes(1);
  });
});

describe("MatMultiSortDirective with persistence disabled", () => {
  let storage: MockStorage;
  let fixture: ComponentFixture<TestComponent>;
  let directive: TestComponent;

  beforeEach(async () => {
    storage = createMockStorage();
    await TestBed.configureTestingModule({
      imports: [TestComponent, MatMultiSortDirective],
      providers: [
        { provide: SORT_PERSISTENCE_STORAGE, useValue: storage },
        { provide: SORT_PERSISTENCE_ENABLED, useValue: false },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    directive = fixture.componentInstance;
  });

  it("should not persist sort settings when persistence is disabled", () => {
    directive.sort({ id: "test", start: "asc" } as MatSortable);
    fixture.detectChanges();
    expect(storage.setItem).not.toHaveBeenCalled();
  });
});

describe("MatMultiSortDirective", () => {
  it("should restore the persisted settings", async () => {
    const test: Sort[] = [
      { active: "col1", direction: "asc" },
      { active: "col2", direction: "desc" },
      { active: "col3", direction: "asc" },
    ];
    const storage = createMockStorage({
      "mat-table-persistence-sort": JSON.stringify(test),
    });
    await TestBed.configureTestingModule({
      imports: [TestComponent, MatMultiSortDirective],
      providers: [{ provide: SORT_PERSISTENCE_STORAGE, useValue: storage }],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const directive = fixture.componentInstance;
    expect(directive._sorts()).toEqual(test);
  });
});
