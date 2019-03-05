import { IUser } from 'src/app/models/user.model';

export interface INode {
  id: string;
  group: number;
  weight?: number;
  age?: number;
  name?: string;
  x?: number;
  y?: number;
}

export interface ILink {
  source: string;
  target: string;
}

export interface IGraph {
  nodes: INode[];
  links: ILink[];
}

export interface IColor {
  key: number;
  value: string;
  range: string;
}

export interface IChartData {
  source: number;
  name: string;
  targets: IUser[];
  weight: number;
  age: number;
}