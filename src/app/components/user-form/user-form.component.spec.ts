import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule, MatCard } from '@angular/material/card';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { UserFormComponent } from './user-form.component';
import { InstructionsDialogComponent } from '../instructions-dialog/instructions-dialog.component';
import { StorageService } from 'src/app/services/storage.service';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let injectedService: StorageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDialogModule,
        MatListModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      declarations: [UserFormComponent, InstructionsDialogComponent],
      providers: [StorageService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    injectedService = TestBed.get(StorageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a user and have allUsers automatically updated', () => {
    component.personForm.get('name').setValue('Joey');
    component.personForm.get('age').setValue(38);
    component.personForm.get('weight').setValue(171);
    component.personForm.get('friends').setValue([]);
    const mockForm = component.formDir;
    component.onSubmit(mockForm);
    expect(component.allUsers.length).toEqual(1);
  });
});
