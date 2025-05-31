"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XREAD_1 = require("./XREAD");
const generic_transformers_1 = require("./generic-transformers");
exports.default = {
    IS_READ_ONLY: true,
    parseCommand(parser, group, consumer, streams, options) {
        parser.push('XREADGROUP', 'GROUP', group, consumer);
        if (options?.COUNT !== undefined) {
            parser.push('COUNT', options.COUNT.toString());
        }
        if (options?.BLOCK !== undefined) {
            parser.push('BLOCK', options.BLOCK.toString());
        }
        if (options?.NOACK) {
            parser.push('NOACK');
        }
        (0, XREAD_1.pushXReadStreams)(parser, streams);
    },
    transformReply: {
        2: generic_transformers_1.transformStreamsMessagesReplyResp2,
        3: undefined
    },
    unstableResp3: true,
};
//# sourceMappingURL=XREADGROUP.js.map