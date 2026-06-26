import { createVerify } from "crypto";

export class OverrideVerifier {
  /**
   * Verifies that override was signed by a trusted authority
   *
   * @param data - original transaction data (stringified JSON)
   * @param signature - base64 signature from authority
   * @param publicKey - authority public key (PEM format)
   */
  static verify(
    data: string,
    signature: string,
    publicKey: string
  ): boolean {
    try {
      const verifier = createVerify("SHA256");

      // IMPORTANT: same data must be signed
      verifier.update(data);
      verifier.end();

      return verifier.verify(publicKey, signature, "base64");
    } catch {
      return false;
    }
  }
}