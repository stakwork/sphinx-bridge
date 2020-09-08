import { SphinxProvider, EnableRes, KeysendRes, SendPaymentRes, InvoiceRes, SignMessageRes, AuthorizeRes } from './provider';
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
    RELOAD = "RELOAD"
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
    makeInvoice(amt: number, memo: string): Promise<InvoiceRes | null>;
    signMessage(message: string): Promise<SignMessageRes | null>;
    verifyMessage(signature: string, message: string): Promise<boolean | null>;
    reload(password: string): Promise<EnableRes | null>;
    private postMsg;
}
