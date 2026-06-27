import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { generateColumns, Test } from "../../test";
import { COLUMN_CONFIG_PERSISTENCE_ENABLED } from "../mat-table-column-config";
import { MatTableColumnConfigPersistenceService } from "../mat-table-column-config-persistence.service";
import { MatTableColumnConfigComponent } from "./mat-table-column-config.component";

describe("MatTableColumnConfigComponent", () => {
  let component: MatTableColumnConfigComponent<Test>;
  let fixture: ComponentFixture<MatTableColumnConfigComponent<Test>>;
  let service: MatTableColumnConfigPersistenceService<Test>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTableColumnConfigComponent],
      providers: [
        MatTableColumnConfigPersistenceService,
        { provide: COLUMN_CONFIG_PERSISTENCE_ENABLED, useValue: false },
      ],
    }).compileComponents();

    service = TestBed.inject(MatTableColumnConfigPersistenceService);
    service.columns = generateColumns();
    fixture = TestBed.createComponent(MatTableColumnConfigComponent<Test>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should update column order on drop", () => {
    const event = {
      previousIndex: 0,
      currentIndex: 1,
    } as CdkDragDrop<Test>;

    let orderComponent = component.columns.map((e) => e.id);
    let orderService = service.columns.map((e) => e.id);
    expect(orderComponent).toEqual(["id", "name", "value"]);
    expect(orderService).toEqual(orderComponent);
    component.onColumnDropped(event);
    orderComponent = component.columns.map((e) => e.id);
    orderService = service.columns.map((e) => e.id);
    expect(orderComponent).toEqual(["name", "id", "value"]);
    expect(orderService).toEqual(orderComponent);
  });

  it("should toggle column visibility", () => {
    expect(component.columns[1].visible).toBe(true);
    component.onColumnVisibilityChanged("name");
    expect(component.columns[1].visible).toBe(false);
    component.onColumnVisibilityChanged("name");
    expect(component.columns[1].visible).toBe(true);
  });

  it("should not change visibility for non-existent column", () => {
    const initialColumns = [...component.columns];
    component.onColumnVisibilityChanged("nonExistentColumn" as keyof Test);
    expect(component.columns).toEqual(initialColumns);
  });

  it("should set all columns to visible when selectAllColumns is called", () => {
    component.selectAllColumns();
    expect(component.columns.every((col) => col.visible)).toBe(true);
    expect(service.columns.every((col) => col.visible)).toBe(true);
  });

  it("should set all columns to hidden when deselectAllColumns is called", () => {
    component.deselectAllColumns();
    expect(component.columns.every((col) => col.visible)).toBe(false);
    expect(service.columns.every((col) => col.visible)).toBe(false);
  });

  it("should invert the column selection invertColumnSelection is called", () => {
    component.invertColumnSelection();
    expect(component.columns[0].visible).toBe(true); // id was initially false
    expect(component.columns[1].visible).toBe(false); // name was initially true
    expect(component.columns[2].visible).toBe(false); // value was initially true
  });
});
