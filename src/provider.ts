
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

export interface SphinxProvider {

  enable(): Promise<EnableRes|null>;

  keysend(dest: string, amt: number): Promise<KeysendRes|null>;

  updated(): Promise<undefined|null>;

}
