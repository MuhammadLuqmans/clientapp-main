import {    
    makeAutoObservable,    
} from "mobx";

class ModalState {
    isTakeProfitOpen: boolean;
    isStopLossOpen: boolean;
    isTrailingStopLossOpen: boolean;   

    constructor() {        
        makeAutoObservable(this);
    }
}

class ModalStore {    
    modalState: ModalState;

    constructor(){
        makeAutoObservable(this);
    }
    
    SetTakeProfitModal = (isOpen: boolean) => {
        this.modalState.isTakeProfitOpen = isOpen;
    }

    SetStopLossModal = (isOpen: boolean) => {
        this.modalState.isStopLossOpen = isOpen;
    }

    SetTraillingStopLossModal = (isOpen: boolean) => {
        this.modalState.isTrailingStopLossOpen = isOpen;
    }
}

export default ModalStore;