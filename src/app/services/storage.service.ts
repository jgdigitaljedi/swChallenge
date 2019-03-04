import { Injectable } from '@angular/core';
import { IUser } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _cloneDeep from 'lodash/cloneDeep';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _userList: BehaviorSubject<IUser[]> = new BehaviorSubject([]);
  private _dataStore: { users: IUser[] };
  private _id: number;

  constructor() {
    this._dataStore = { users: [] };
    this._id = 0;
  }

  get users() {
    return this._userList.asObservable();
  }

  addUser(user: IUser): void {
    const newUser = Object.assign({}, user);
    newUser.id = this._id++;
    this._userList.next(_cloneDeep(this._dataStore.users).push(newUser));
  }
}
