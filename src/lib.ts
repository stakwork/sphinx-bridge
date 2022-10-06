import {
  LsatRes,
  SendLsatRes,
  SphinxProvider,
  EnableRes,
  KeysendRes,
  KeysendArgs,
  SendPaymentRes,
  InvoiceRes,
  InvoiceArgs,
  SignMessageRes,
  SignMessageArgs,
  VerifyMessageArgs,
  AuthorizeRes,
  AuthorizeArgs,
  ReloadArgs,
  SaveDataArgs,
  SaveDataRes,
  GetLsatRes,
  UpdateLsatArgs,
  UpdateLsatRes,
} from "./provider";
import { postMessage, addEventer, removeEventer } from "./postMessage";
// @ts-ignore
import * as invoices from "invoices";

// request layout: toggle vs sidebar

export enum MSG_TYPE {
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
}

const APP_NAME = "Sphinx";

export default class Sphinx implements SphinxProvider {
  private isEnabled: boolean = false;
  private active: MSG_TYPE | null = null;
  private budget: number = 0;
  private pubkey: string = "";
  private logging: boolean = false;

  async enable(logging?: boolean) {
    if (logging) this.logging = true;
    if (this.logging) console.log("=> ENABLE!");
    if (this.isEnabled) {
      return {
        budget: this.budget,
        pubkey: this.pubkey,
        application: APP_NAME,
      };
    }
    try {
      const r = await this.postMsg<EnableRes>(MSG_TYPE.AUTHORIZE);
      const hasBudget = r.budget || r.budget === 0;
      if (hasBudget && r.pubkey) {
        this.isEnabled = true;
        this.budget = r.budget;
        this.pubkey = r.pubkey;
        return r;
      }
    } catch (e) {
      if (this.logging) console.log(e);
    }
    return null;
  }

  async authorize(challenge: string, no_budget?: boolean, logging?: boolean) {
    if (logging) this.logging = true;
    if (this.logging) console.log("=> AUTHORIZE!");
    try {
      const noBudget = no_budget || false;
      const r = await this.postMsg<AuthorizeRes, AuthorizeArgs>(
        MSG_TYPE.AUTHORIZE,
        {
          challenge,
          noBudget,
        }
      );
      const hasBudget = r.budget || r.budget === 0;
      if ((noBudget || hasBudget) && r.pubkey) {
        this.isEnabled = true;
        this.budget = r.budget || 0;
        this.pubkey = r.pubkey;
        return r;
      }
    } catch (e) {
      if (this.logging) console.log(e);
    }
    return null;
  }

  async topup() {
    if (this.logging) console.log("=> TOP UP");
    try {
      const r = await this.postMsg<EnableRes>(MSG_TYPE.AUTHORIZE);
      const hasBudget = r.budget || r.budget === 0;
      if (hasBudget && r.pubkey) {
        this.budget = r.budget;
        this.pubkey = r.pubkey;
        return r;
      }
    } catch (e) {
      if (this.logging) console.log(e);
    }
    return null;
  }

  async keysend(dest: string, amt: number) {
    if (this.logging) console.log("=> KEYSEND");
    if (!this.isEnabled) return null;
    if (!dest || !amt) return null;
    if (dest.length !== 66) return null;
    if (amt < 1) return null;
    if (amt > this.budget) return null;
    try {
      const args: KeysendArgs = { dest, amt };
      const r = await this.postMsg<KeysendRes, KeysendArgs>(
        MSG_TYPE.KEYSEND,
        args
      );
      if (r && r.success) {
        this.budget = this.budget - amt;
        r.budget = this.budget;
      }
      return r;
    } catch (e) {
      if (this.logging) console.log(e);
      return null;
    }
  }

  async updated() {
    if (this.logging) console.log("=> UDPATED");
    if (!this.isEnabled) return null;
    try {
      const r = await this.postMsg(MSG_TYPE.UPDATED);
      return r;
    } catch (e) {
      if (this.logging) console.log(e);
      return null;
    }
  }

  async sendPayment(paymentRequest: string) {
    if (this.logging) console.log("=> SEND PAYMENT");
    if (!this.isEnabled) return null;
    try {
      const r = await this.postMsg<SendPaymentRes, InvoiceRes>(
        MSG_TYPE.PAYMENT,
        { paymentRequest }
      );
      return r;
    } catch (e) {
      if (this.logging) console.log(e);
      return null;
    }
  }

  async saveLsat(paymentRequest: string, macaroon: string, issuer: string) {
    if (this.logging) console.log("=> SAVE LSAT");
    try {
      const r = await this.postMsg<SendLsatRes, LsatRes>(MSG_TYPE.LSAT, {
        paymentRequest,
        macaroon,
        issuer,
      });
      return r;
    } catch (e) {
      if (this.logging) console.log(e);
      return e;
    }
  }

  async getLsat() {
    if (this.logging) console.log("=> GET LSAT");
    if (!this.isEnabled) return null;
    try {
      const r = await this.postMsg<GetLsatRes>(MSG_TYPE.GETLSAT);
      return r;
    } catch (e) {
      if (this.logging) console.log(e);
      return e;
    }
  }

  async updateLsat(identifier: string, status: string) {
    if (this.logging) console.log("=> GET LSAT");
    if (!this.isEnabled) return null;
    try {
      const r = await this.postMsg<UpdateLsatRes, UpdateLsatArgs>(
        MSG_TYPE.UPDATELSAT,
        { identifier, status }
      );
      return r;
    } catch (e) {
      if (this.logging) console.log(e);
      return e;
    }
  }

  async makeInvoice(amt: number, memo: string) {
    if (this.logging) console.log("=> MAKE INVOICE");
    if (!this.isEnabled) return null;
    try {
      const r = await this.postMsg<InvoiceRes, InvoiceArgs>(MSG_TYPE.INVOICE, {
        amt,
        memo,
      });
      return r;
    } catch (e) {
      if (this.logging) console.log(e);
      return null;
    }
  }

  async signMessage(message: string) {
    if (this.logging) console.log("=> SIGN MESSAGE");
    if (!this.isEnabled) return null;
    try {
      const r = await this.postMsg<SignMessageRes, SignMessageArgs>(
        MSG_TYPE.SIGN,
        { message }
      );
      return r;
    } catch (e) {
      if (this.logging) console.log(e);
      return null;
    }
  }

  async verifyMessage(signature: string, message: string) {
    if (this.logging) console.log("=> VERIFY MESSAGE");
    if (!this.isEnabled) return null;
    try {
      const r = await this.postMsg<boolean, VerifyMessageArgs>(MSG_TYPE.SIGN, {
        signature,
        message,
      });
      return r;
    } catch (e) {
      if (this.logging) console.log(e);
      return null;
    }
  }

  async reload(password: string) {
    if (this.logging) console.log("=> RELOAD");
    try {
      const r = await this.postMsg<EnableRes, ReloadArgs>(MSG_TYPE.RELOAD, {
        password,
      });
      const hasBudget = r.budget || r.budget === 0;
      if (hasBudget && r.pubkey) {
        this.isEnabled = true;
        this.budget = r.budget;
        this.pubkey = r.pubkey;
        return r;
      }
    } catch (e) {
      if (this.logging) console.log(e);
    }
    return null;
  }

  async saveGraphData(data: SaveDataArgs) {
    if (this.logging) console.log("=> SAVEDATA");
    if (!this.isEnabled) return null;
    try {
      const r = await this.postMsg<SaveDataRes, { data: SaveDataArgs }>(
        MSG_TYPE.SAVEDATA,
        {
          data: { type: data.type, metaData: data.metaData },
        }
      );
      return r;
    } catch (error) {
      if (this.logging) console.log(error);
      return null;
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
