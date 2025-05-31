"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushMembers = void 0;
const generic_transformers_1 = require("./generic-transformers");
exports.default = {
    parseCommand(parser, key, members, options) {
        parser.push('ZADD');
        parser.pushKey(key);
        if (options?.condition) {
            parser.push(options.condition);
        }
        else if (options?.NX) {
            parser.push('NX');
        }
        else if (options?.XX) {
            parser.push('XX');
        }
        if (options?.comparison) {
            parser.push(options.comparison);
        }
        else if (options?.LT) {
            parser.push('LT');
        }
        else if (options?.GT) {
            parser.push('GT');
        }
        if (options?.CH) {
            parser.push('CH');
        }
        pushMembers(parser, members);
    },
    transformReply: generic_transformers_1.transformDoubleReply
};
function pushMembers(parser, members) {
    if (Array.isArray(members)) {
        for (const member of members) {
            pushMember(parser, member);
        }
    }
    else {
        pushMember(parser, members);
    }
}
exports.pushMembers = pushMembers;
function pushMember(parser, member) {
    parser.push((0, generic_transformers_1.transformDoubleArgument)(member.score), member.value);
}
//# sourceMappingURL=ZADD.js.map