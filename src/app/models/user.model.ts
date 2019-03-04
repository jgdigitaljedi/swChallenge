export interface IUser {
  name: string;
  friends: IUser[];
  age: number;
  weight: number;
  id?: number;
}
