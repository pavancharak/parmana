"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageEngine = void 0;
var AppendOnlyLedger_js_1 = require("./ledger/AppendOnlyLedger.js");
var ExecutionRepository_js_1 = require("./repositories/ExecutionRepository.js");
var VerificationRepository_js_1 = require("./repositories/VerificationRepository.js");
var CryptoProofRepository_js_1 = require("./repositories/CryptoProofRepository.js");
/**
 * StorageEngine is the orchestration layer for all persistence.
 *
 * It ensures:
 * - Append-only writes
 * - Separation of execution / verification / crypto evidence
 * - Deterministic storage behavior
 */
var StorageEngine = /** @class */ (function () {
    function StorageEngine() {
        this.ledger = new AppendOnlyLedger_js_1.AppendOnlyLedger();
        this.executionRepo = new ExecutionRepository_js_1.ExecutionRepository();
        this.verificationRepo = new VerificationRepository_js_1.VerificationRepository();
        this.cryptoRepo = new CryptoProofRepository_js_1.CryptoProofRepository();
    }
    /**
     * Record execution event
     */
    StorageEngine.prototype.recordExecution = function (entry) {
        this.ledger.append(entry);
        this.executionRepo.save(entry);
    };
    /**
     * Record verification event
     */
    StorageEngine.prototype.recordVerification = function (entry) {
        this.ledger.append(entry);
        this.verificationRepo.save(entry);
    };
    /**
     * Record cryptographic proof event
     */
    StorageEngine.prototype.recordCryptoProof = function (entry) {
        this.ledger.append(entry);
        this.cryptoRepo.save(entry);
    };
    /**
     * Read full immutable ledger
     */
    StorageEngine.prototype.getLedger = function () {
        return this.ledger.all();
    };
    /**
     * Integrity check of full system
     */
    StorageEngine.prototype.verifyIntegrity = function () {
        return this.ledger.verifyIntegrity();
    };
    /**
     * Get latest execution entry
     */
    StorageEngine.prototype.lastExecution = function () {
        return this.executionRepo.last();
    };
    /**
     * Get latest verification entry
     */
    StorageEngine.prototype.lastVerification = function () {
        return this.verificationRepo.last();
    };
    /**
     * Get latest crypto proof entry
     */
    StorageEngine.prototype.lastCryptoProof = function () {
        return this.cryptoRepo.last();
    };
    return StorageEngine;
}());
exports.StorageEngine = StorageEngine;
