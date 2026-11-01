import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import {
  ComponentRef,
  DestroyRef,
  Directive,
  ElementRef,
  HostListener,
  ViewContainerRef,
  inject,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatTableColumnConfigComponent } from "./mat-table-column-config/mat-table-column-config.component";

@Directive({
  selector: "[matTableColumnConfigTrigger]",
  exportAs: "matTableColumnConfigTrigger",
})
export class MatTableColumnConfigTriggerDirective<T> {
  private readonly elementRef = inject(ElementRef);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);

  private overlayRef: OverlayRef | null = null;
  private _componentRef: ComponentRef<MatTableColumnConfigComponent<T>> | null =
    null;

  /**
   * Gets the reference to the MatTableColumnConfigComponent.
   *
   * @returns {ComponentRef<MatTableColumnConfigComponent<T>> | null}
   *          The reference to the MatTableColumnConfigComponent if it exists, otherwise null.
   */
  get componentRef(): ComponentRef<MatTableColumnConfigComponent<T>> | null {
    return this._componentRef;
  }

  constructor() {
    // Don't leave the overlay behind when the host is destroyed while it is open.
    this.destroyRef.onDestroy(() => this.close());
  }

  /**
   * Toggles the column configuration overlay. Clicking the trigger while the
   * overlay is open closes it instead of opening a second one.
   */
  @HostListener("click")
  onClick(): void {
    if (this.overlayRef) {
      this.close();
      return;
    }

    // Create the component portal
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef.nativeElement)
      .withFlexibleDimensions(true)
      .withViewportMargin(8)
      .withGrowAfterOpen(true)
      .withPush(true)
      .withPositions([
        {
          originX: "end",
          originY: "bottom",
          overlayX: "end",
          overlayY: "top",
        },
      ]);
    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: "cdk-overlay-transparent-backdrop",
    });
    const portal = new ComponentPortal(
      MatTableColumnConfigComponent<T>,
      this.viewContainerRef,
      this.viewContainerRef.injector
    );
    this._componentRef = this.overlayRef.attach(portal);

    this.overlayRef
      .backdropClick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.close());
  }

  private close(): void {
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this._componentRef = null;
  }
}
