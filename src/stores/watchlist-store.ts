import {
    makeAutoObservable,
} from "mobx";
import { IWatchlistItem as IWatchlistItem } from "../interfaces/interfaces";

export class WatchlistItem implements IWatchlistItem {
    symbol: string;
    secType: string;
    description: string;
    right: string;
    bid?: number;
    ask?: number;
    strike?: number;
    expirationDate?: string;
    volume?: number;
    underlyingPrice?: number;

    constructor(symbol, secType, bid, ask, volume, underlyingPrice) {
        this.symbol = symbol;
        this.secType = secType;
        this.bid = bid;
        this.ask = ask;
        this.volume = volume;
        this.underlyingPrice = underlyingPrice;
        makeAutoObservable(this);
    }   
}

class WatchlistStore {
    watchlistItems: WatchlistItem[] = [];    
    optionItem: WatchlistItem;    

    constructor() {
        makeAutoObservable(this);
    }

    Add = (ws: WatchlistItem) => {
        const index = this.watchlistItems.indexOf(ws);
        if (index > -1) return;

        this.watchlistItems.push(ws);
    }

    Remove = (ws: WatchlistItem) => {
        const index = this.watchlistItems.indexOf(ws);
        if (index > -1) {
            this.watchlistItems.splice(index, 1);
        }
    }

    SetOptionSymbol = (ws: WatchlistItem) => {
        this.optionItem = ws;
    }
}

export default WatchlistStore;