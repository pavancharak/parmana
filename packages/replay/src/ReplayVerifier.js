export class ReplayVerifier {
    verify(original, replayed) {
        return JSON.stringify(original) === JSON.stringify(replayed);
    }
}
//# sourceMappingURL=ReplayVerifier.js.map