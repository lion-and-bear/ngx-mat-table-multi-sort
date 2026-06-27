import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { vi } from "vitest";
import { Test } from "../test";
import { MatTableColumnConfigTriggerDirective } from "./mat-table-column-config-trigger.directive";

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: "",
})
export class TestComponent extends MatTableColumnConfigTriggerDirective<Test> {}

describe("MatTableColumnConfigTriggerDirective", () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let overlay: Overlay;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [Overlay],
    }).compileComponents();

    overlay = TestBed.inject(Overlay);
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should create and dismiss overlay", fakeAsync(() => {
    expect(component.componentRef).toBeNull();
    let overlayRef!: OverlayRef;
    const originalCreate = overlay.create.bind(overlay);
    const createSpy = vi
      .spyOn(overlay, "create")
      .mockImplementation((config) => {
        overlayRef = originalCreate(config);
        return overlayRef;
      });
    component.onClick();
    expect(createSpy).toHaveBeenCalled();
    const disposeSpy = vi.spyOn(overlayRef, "dispose");
    expect(overlayRef.hasAttached()).toBe(true);
    expect(overlayRef.backdropElement).not.toBeNull();
    expect(component.componentRef).not.toBeNull();
    overlayRef.backdropElement!.click();
    tick();
    expect(component.componentRef).toBeNull();
    expect(disposeSpy).toHaveBeenCalled();
  }));
});
