"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpClient = createHttpClient;
var axios_1 = require("axios");
/**
 * Create the HTTP client used by the Parmana SDK.
 */
function createHttpClient(endpoint, apiKey) {
    return axios_1.default.create({
        baseURL: endpoint,
        headers: apiKey
            ? {
                Authorization: "Bearer ".concat(apiKey),
            }
            : {},
        timeout: 30000,
    });
}
