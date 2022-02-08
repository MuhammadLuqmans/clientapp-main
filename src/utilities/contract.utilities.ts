import { Contract } from "../swagger-clients/ibwatchdog-api-clients.service";

export enum SecurityType
{
    STK = "STK", // - stock (or ETF)
    OPT = "OPT", // - option
    FUT = "FUT", // - future
    IND = "IND", // - index
    FOP = "FOP", // - futures option
    //CASH = "CASH",// - forex pair
    //BAG = "BAG", // - combo
    //WAR = "WAR", // - warrant
    //BOND = "BOND", // - bond
    //CMDTY = "CMDTY", // - commodity
    //NEWS = "NEWS", // - news
    FUND = "FUND", // - mutual fund
}

export enum YahooMappings
{
    EQUITY = "STK",    
    ETF = "STK",
    INDEX = "IND",
    FUTURES = "FUT",
    FUND = "FUND"
}

export const GetExchangeForSecurityType = (secType: SecurityType): string => {
    switch (secType) {
        case SecurityType.STK: 
        case SecurityType.OPT:
        //case SecurityType.BOND:
        //case SecurityType.CMDTY:
            return "SMART";            
        case SecurityType.FUT:
        case SecurityType.FOP:
            return "GLOBEX";
        case SecurityType.FUND:
            return "FUNDSERV";
        //case SecurityType.CASH:
          return "IDEALPRO";
        default:
          return "SMART";
      }
};

export interface ISymbol {
    exch: string
    exchDisp: string
    name: string
    symbol: string
    type: string
    typeDisp: string
    contract: Contract
}