export interface IPriceFormula {
  max?: number;
  formula?: string;
}

export class PriceFormula implements IPriceFormula {
  constructor(public max?: number, public formula?: string) {}
}
