"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_transformers_1 = require("./generic-transformers");
exports.default = {
    IS_READ_ONLY: true,
    parseCommand(parser, key) {
        parser.push('XINFO', 'STREAM');
        parser.pushKey(key);
    },
    transformReply: {
        // TODO: is there a "type safe" way to do it?
        2(reply) {
            const parsedReply = {};
            for (let i = 0; i < reply.length; i += 2) {
                switch (reply[i]) {
                    case 'first-entry':
                    case 'last-entry':
                        parsedReply[reply[i]] = transformEntry(reply[i + 1]);
                        break;
                    default:
                        parsedReply[reply[i]] = reply[i + 1];
                        break;
                }
            }
            return parsedReply;
        },
        3(reply) {
            if (reply instanceof Map) {
                reply.set('first-entry', transformEntry(reply.get('first-entry')));
                reply.set('last-entry', transformEntry(reply.get('last-entry')));
            }
            else if (reply instanceof Array) {
                reply[17] = transformEntry(reply[17]);
                reply[19] = transformEntry(reply[19]);
            }
            else {
                reply['first-entry'] = transformEntry(reply['first-entry']);
                reply['last-entry'] = transformEntry(reply['last-entry']);
            }
            return reply;
        }
    }
};
function transformEntry(entry) {
    if ((0, generic_transformers_1.isNullReply)(entry))
        return entry;
    const [id, message] = entry;
    return {
        id,
        message: (0, generic_transformers_1.transformTuplesReply)(message)
    };
}
//# sourceMappingURL=XINFO_STREAM.js.map