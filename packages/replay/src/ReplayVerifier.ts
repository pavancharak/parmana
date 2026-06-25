export class ReplayVerifier {
  verify(original: any, replayed: any): boolean {
    return JSON.stringify(original) === JSON.stringify(replayed);
  }
}