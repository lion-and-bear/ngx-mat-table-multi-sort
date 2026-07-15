import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatRadioChange } from "@angular/material/radio";
import { Sort } from "@angular/material/sort";
import {
  COLUMN_CONFIG_PERSISTENCE_ENABLED,
  MatTableColumnConfigPersistenceService,
  SORT_PERSISTENCE_ENABLED,
  TableColumn,
} from "../../../../src/public-api";
import { AppComponent } from "./app.component";
import { MemberInformation } from "./data";

describe("AppComponent", () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let setItemSpy: jasmine.Spy;
  let getItemSpy: jasmine.Spy;
  let persistenceService: MatTableColumnConfigPersistenceService<MemberInformation>;

  beforeEach(async () => {
    setItemSpy = spyOn(globalThis.sessionStorage, "setItem");
    getItemSpy = spyOn(globalThis.sessionStorage, "getItem");

    await TestBed.configureTestingModule({
      imports: [AppComponent],
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
    expect(component.sort.isPersistenceEnabled).toBeFalse();
    expect(persistenceService.isPersistenceEnabled).toBeFalse();
    expect(getItemSpy).toHaveBeenCalledWith("persistenceMode");
    expect(getItemSpy).toHaveBeenCalledWith("sorts-Default");
    expect(getItemSpy).toHaveBeenCalledWith("columns-Default");
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
    getItemSpy.and.callFake((key: string) => {
      switch (key) {
        case "persistenceMode":
          return "Custom_1";
        case "sorts-Custom_1":
          return JSON.stringify(sorts);
        case "columns-Custom_1":
          return JSON.stringify(columns);
        default:
          fail("Unexpected key: " + key);
          return null;
      }
    });
    fixture.detectChanges();
    expect(component.sort.isPersistenceEnabled).toBeFalse();
    expect(persistenceService.isPersistenceEnabled).toBeFalse();
    expect(getItemSpy).toHaveBeenCalledWith("persistenceMode");
    expect(getItemSpy).toHaveBeenCalledWith("sorts-Custom_1");
    expect(getItemSpy).toHaveBeenCalledWith("columns-Custom_1");
    expect(component.persistenceMode).toEqual("Custom_1");
    expect(component.columns).toEqual(columns);
    expect(component.displayedColumns).toEqual(["name", "age", "score"]);
    expect(component.sort._sorts()).toEqual(sorts);
  });

  it("should load new state when persistence mode is changed", () => {
    fixture.detectChanges();
    expect(component.sort.isPersistenceEnabled).toBeFalse();
    expect(persistenceService.isPersistenceEnabled).toBeFalse();
    expect(getItemSpy).toHaveBeenCalledWith("persistenceMode");
    expect(getItemSpy).toHaveBeenCalledWith("sorts-Default");
    expect(getItemSpy).toHaveBeenCalledWith("columns-Default");
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
    fixture.detectChanges(); // Trigger change detection cycle to apply effects
    expect(setItemSpy).toHaveBeenCalledWith("persistenceMode", "Custom_2");
    expect(setItemSpy).toHaveBeenCalledWith(
      "sorts-Custom_2",
      JSON.stringify([])
    );
    expect(component.persistenceMode).toEqual("Custom_2");
    expect(setItemSpy).toHaveBeenCalledWith(
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
    const instance = component as unknown as {
      resetColumns: () => void;
      resetSorts: () => void;
    };
    const resetColumnsSpy = spyOn(instance, "resetColumns");
    const resetSortsSpy = spyOn(instance, "resetSorts");
    component.reset();
    expect(resetColumnsSpy).toHaveBeenCalled();
    expect(resetSortsSpy).toHaveBeenCalled();
  });
});
