interface INode {
  id: string;
  group: number;
  weight?: number;
  age?: number;
  name?: string;
  x?: number;
  y?: number;
}

interface ILink {
  source: string;
  target: string;
}

export interface IGraph {
  nodes: INode[];
  links: ILink[];
}