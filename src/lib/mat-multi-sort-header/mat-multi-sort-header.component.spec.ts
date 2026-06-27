import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatSort } from "@angular/material/sort";
import { vi } from "vitest";
import { MatMultiSortDirective } from "../mat-multi-sort.directive";
import { MatMultiSortHeaderComponent } from "./mat-multi-sort-header.component";

describe("MatMultiSortHeaderComponent", () => {
  let component: MatMultiSortHeaderComponent;
  let fixture: ComponentFixture<MatMultiSortHeaderComponent>;
  let sort: MatMultiSortDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatMultiSortHeaderComponent],
      providers: [
        MatMultiSortDirective,
        { provide: MatSort, useExisting: MatMultiSortDirective },
      ],
    }).compileComponents();

    sort = TestBed.inject(MatMultiSortDirective);
    fixture = TestBed.createComponent(MatMultiSortHeaderComponent);
    component = fixture.componentInstance;
    component.id = "test";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should not trigger sort when the header is disabled", () => {
    component.disabled = true;
    const spy = vi.spyOn(sort, "sort");
    component._toggleOnInteraction();
    expect(spy).not.toHaveBeenCalled();
  });

  it("should not trigger sort when sorting is disabled on the directive", () => {
    sort.disabled = true;
    component.disabled = false;
    const spy = vi.spyOn(sort, "sort");
    component._toggleOnInteraction();
    expect(spy).not.toHaveBeenCalled();
  });

  it("should set recentlyCleared to null when the column was not previously sorted", () => {
    component.disabled = false;
    vi.spyOn(component, "_isSorted").mockReturnValue(false);
    const sortSpy = vi.spyOn(sort, "sort");
    const recentlyClearedSpy = vi.spyOn(component["_recentlyCleared"], "set");
    component._toggleOnInteraction();
    expect(sortSpy).toHaveBeenCalled();
    expect(recentlyClearedSpy).toHaveBeenCalledWith(null);
  });

  it("should set recentlyCleared to null when the column is now sorted", () => {
    component.disabled = false;
    vi.spyOn(component, "_isSorted").mockReturnValue(true);
    const sortSpy = vi.spyOn(sort, "sort");
    const recentlyClearedSpy = vi.spyOn(component["_recentlyCleared"], "set");
    component._toggleOnInteraction();
    expect(sortSpy).toHaveBeenCalled();
    expect(recentlyClearedSpy).toHaveBeenCalledWith(null);
  });

  it("should set recentlyCleared to the previous sort direction when the column is no longer sorted", () => {
    component.disabled = false;
    let callCount = 0;
    vi.spyOn(component, "_isSorted").mockImplementation(() => {
      return ++callCount % 2 === 1;
    });
    vi.spyOn(component, "sortDirection", "get").mockReturnValue("asc");
    const sortSpy = vi.spyOn(sort, "sort");
    const recentlyClearedSpy = vi.spyOn(component["_recentlyCleared"], "set");
    component._toggleOnInteraction();
    expect(sortSpy).toHaveBeenCalled();
    expect(recentlyClearedSpy).toHaveBeenCalledWith("asc");
  });
});
