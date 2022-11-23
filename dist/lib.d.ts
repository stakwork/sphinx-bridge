import { SphinxProvider, EnableRes, KeysendRes, SendPaymentRes, InvoiceRes, SignMessageRes, AuthorizeRes, SaveDataArgs, SaveDataRes, GetPersonDataRes } from "./provider";
export declare enum MSG_TYPE {
    AUTHORIZE = "AUTHORIZE",
    INFO = "INFO",
    KEYSEND = "KEYSEND",
    UPDATED = "UPDATED",
    PAYMENT = "PAYMENT",
    INVOICE = "INVOICE",
    SIGN = "SIGN",
    VERIFY = "VERIFY",
    LOGIN = "LOGIN",
    MEME = "MEME",
    MESSAGE = "MESSAGE",
    RELOAD = "RELOAD",
    LSAT = "LSAT",
    SAVEDATA = "SAVEDATA",
    GETLSAT = "GETLSAT",
    UPDATELSAT = "UPDATELSAT",
    GETPERSONDATA = "GETPERSONDATA"
}
export default class Sphinx implements SphinxProvider {
    private isEnabled;
    private active;
    private budget;
    private pubkey;
    private logging;
    enable(logging?: boolean): Promise<EnableRes | {
        budget: number;
        pubkey: string;
        application: string;
    } | null>;
    authorize(challenge: string, no_budget?: boolean, logging?: boolean): Promise<AuthorizeRes | null>;
    topup(): Promise<EnableRes | null>;
    keysend(dest: string, amt: number): Promise<KeysendRes | null>;
    updated(): Promise<null | undefined>;
    sendPayment(paymentRequest: string): Promise<SendPaymentRes | null>;
    saveLsat(paymentRequest: string, macaroon: string, issuer: string): Promise<any>;
    getLsat(): Promise<any>;
    updateLsat(identifier: string, status: string): Promise<any>;
    makeInvoice(amt: number, memo: string): Promise<InvoiceRes | null>;
    signMessage(message: string): Promise<SignMessageRes | null>;
    verifyMessage(signature: string, message: string): Promise<boolean | null>;
    reload(password: string): Promise<EnableRes | null>;
    saveGraphData(data: SaveDataArgs): Promise<SaveDataRes | null>;
    getPersonData(): Promise<GetPersonDataRes | null>;
    private postMsg;
}
