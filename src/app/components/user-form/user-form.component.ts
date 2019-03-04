import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';

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
  }

  onSubmit(): void {
    if (this.personForm && this.personForm.value) {
      console.log('form', this.personForm);
      // @TODO: make call to service here to store
      this._storage.addUser(this.personForm.value);
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
      friends: this._fb.array([]),
      age: ['', Validators.required],
      weight: ['', Validators.required]
    });
  }
}
