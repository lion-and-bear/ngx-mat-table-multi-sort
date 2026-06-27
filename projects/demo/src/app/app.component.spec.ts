import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatRadioChange } from "@angular/material/radio";
import { Sort } from "@angular/material/sort";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { afterEach, vi } from "vitest";
import {
  COLUMN_CONFIG_PERSISTENCE_ENABLED,
  MatTableColumnConfigPersistenceService,
  SORT_PERSISTENCE_ENABLED,
  TableColumn,
} from "../../../../src/public-api";
import { createMockStorage, type MockStorage } from "../../../../src/test";
import { AppComponent } from "./app.component";
import { MemberInformation } from "./data";

describe("AppComponent", () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let storage: MockStorage;
  let persistenceService: MatTableColumnConfigPersistenceService<MemberInformation>;

  beforeEach(async () => {
    storage = createMockStorage();
    vi.stubGlobal("sessionStorage", storage);

    await TestBed.configureTestingModule({
      imports: [AppComponent, NoopAnimationsModule],
      providers: [
        MatTableColumnConfigPersistenceService<MemberInformation>,
        { provide: SORT_PERSISTENCE_ENABLED, useValue: false },
        { provide: COLUMN_CONFIG_PERSISTENCE_ENABLED, useValue: false },
      ],
    }).compileComponents();

    persistenceService = TestBed.inject(MatTableColumnConfigPersistenceService);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should create the app", () => {
    expect(component).toBeTruthy();
  });

  it("should have the correct title", () => {
    expect(component.title).toEqual("ngx-mat-table-multi-sort Demo");
  });

  it("should render title", () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("h1")?.textContent).toContain(
      "ngx-mat-table-multi-sort Demo"
    );
  });

  it("should have defaulted to the Default persistence mode", () => {
    fixture.detectChanges();
    expect(component.sort.isPersistenceEnabled).toBe(false);
    expect(persistenceService.isPersistenceEnabled).toBe(false);
    expect(storage.getItem).toHaveBeenCalledWith("persistenceMode");
    expect(storage.getItem).toHaveBeenCalledWith("sorts-Default");
    expect(storage.getItem).toHaveBeenCalledWith("columns-Default");
    expect(component.persistenceMode).toEqual("Default");
    expect(component.columns).toEqual([
      { id: "id", label: "ID", visible: false },
      { id: "name", label: "Name", visible: true },
      { id: "age", label: "Age", visible: true },
      { id: "active", label: "Active", visible: true },
      { id: "joinDate", label: "Join Date", visible: true },
      { id: "score", label: "Score", visible: true },
      { id: "department", label: "Department", visible: true },
      { id: "comment", label: "Comment", visible: true },
    ]);
    expect(component.displayedColumns).toEqual([
      "name",
      "age",
      "active",
      "joinDate",
      "score",
      "department",
      "comment",
    ]);
    expect(component.sort._sorts()).toEqual([
      { active: "active", direction: "desc" },
      { active: "department", direction: "asc" },
      { active: "score", direction: "desc" },
    ]);
  });

  it("should have restored to the stored persistence mode", () => {
    const sorts: Sort[] = [
      { active: "name", direction: "asc" },
      { active: "age", direction: "desc" },
    ];
    const columns: TableColumn<MemberInformation>[] = [
      { id: "id", label: "ID", visible: false },
      { id: "name", label: "Name", visible: true },
      { id: "age", label: "Age", visible: true },
      { id: "active", label: "Active", visible: false },
      { id: "joinDate", label: "Join Date", visible: false },
      { id: "score", label: "Score", visible: true },
      { id: "department", label: "Department", visible: false },
      { id: "comment", label: "Comment", visible: false },
    ];
    storage.getItem.mockImplementation((key: string) => {
      switch (key) {
        case "persistenceMode":
          return "Custom_1";
        case "sorts-Custom_1":
          return JSON.stringify(sorts);
        case "columns-Custom_1":
          return JSON.stringify(columns);
        default:
          expect.unreachable("Unexpected key: " + key);
          return null;
      }
    });
    fixture.detectChanges();
    expect(component.sort.isPersistenceEnabled).toBe(false);
    expect(persistenceService.isPersistenceEnabled).toBe(false);
    expect(storage.getItem).toHaveBeenCalledWith("persistenceMode");
    expect(storage.getItem).toHaveBeenCalledWith("sorts-Custom_1");
    expect(storage.getItem).toHaveBeenCalledWith("columns-Custom_1");
    expect(component.persistenceMode).toEqual("Custom_1");
    expect(component.columns).toEqual(columns);
    expect(component.displayedColumns).toEqual(["name", "age", "score"]);
    expect(component.sort._sorts()).toEqual(sorts);
  });

  it("should load new state when persistence mode is changed", () => {
    fixture.detectChanges();
    expect(component.sort.isPersistenceEnabled).toBe(false);
    expect(persistenceService.isPersistenceEnabled).toBe(false);
    expect(storage.getItem).toHaveBeenCalledWith("persistenceMode");
    expect(storage.getItem).toHaveBeenCalledWith("sorts-Default");
    expect(storage.getItem).toHaveBeenCalledWith("columns-Default");
    expect(component.persistenceMode).toEqual("Default");
    expect(component.columns).toEqual([
      { id: "id", label: "ID", visible: false },
      { id: "name", label: "Name", visible: true },
      { id: "age", label: "Age", visible: true },
      { id: "active", label: "Active", visible: true },
      { id: "joinDate", label: "Join Date", visible: true },
      { id: "score", label: "Score", visible: true },
      { id: "department", label: "Department", visible: true },
      { id: "comment", label: "Comment", visible: true },
    ]);
    expect(component.displayedColumns).toEqual([
      "name",
      "age",
      "active",
      "joinDate",
      "score",
      "department",
      "comment",
    ]);
    expect(component.sort._sorts()).toEqual([
      { active: "active", direction: "desc" },
      { active: "department", direction: "asc" },
      { active: "score", direction: "desc" },
    ]);

    component.onPersistenceModeChanged({ value: "Custom_2" } as MatRadioChange);
    fixture.detectChanges();
    expect(storage.setItem).toHaveBeenCalledWith("persistenceMode", "Custom_2");
    expect(storage.setItem).toHaveBeenCalledWith(
      "sorts-Custom_2",
      JSON.stringify([])
    );
    expect(component.persistenceMode).toEqual("Custom_2");
    expect(storage.setItem).toHaveBeenCalledWith(
      "columns-Custom_2",
      JSON.stringify([
        { id: "id", label: "ID", visible: true },
        { id: "name", label: "Name", visible: true },
        { id: "age", label: "Age", visible: true },
        { id: "active", label: "Active", visible: true },
        { id: "joinDate", label: "Join Date", visible: true },
        { id: "score", label: "Score", visible: true },
        { id: "department", label: "Department", visible: true },
        { id: "comment", label: "Comment", visible: true },
      ])
    );
    expect(component.columns).toEqual([
      { id: "id", label: "ID", visible: true },
      { id: "name", label: "Name", visible: true },
      { id: "age", label: "Age", visible: true },
      { id: "active", label: "Active", visible: true },
      { id: "joinDate", label: "Join Date", visible: true },
      { id: "score", label: "Score", visible: true },
      { id: "department", label: "Department", visible: true },
      { id: "comment", label: "Comment", visible: true },
    ]);
    expect(component.displayedColumns).toEqual([
      "id",
      "name",
      "age",
      "active",
      "joinDate",
      "score",
      "department",
      "comment",
    ]);
    expect(component.sort._sorts()).toEqual([]);
  });

  it("should reset columns and sorts", () => {
    fixture.detectChanges();
    const resetColumnsSpy = vi.spyOn(
      component as unknown as { resetColumns: () => void },
      "resetColumns"
    );
    const resetSortsSpy = vi.spyOn(
      component as unknown as { resetSorts: () => void },
      "resetSorts"
    );
    component.reset();
    expect(resetColumnsSpy).toHaveBeenCalled();
    expect(resetSortsSpy).toHaveBeenCalled();
  });
});
