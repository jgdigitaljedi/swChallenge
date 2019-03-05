import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/**
 * Very basic dialog component to display instructions
 *
 * @export
 * @class InstructionsDialogComponent
 */
@Component({
  selector: 'app-instructions-dialog',
  templateUrl: './instructions-dialog.component.html',
  styleUrls: ['./instructions-dialog.component.scss']
})

export class InstructionsDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<InstructionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  /**
   * Handles outside click and closes dialog
   *
   * @memberof InstructionsDialogComponent
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

}
