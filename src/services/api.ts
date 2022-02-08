import axios from "axios";
import { ICreateUserRequest, ILoginData } from "../interfaces/interfaces";
import { SecurityType, YahooMappings } from "../utilities/contract.utilities";

//const API_URL = "http://20.52.177.21:7700/api";
const API_URL = `${process.env.REACT_APP_BACKEND_API_ENDPOINT}/api`;

/* axios.interceptors.response.use(undefined, (error) => {
    console.error(error);
}); */

axios.defaults.headers.common = {
    "X-API-Key": "WSctVOQvmm26RTGeXDpBv6intIgvXrGF8nKBIRvi",
};

const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

export interface ISearchData {    
    pattern: string;
    secType: SecurityType;
}

export const postLoginData = async (data: ILoginData) => {
    const res = await axios.post(API_URL + '/authorization/login', data);
    return res.data;
};

export const postCreateUser = async (data: ICreateUserRequest) => {
    const res = await axios.post(API_URL + '/users', data);
    return res.data;
};

/*
export const getSymbolV2 = async (data: ISearchData) => {    
    const res = await axios.get(YAHOO_FINANCE_API_URL + `autocomplete?region=US&lang=en&query=${data.pattern}`, config);
    //Kreso filter result based on the data.secType, use YahooMappings to map between IBKR & Yahoo, and return only filtered
    console.log(res);    
    if(data.secType === SecurityType.OPT) data.secType = SecurityType.STK;
    const filtered = res.data.ResultSet.Result.filter((item) => {        
        //console.log("test", mapping.localeCompare(data.secType.toUpperCase()));
        return YahooMappings[item.typeDisp.toUpperCase()].localeCompare(data.secType.toUpperCase()) === 0;        
    });

    const unique = filtered.reduce((acc, current) => {
        const x = acc.find(item => item.name.localeCompare(current.name) === -1);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

    return unique;
};*/