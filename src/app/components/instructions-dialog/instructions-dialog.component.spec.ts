import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionsDialogComponent } from './instructions-dialog.component';
import { MatDialogModule, MatListModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

describe('InstructionsDialogComponent', () => {
  let component: InstructionsDialogComponent;
  let fixture: ComponentFixture<InstructionsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatListModule
      ],
      declarations: [InstructionsDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: {} }, { provide: MAT_DIALOG_DATA, useValue: {} }]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
