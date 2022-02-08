export enum OrderAction {
    BUY = "BUY",
    SELL = "SELL"
}

export enum OrderSize {
    TWENTYFIVE = 25,
    FIFTY = 50,
    SEVENTYFIVE = 75,
    HUNDRED = 100
}

export const calcQuantity = (midPrice: number, multiplier: number, percentageToBuyOrSell: number) => {        
    multiplier = multiplier === 0 ? 1 : multiplier;
    midPrice = midPrice * multiplier;
    const money = percentageToBuyOrSell * 10;    
    const qty = Math.round(money / midPrice);
    if(qty <= 1) return 1;
    return qty;
};