import { GetInfoResponse, KeysendArgs, SendPaymentResponse, WebLNProvider, RequestInvoiceArgs, RequestInvoiceResponse, SignMessageResponse } from "webln";
export default class Sphinx_webln implements WebLNProvider {
    private isEnabled;
    private active;
    private budget;
    private pubkey;
    private alias;
    private logging;
    enable(): Promise<undefined>;
    getInfo(): Promise<GetInfoResponse>;
    sendPayment(paymentRequest: string): Promise<SendPaymentResponse>;
    keysend(args: KeysendArgs): Promise<SendPaymentResponse>;
    makeInvoice(args: string | number | RequestInvoiceArgs): Promise<RequestInvoiceResponse>;
    signMessage(message: string): Promise<SignMessageResponse>;
    verifyMessage(signature: string, message: string): Promise<undefined>;
    private postMsg;
}
