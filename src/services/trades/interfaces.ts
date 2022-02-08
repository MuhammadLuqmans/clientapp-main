export interface IInstrument { //obsolete
  id: number;
  symbol: string;
  tactic: 'S' | 'O';
  thesis: string;
  type: string;
  stockUnderlying: string;
}

export enum OrderType { //obsolete
  STOCK = 'STOCK',
  OPTION = 'OPTION',
  INDEX = 'INDEX',
}
