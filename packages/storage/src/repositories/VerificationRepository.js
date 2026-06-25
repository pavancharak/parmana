"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationRepository = void 0;
/**
 * Stores verification records.
 */
var VerificationRepository = /** @class */ (function () {
    function VerificationRepository() {
        this.entries = [];
    }
    VerificationRepository.prototype.save = function (entry) {
        this.entries.push(Object.freeze(__assign({}, entry)));
    };
    VerificationRepository.prototype.findAll = function () {
        return this.entries;
    };
    VerificationRepository.prototype.last = function () {
        return this.entries.length === 0
            ? null
            : this.entries[this.entries.length - 1];
    };
    return VerificationRepository;
}());
exports.VerificationRepository = VerificationRepository;
