import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { IUser } from 'src/app/models/user.model';
import { formDirectiveProvider } from '@angular/forms/src/directives/reactive_directives/form_group_directive';

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
  allUsers;
  constructor(private _fb: FormBuilder, private _storage: StorageService) {}

  ngOnInit() {
    this._initForm();
    this._storage.users.subscribe(users => {
      this.allUsers = users;
      console.log('this.allUsers', this.allUsers);
    });
  }

  onSubmit(formDirective): void {
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

  addToFriends() {}

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
      age: ['', Validators.required],
      weight: ['', Validators.required]
    });
  }
}
