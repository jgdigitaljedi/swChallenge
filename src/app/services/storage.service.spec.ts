import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StorageService = TestBed.get(StorageService);
    expect(service).toBeTruthy();
  });

  it('should add and get users', () => {
    const service: StorageService = TestBed.get(StorageService);
    const user = { name: 'Joey', age: 38, weight: 175, friends: [] };
    service.addUser(user);
    service.users.subscribe(users => {
      expect(users[0].name).toEqual(user.name);
    });
  });
});
