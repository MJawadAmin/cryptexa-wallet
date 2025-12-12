declare module 'hdkey' {
  export default class HDKey {
    publicKey: Buffer;
    privateKey: Buffer;
    chainCode: Buffer;

    constructor();

    static fromMasterSeed(seed: Buffer): HDKey;
    derive(path: string): HDKey;
  }
}
