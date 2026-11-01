import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TableColumn } from "../mat-table-column-config";
import { MatTableColumnConfigPersistenceService } from "../mat-table-column-config-persistence.service";

@Component({
  selector: "mat-table-column-config",
  imports: [
    CdkDropList,
    CdkDrag,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: "./mat-table-column-config.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./mat-table-column-config.component.scss",
})
export class MatTableColumnConfigComponent<T> {
  private readonly persistenceService = inject<
    MatTableColumnConfigPersistenceService<T>
  >(MatTableColumnConfigPersistenceService);

  /**
   * The current table columns configuration, read from the persistence service's signal.
   *
   * @returns {TableColumn<T>[]} An array of table columns.
   */
  get columns(): TableColumn<T>[] {
    return this.persistenceService.columnsSignal();
  }

  /**
   * Handles the event when a dragged column is dropped.
   * This method updates the order of columns based on the drag and drop action.
   *
   * @param event - The event object containing information about the drag and drop action.
   */
  onColumnDropped(event: CdkDragDrop<T>): void {
    const columns = [...this.columns];
    moveItemInArray(columns, event.previousIndex, event.currentIndex);
    this.persistenceService.columns = columns;
  }

  /**
   * Toggles the visibility of a column based on its identifier.
   *
   * @param id - The identifier of the column whose visibility is to be changed.
   */
  onColumnVisibilityChanged(id: keyof T): void {
    if (!this.columns.some((column) => column.id === id)) return;

    this.updateVisibility((column) =>
      column.id === id ? !column.visible : column.visible
    );
  }

  /**
   * Sets all columns in the table to visible and updates the persisted column configuration.
   *
   * Iterates through the `columns` array, setting each column's `visible` property to `true`.
   * Then, updates the `persistenceService.columns` property to reflect the new visibility state.
   */
  selectAllColumns(): void {
    this.updateVisibility(() => true);
  }

  /**
   * Deselects all columns by setting their `visible` property to `false`.
   * Updates the persisted columns state via the `persistenceService`.
   *
   * @remarks
   * This method iterates through all columns in the `columns` array and hides each one.
   * After updating the visibility, it synchronizes the state with the persistence service.
   */
  deselectAllColumns(): void {
    this.updateVisibility(() => false);
  }

  /**
   * Inverts the visibility state of all columns in the `columns` array.
   * Each column's `visible` property is toggled between `true` and `false`.
   * After updating the visibility, the modified columns array is assigned to the persistence service
   * to persist the new visibility state.
   */
  invertColumnSelection(): void {
    this.updateVisibility((column) => !column.visible);
  }

  private updateVisibility(visible: (column: TableColumn<T>) => boolean): void {
    this.persistenceService.columns = this.columns.map((column) => ({
      ...column,
      visible: visible(column),
    }));
  }
}
