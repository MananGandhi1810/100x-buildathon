"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    IS_READ_ONLY: true,
    parseCommand(parser, key) {
        parser.push('XINFO', 'GROUPS');
        parser.pushKey(key);
    },
    transformReply: {
        2: (reply) => {
            return reply.map(group => {
                const unwrapped = group;
                return {
                    name: unwrapped[1],
                    consumers: unwrapped[3],
                    pending: unwrapped[5],
                    'last-delivered-id': unwrapped[7],
                    'entries-read': unwrapped[9],
                    lag: unwrapped[11]
                };
            });
        },
        3: undefined
    }
};
//# sourceMappingURL=XINFO_GROUPS.js.map