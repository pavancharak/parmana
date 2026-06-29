"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplayError = exports.VerificationError = exports.ExecutionError = exports.ParmanaError = void 0;
/**
 * Parmana SDK base error.
 */
var ParmanaError = /** @class */ (function (_super) {
    __extends(ParmanaError, _super);
    function ParmanaError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "ParmanaError";
        return _this;
    }
    return ParmanaError;
}(Error));
exports.ParmanaError = ParmanaError;
/**
 * Runtime execution error.
 */
var ExecutionError = /** @class */ (function (_super) {
    __extends(ExecutionError, _super);
    function ExecutionError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "ExecutionError";
        return _this;
    }
    return ExecutionError;
}(ParmanaError));
exports.ExecutionError = ExecutionError;
/**
 * Verification error.
 */
var VerificationError = /** @class */ (function (_super) {
    __extends(VerificationError, _super);
    function VerificationError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "VerificationError";
        return _this;
    }
    return VerificationError;
}(ParmanaError));
exports.VerificationError = VerificationError;
/**
 * Replay error.
 */
var ReplayError = /** @class */ (function (_super) {
    __extends(ReplayError, _super);
    function ReplayError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "ReplayError";
        return _this;
    }
    return ReplayError;
}(ParmanaError));
exports.ReplayError = ReplayError;
