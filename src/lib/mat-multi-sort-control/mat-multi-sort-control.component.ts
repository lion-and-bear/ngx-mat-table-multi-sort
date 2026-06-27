import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DropListOrientation,
} from "@angular/cdk/drag-drop";
import {
  ANIMATION_MODULE_TYPE,
  Component,
  inject,
  Input,
  ChangeDetectionStrategy,
} from "@angular/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { Sort } from "@angular/material/sort";
import { MatMultiSortDirective } from "../mat-multi-sort.directive";

@Component({
  selector: "mat-multi-sort-control",
  imports: [CdkDropList, CdkDrag, MatChipsModule, MatIconModule],
  templateUrl: "./mat-multi-sort-control.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./mat-multi-sort-control.component.scss",
})
export class MatMultiSortControlComponent {
  /**
   * Injects the ANIMATION_MODULE_TYPE token, which indicates the type of animation module being used.
   * This is an optional dependency and may be undefined if the animation module is not provided.
   *
   * @readonly
   * @type {ANIMATION_MODULE_TYPE | undefined}
   */
  readonly _animationModule = inject(ANIMATION_MODULE_TYPE, { optional: true });

  /**
   * Specifies the orientation of the drop list.
   * Can be either "horizontal" or "vertical".
   *
   * @type {DropListOrientation}
   * @default "horizontal"
   */
  @Input() orientation: DropListOrientation = "horizontal";

  /**
   * An optional input property that accepts an instance of `MatMultiSortDirective`.
   * This directive is used to control the sorting behavior of the table.
   */
  @Input() sort?: MatMultiSortDirective;

  /**
   * Retrieves the array of Sort objects from the current sort instance.
   * If the sort instance is not defined, it returns an empty array.
   *
   * @returns {Sort[]} An array of Sort objects or an empty array if no sorts are defined.
   */
  get sorts(): Sort[] {
    return this.sort?._sorts() || [];
  }

  /**
   * Handles the click event on a sort chip.
   * Toggles the sort direction for the given sort ID.
   *
   * @param id - The identifier of the sort field to toggle.
   * @returns void
   */
  onChipClick(id: string): void {
    this.sort?.toggleSortDirection(id);
  }

  /**
   * Handles the event when a sort chip is removed.
   *
   * @param id - The identifier of the sort level to be removed.
   * @returns void
   */
  onChipRemoved(id: string): void {
    this.sort?.removeSortLevel(id);
  }

  /**
   * Clears the current sorting applied to the table.
   *
   * @param id - The identifier of the sort level to be removed.
   * @returns void
   */
  onClearClick(): void {
    this.sort?.clearSorting();
  }

  /**
   * Handles the drop event for drag-and-drop sorting.
   * Reorders the sort levels based on the previous and current indices.
   *
   * @param event - The drag-and-drop event containing the previous and current indices of the sort order.
   */
  onDrop(event: CdkDragDrop<Sort[]>): void {
    this.sort?.reorderSortLevel(event.previousIndex, event.currentIndex);
  }
}
