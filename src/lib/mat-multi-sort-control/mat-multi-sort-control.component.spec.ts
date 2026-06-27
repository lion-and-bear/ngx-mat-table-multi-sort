import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Sort } from "@angular/material/sort";
import { vi } from "vitest";
import { MatMultiSortControlComponent } from "./mat-multi-sort-control.component";

describe("MatMultiSortControlComponent", () => {
  let component: MatMultiSortControlComponent;
  let fixture: ComponentFixture<MatMultiSortControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatMultiSortControlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatMultiSortControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call toggleSortDirection on sort when onChipClick is called", () => {
    const sortDirectiveSpy = { toggleSortDirection: vi.fn() };
    component.sort = sortDirectiveSpy as never;

    const sortId = "testSortId";
    component.onChipClick(sortId);

    expect(sortDirectiveSpy.toggleSortDirection).toHaveBeenCalledWith(sortId);
  });

  it("should not throw an error if sort is undefined when onChipClick is called", () => {
    component.sort = undefined;

    expect(() => component.onChipClick("testSortId")).not.toThrow();
  });

  it("should call removeSortLevel on sort when onChipRemoved is called", () => {
    const sortDirectiveSpy = { removeSortLevel: vi.fn() };
    component.sort = sortDirectiveSpy as never;

    const sortId = "testSortId";
    component.onChipRemoved(sortId);

    expect(sortDirectiveSpy.removeSortLevel).toHaveBeenCalledWith(sortId);
  });

  it("should not throw an error if sort is undefined when onChipRemoved is called", () => {
    component.sort = undefined;

    expect(() => component.onChipRemoved("testSortId")).not.toThrow();
  });

  it("should call reorderSortLevel on sort when onDrop is called", () => {
    const sortDirectiveSpy = { reorderSortLevel: vi.fn() };
    component.sort = sortDirectiveSpy as never;

    const event = {
      previousIndex: 0,
      currentIndex: 1,
    } as CdkDragDrop<Sort[]>;

    component.onDrop(event);

    expect(sortDirectiveSpy.reorderSortLevel).toHaveBeenCalledWith(
      event.previousIndex,
      event.currentIndex
    );
  });

  it("should not throw an error if sort is undefined when onDrop is called", () => {
    component.sort = undefined;

    const event = {
      previousIndex: 0,
      currentIndex: 1,
    } as CdkDragDrop<Sort[]>;

    expect(() => component.onDrop(event)).not.toThrow();
  });

  it("should call clearSorting on sort when onClearClick is called", () => {
    const sortDirectiveSpy = { clearSorting: vi.fn() };
    component.sort = sortDirectiveSpy as never;
    component.onClearClick();

    expect(sortDirectiveSpy.clearSorting).toHaveBeenCalled();
  });

  it("should not throw an error if sort is undefined when onClearClick is called", () => {
    component.sort = undefined;

    expect(() => component.onClearClick()).not.toThrow();
  });
});
