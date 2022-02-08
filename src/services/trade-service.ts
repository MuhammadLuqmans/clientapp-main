import { CreateTradeDto } from "../stores/trades-store";
import { CreateTradePostModel, Quote, QuotePostModel, TradeViewModel } from "../swagger-clients/ibwatchdog-api-clients.service";
import AuthService from "./auth-service";
import { getTradesClient } from "./ibwatchdog-api.service";

export interface ICreateTradeData {
    account: string,
    model: CreateTradeDto
}

export const createTrade = (data: ICreateTradeData): Promise<TradeViewModel> => {
    const client = getTradesClient(AuthService.currentUser?.token);
    const trade = {
        tradeId: data.model.tradeId,
        tradeType: data.model.tradeType,
        account: data.model.account,
        parentTradeId: data.model.parentTradeId,
        legs: getChildren(data.model.legs),
        quote: {
            right: data.model.right,
            symbol: data.model.symbol,
            secType: data.model.secType,
            strike: data.model.strike,
            expirationDate: data.model.expirationDate,
        } as QuotePostModel,
        thesis: data.model.thesis,        
    } as CreateTradePostModel;

    console.dir(trade);
    return null;
    //return client.post(data.account, trade as Trade);
};

const getChildren = (legs: CreateTradeDto[]): CreateTradePostModel[] => {
    if (legs && legs.length > 0) {
        return legs.map(leg => {
            return {
                tradeId: leg.tradeId,
                tradeType: leg.tradeType,
                account: leg.account,
                parentTradeId: leg.parentTradeId,
                right: leg.right,
                symbol: leg.symbol,
                secType: leg.secType,
                strike: leg.strike,
                expirationDate: leg.expirationDate,
            } as unknown as CreateTradePostModel;
        });
    }

    return [];
};