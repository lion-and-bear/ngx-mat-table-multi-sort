import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatSort, Sort } from "@angular/material/sort";
import {
  MatMultiSortTableDataSource,
  MultiCriterionSort,
} from "./mat-multi-sort-table-data-source";
import {
  MatMultiSortDirective,
  SORT_PERSISTENCE_ENABLED,
} from "./mat-multi-sort.directive";

interface TestData {
  id: number;
  category: string;
  name: string;
  value: number;
  comment: string | null | undefined;
}

function generateData(): TestData[] {
  return [
    {
      id: 1,
      category: "Category",
      name: "Test A",
      value: 0,
      comment: null,
    },
    {
      id: 2,
      category: "Category",
      name: "Test B",
      value: 1,
      comment: null,
    },
    {
      id: 3,
      category: "Category",
      name: "Test C",
      value: 1,
      comment: "Test comment",
    },
  ];
}

@Component({
  selector: "mat-multi-sort-test",
  changeDetection: ChangeDetectionStrategy.Eager,
  template: "",
})
class TestComponent extends MatMultiSortDirective {}

describe("MultiCriterionSort", () => {
  let data: TestData[];

  beforeEach(() => {
    data = generateData();
  });

  it("should return 0 if the sort array is empty", () => {
    const sorts: Sort[] = [];
    expect(MultiCriterionSort(data[0], data[1], sorts)).toBe(0);
  });

  it("should handle null values", () => {
    const sorts: Sort[] = [{ active: "comment", direction: "asc" }];
    expect(MultiCriterionSort(data[1], data[2], sorts)).toBe(1);
    expect(MultiCriterionSort(data[2], data[1], sorts)).toBe(-1);
  });

  it("should handle string values", () => {
    const sorts: Sort[] = [{ active: "name", direction: "asc" }];
    expect(MultiCriterionSort(data[0], data[1], sorts)).toBe(-1);
    expect(MultiCriterionSort(data[1], data[0], sorts)).toBe(1);
  });

  it("should handle numeric values", () => {
    const sorts: Sort[] = [{ active: "value", direction: "asc" }];
    expect(MultiCriterionSort(data[0], data[1], sorts)).toBe(-1);
    expect(MultiCriterionSort(data[1], data[0], sorts)).toBe(1);
    expect(MultiCriterionSort(data[1], data[2], sorts)).toBe(0);
  });

  it("should return 0 if all sort levels are equal", () => {
    const sorts: Sort[] = [
      { active: "category", direction: "asc" },
      { active: "comment", direction: "desc" },
    ];
    expect(MultiCriterionSort(data[0], data[1], sorts)).toBe(0);
  });
});

describe("MatMultiSortTableDataSource", () => {
  let fixture: ComponentFixture<TestComponent>;
  let directive: MatMultiSortDirective;
  let data: TestData[];
  let dataSource: MatMultiSortTableDataSource<TestData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, MatMultiSortDirective],
      providers: [{ provide: SORT_PERSISTENCE_ENABLED, useValue: false }],
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    directive = fixture.componentInstance;
    data = generateData();
    dataSource = new MatMultiSortTableDataSource();
  });

  it("should be created", () => {
    expect(dataSource).toBeTruthy();
    expect(dataSource.sort).toBeUndefined();
  });

  it("should set multi sort directive", () => {
    dataSource.sort = directive;
    expect(dataSource.sort).toBe(directive);
  });

  it("should not sort data if sort directive is not set", () => {
    dataSource.sortData(data, { active: "id", direction: "asc" } as MatSort);
    expect(data).toEqual(data);
  });

  it("should not sort data if no sort criteria are set", () => {
    dataSource.sort = directive;
    dataSource.sortData(data, directive);
    expect(data).toEqual(data);
  });

  it("should sort data", () => {
    directive._sorts.set([{ active: "id", direction: "desc" }]);
    dataSource.sort = directive;
    const sorted = dataSource.sortData(data, directive);
    expect(sorted.map((item) => item.id)).toEqual([3, 2, 1]);
  });
});
