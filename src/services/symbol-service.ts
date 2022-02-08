import { IsAny  } from "react-hook-form";
import { SymbolClient, SymbolSearchResult } from "../swagger-clients/ibwatchdog-api-clients.service";
import { SecurityType } from "../utilities/contract.utilities";
import AuthService from "./auth-service";
import { getSymbolClient } from "./ibwatchdog-api.service";

export interface ISearchData {
    account: string,
    pattern: string,
    secType: SecurityType,
}

export const searchSymbol = (data: ISearchData): Promise<SymbolSearchResult> => {
    const access_token = AuthService.currentUser?.token;
    const client = getSymbolClient(access_token);
    return client.search(data.account, data.pattern, data.secType).then((result: SymbolSearchResult) => {
        console.log("here: ", result);
        return result;
    }).catch((error) => {
        console.log(error);
        return null as unknown as SymbolSearchResult;
    });
};