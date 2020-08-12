import { SphinxProvider, EnableRes, KeysendRes } from './provider';
export declare enum MSG_TYPE {
    AUTHORIZE = "AUTHORIZE",
    INFO = "INFO",
    KEYSEND = "KEYSEND",
    UPDATED = "UPDATED",
    PAYMENT = "PAYMENT",
    INVOICE = "INVOICE",
    SIGN = "SIGN",
    VERIFY = "VERIFY"
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
    keysend(dest: string, amt: number): Promise<KeysendRes | null>;
    updated(): Promise<null | undefined>;
    private postMsg;
}
