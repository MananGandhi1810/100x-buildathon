"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_transformers_1 = require("./generic-transformers");
exports.default = {
    IS_READ_ONLY: false,
    parseCommand(parser, key, group, consumer, minIdleTime, start, options) {
        parser.push('XAUTOCLAIM');
        parser.pushKey(key);
        parser.push(group, consumer, minIdleTime.toString(), start);
        if (options?.COUNT) {
            parser.push('COUNT', options.COUNT.toString());
        }
    },
    transformReply(reply, preserve, typeMapping) {
        return {
            nextId: reply[0],
            messages: reply[1].map(generic_transformers_1.transformStreamMessageNullReply.bind(undefined, typeMapping)),
            deletedMessages: reply[2]
        };
    }
};
//# sourceMappingURL=XAUTOCLAIM.js.map