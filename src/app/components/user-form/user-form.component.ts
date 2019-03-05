import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { IUser } from 'src/app/models/user.model';

/**
 * Logic for user form validation and submission
 *
 * @export
 * @class UserFormComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  personForm: FormGroup;
  allUsers: IUser[];
  constructor(private _fb: FormBuilder, private _storage: StorageService) { }

  /**
   * Initializes form group and controls and subscribes to changes in storage service
   *
   * @memberof UserFormComponent
   */
  ngOnInit() {
    this._initForm();
    this._storage.users.subscribe(users => {
      this.allUsers = users;
      console.log('this.allUsers', this.allUsers);
    });
  }

  /**
   * Adds user to temporary storage service
   *
   * @param {FormGroupDirective} formDirective
   * @memberof UserFormComponent
   */
  onSubmit(formDirective: FormGroupDirective): void {
    if (this.personForm && this.personForm.value && this.personForm.valid) {
      const newUser = this.personForm.value;
      this._storage.addUser(newUser);
      formDirective.resetForm();
      this.personForm.reset();
    }
  }

  /**
   * calls private method to RE-initializes/reset form
   *
   * @memberof UserFormComponent
   */
  clearForm(): void {
    this._initForm();
  }

  /**
   * Method to clear out form
   *
   * @private
   * @memberof UserFormComponent
   */
  private _initForm(): void {
    this.personForm = this._fb.group({
      name: ['', Validators.required],
      friends: new FormControl([]),
      age: ['', [Validators.required, Validators.min(0), Validators.max(120)]], // you can't be negative age and we don't live past 120 YET
      weight: ['', [Validators.required, Validators.min(1), Validators.max(1500)]] // no one weights less than 1 or greater than 1500 YET
    });
  }
}
