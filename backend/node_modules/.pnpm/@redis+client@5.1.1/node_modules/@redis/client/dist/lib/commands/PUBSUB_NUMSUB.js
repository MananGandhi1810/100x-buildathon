"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    NOT_KEYED_COMMAND: true,
    IS_READ_ONLY: true,
    parseCommand(parser, channels) {
        parser.push('PUBSUB', 'NUMSUB');
        if (channels) {
            parser.pushVariadic(channels);
        }
    },
    transformReply(rawReply) {
        const reply = Object.create(null);
        let i = 0;
        while (i < rawReply.length) {
            reply[rawReply[i++].toString()] = rawReply[i++].toString();
        }
        return reply;
    }
};
//# sourceMappingURL=PUBSUB_NUMSUB.js.map