"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XADD_1 = require("./XADD");
exports.default = {
    IS_READ_ONLY: false,
    parseCommand(...args) {
        return (0, XADD_1.parseXAddArguments)('NOMKSTREAM', ...args);
    },
    transformReply: undefined
};
//# sourceMappingURL=XADD_NOMKSTREAM.js.map