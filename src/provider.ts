export interface AuthorizeRes {
  budget: number;
  pubkey: string;
  signature: string;
}
export interface AuthorizeArgs {
  challenge: string;
  noBudget: boolean;
}
export interface EnableRes {
  budget: number;
  pubkey: string;
}
export interface KeysendArgs {
  amt: number,
  dest: string,
}
export interface KeysendRes {
  success: boolean;
  budget: number;
}
export interface SendPaymentRes {
  preimage: string;
}
export interface InvoiceArgs {
  amt: number,
  memo: string,
}
export interface InvoiceRes {
  paymentRequest: string;
}
export interface SignMessageArgs {
  message: string;
}
export interface SignMessageRes {
  signature: string;
}
export interface VerifyMessageArgs {
  message: string;
  signature: string;
}
export interface ReloadArgs {
  password: string;
}

export interface SphinxProvider {

  enable(): Promise<EnableRes|null>;

  topup(): Promise<EnableRes|null>;

  authorize(challenge: string): Promise<AuthorizeRes|null>;

  keysend(dest: string, amt: number): Promise<KeysendRes|null>;

  updated(): Promise<undefined|null>;

  sendPayment(paymentRequest: string): Promise<SendPaymentRes|null>;

  makeInvoice(amt: number, memo: string): Promise<InvoiceRes|null>;

  signMessage(message: string): Promise<SignMessageRes|null>;

  verifyMessage(signature: string, message: string): Promise<boolean|null>;

  reload(password: string): Promise<EnableRes|null>;

}
