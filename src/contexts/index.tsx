import { createContext } from "react";
import ModalStore from "../stores/modal-store";
import TradeStore from "../stores/trades-store";
import WatchlistStore from "../stores/watchlist-store";

export const storesContext = createContext({
    WatchlistStore: new WatchlistStore(),
    TradeStore: new TradeStore(),
    ModalStore: new ModalStore()
});