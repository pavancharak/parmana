export interface KeyProvider {
  getEd25519KeyPair(): Promise<{
    publicKey: Uint8Array;
    privateKey: Uint8Array;
  }>;

  getDilithium3KeyPair(): Promise<{
    publicKey: Uint8Array;
    privateKey: Uint8Array;
  }>;
}