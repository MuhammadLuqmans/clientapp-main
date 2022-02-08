import { makeAutoObservable } from 'mobx';
import { TradeType } from '../swagger-clients/ibwatchdog-api-clients.service';
import { makeId } from '../utilities/utils';

export class CreateTradeDto {
  constructor() {
    makeAutoObservable(this);
  }

  tradeId: string;
  tradeType?: TradeType;
  account: string;
  symbol: string;
  description: string;
  secType: string;  
  parentTradeId?: string;
  displayHierarchy?: string[];
  legs?: CreateTradeDto[];
  right?: string;  
  strike?: number;
  expirationDate?: string;
  thesis?: string;
}

class TradeStore {
  selectedTrade: CreateTradeDto;
  trades: CreateTradeDto[];

  constructor() {
    makeAutoObservable(this);
  }

  SetSelectedTrade = (trade: CreateTradeDto) => {
    this.selectedTrade = trade;
  };

  AddTradeLeg = (trade: CreateTradeDto) => {
    this.selectedTrade.legs.push(trade);
  };

  FindTradeById = (tradeId: string): CreateTradeDto => {
    if (this.selectedTrade.tradeId === tradeId) return this.selectedTrade;
    return this.selectedTrade.legs.find(element => element.tradeId === tradeId);
  }

  RemoveTradeById = (tradeId: string) => {
    if (this.selectedTrade === undefined) {
      return;
    }

    if (this.selectedTrade.tradeId === tradeId) {
      this.selectedTrade = undefined;
    } else if (
      this.selectedTrade.legs !== null &&
      this.selectedTrade.legs.length > 0
    ) {
      const trade = this.selectedTrade.legs.filter(
        (tr) => tr.tradeId === tradeId
      );
      if (trade.length > 0) {
        const index = this.selectedTrade.legs.indexOf(trade[0]);
        if (index > -1) {
          this.selectedTrade.legs.splice(index, 1);
        }
      }
    }
  };
}

export default TradeStore;
