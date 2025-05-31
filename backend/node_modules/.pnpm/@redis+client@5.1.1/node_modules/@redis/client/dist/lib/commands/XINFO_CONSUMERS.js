"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    IS_READ_ONLY: true,
    parseCommand(parser, key, group) {
        parser.push('XINFO', 'CONSUMERS');
        parser.pushKey(key);
        parser.push(group);
    },
    transformReply: {
        2: (reply) => {
            return reply.map(consumer => {
                const unwrapped = consumer;
                return {
                    name: unwrapped[1],
                    pending: unwrapped[3],
                    idle: unwrapped[5],
                    inactive: unwrapped[7]
                };
            });
        },
        3: undefined
    }
};
//# sourceMappingURL=XINFO_CONSUMERS.js.map