
import { postMessage, addEventer, removeEventer } from "./postMessage";
  // @ts-ignore
import * as invoices from "invoices";
import { MSG_TYPE } from "./lib";
import { GetInfoResponse, KeysendArgs, SendPaymentResponse, WebLNProvider, UnsupportedMethodError, RequestInvoiceArgs, RequestInvoiceResponse, SignMessageResponse } from "webln";
import {VerifyMessageArgs, InvoiceArgs, SignMessageRes, SignMessageArgs} from "./provider";
import { EnableRes, InvoiceRes, SendPaymentRes } from "./provider";
  
  
  
  const APP_NAME = "Sphinx";
  
  export default class Sphinx_webln implements WebLNProvider {
    private isEnabled: boolean = false;
    private active: MSG_TYPE | null = null;
    private budget: number = 0;
    private pubkey: string = "";
    private alias: string = "User"
    private logging: boolean = false;
  
    async enable() {    
      if (this.logging) console.log("=> ENABLE!");
      if (this.isEnabled) {
        return ;
      }
      try {
        const r = await this.postMsg<EnableRes>(MSG_TYPE.AUTHORIZE);
        const hasBudget = r.budget || r.budget === 0;
        if (hasBudget && r.pubkey) {
          this.isEnabled = true;
          this.budget = r.budget;
          this.pubkey = r.pubkey;
          return;
        } else {
          throw Error("Budget or pubkey not detected");
        }
      } catch (e) {
        if (this.logging) console.log(e);
        return Promise.reject(e);
      }
    }

    async getInfo(): Promise<GetInfoResponse> {
        if (!this.isEnabled) {
            return Promise.reject("WebLn is not enabled")
        } else {
            return {
                node: {
                    alias: this.alias,
                    pubkey: this.pubkey
                }
            }
        }
    }
  
  
    async sendPayment(paymentRequest: string): Promise<SendPaymentResponse> {
      if (this.logging) console.log("=> SEND PAYMENT");
      if (!this.isEnabled) Promise.reject("WebLn is not enabled");
      try {
        const r = await this.postMsg<SendPaymentRes, InvoiceRes>(
          MSG_TYPE.PAYMENT,
          { paymentRequest }
        );
        return {
            preimage: r.preimage
        }
      } catch (e) {
        if (this.logging) console.log(e);
        return Promise.reject("Payment failed for payment request: ${payment_request}")
      }
    }
  
    async keysend(args: KeysendArgs): Promise<SendPaymentResponse> {
      throw  new UnsupportedMethodError('Kesend is not supported yet!')
     }

  
    async makeInvoice(args: string | number | RequestInvoiceArgs): Promise<RequestInvoiceResponse> {
      if (this.logging) console.log("=> MAKE INVOICE");
      if (!this.isEnabled) return Promise.reject("WebLn is not enabled");
      const arg = args as RequestInvoiceArgs;
      if (!arg.amount || !arg.defaultMemo) {
        return Promise.reject("WebLn makeInvoice: Incorrect arguments")
      }
      try {
        const r = await this.postMsg<InvoiceRes, InvoiceArgs>(MSG_TYPE.INVOICE, {
          amt: + arg.amount,
          memo: arg.defaultMemo,
        });
        return r;
      } catch (e) {
        if (this.logging) console.log(e);
        return Promise.reject(e);
      }
    }
  
    async signMessage(message: string): Promise<SignMessageResponse> {
      if (this.logging) console.log("=> SIGN MESSAGE");
      if (!this.isEnabled) return Promise.reject("WebLn is not enabled");
      try {
        const r = await this.postMsg<SignMessageRes, SignMessageArgs>(
          MSG_TYPE.SIGN,
          { message }
        );
        return {signature: r.signature, message}
      } catch (e) {
        if (this.logging) console.log(e);
        return Promise.reject(e)
      }
    }
  
    async verifyMessage(signature: string, message: string) {
      if (this.logging) console.log("=> VERIFY MESSAGE");
      if (!this.isEnabled) return Promise.reject("WebLn is not enabled")
      try {
        const r = await this.postMsg<boolean, VerifyMessageArgs>(MSG_TYPE.SIGN, {
          signature,
          message,
        });
      } catch (e) {
        if (this.logging) console.log(e);
        return Promise.reject(e)
      }
    }
  
    // Internal prompt handler
    private postMsg<R = undefined, T = undefined>(
      type: MSG_TYPE,
      args?: T
    ): Promise<R> {
      var self = this;
      if (self.active) {
        Promise.reject(new Error("User is busy"));
      }
      self.active = type;
      return new Promise((resolve, reject) => {
        postMessage({
          application: APP_NAME,
          type,
          ...(args || {}),
        });
        function handleWindowMessage(ev: MessageEvent) {
          if (!ev.data || ev.data.application !== APP_NAME) {
            return;
          }
          if (ev.data.error) {
            self.active = null;
            reject(ev.data.error);
          } else {
            self.active = null;
            resolve(ev.data);
          }
          removeEventer(handleWindowMessage);
        }
  
        addEventer(handleWindowMessage);
      });
    }
  }
  