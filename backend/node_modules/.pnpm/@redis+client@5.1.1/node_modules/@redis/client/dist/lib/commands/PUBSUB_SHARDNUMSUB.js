"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    IS_READ_ONLY: true,
    parseCommand(parser, channels) {
        parser.push('PUBSUB', 'SHARDNUMSUB');
        if (channels) {
            parser.pushVariadic(channels);
        }
    },
    transformReply(reply) {
        const transformedReply = Object.create(null);
        for (let i = 0; i < reply.length; i += 2) {
            transformedReply[reply[i].toString()] = reply[i + 1];
        }
        return transformedReply;
    }
};
//# sourceMappingURL=PUBSUB_SHARDNUMSUB.js.map