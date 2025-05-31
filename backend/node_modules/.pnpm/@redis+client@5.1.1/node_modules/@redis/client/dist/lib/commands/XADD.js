"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseXAddArguments = void 0;
function parseXAddArguments(optional, parser, key, id, message, options) {
    parser.push('XADD');
    parser.pushKey(key);
    if (optional) {
        parser.push(optional);
    }
    if (options?.TRIM) {
        if (options.TRIM.strategy) {
            parser.push(options.TRIM.strategy);
        }
        if (options.TRIM.strategyModifier) {
            parser.push(options.TRIM.strategyModifier);
        }
        parser.push(options.TRIM.threshold.toString());
        if (options.TRIM.limit) {
            parser.push('LIMIT', options.TRIM.limit.toString());
        }
    }
    parser.push(id);
    for (const [key, value] of Object.entries(message)) {
        parser.push(key, value);
    }
}
exports.parseXAddArguments = parseXAddArguments;
exports.default = {
    IS_READ_ONLY: false,
    parseCommand(...args) {
        return parseXAddArguments(undefined, ...args);
    },
    transformReply: undefined
};
//# sourceMappingURL=XADD.js.map