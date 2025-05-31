"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xRangeArguments = void 0;
const generic_transformers_1 = require("./generic-transformers");
function xRangeArguments(start, end, options) {
    const args = [start, end];
    if (options?.COUNT) {
        args.push('COUNT', options.COUNT.toString());
    }
    return args;
}
exports.xRangeArguments = xRangeArguments;
exports.default = {
    CACHEABLE: true,
    IS_READ_ONLY: true,
    parseCommand(parser, key, ...args) {
        parser.push('XRANGE');
        parser.pushKey(key);
        parser.pushVariadic(xRangeArguments(args[0], args[1], args[2]));
    },
    transformReply(reply, preserve, typeMapping) {
        return reply.map(generic_transformers_1.transformStreamMessageReply.bind(undefined, typeMapping));
    }
};
//# sourceMappingURL=XRANGE.js.map