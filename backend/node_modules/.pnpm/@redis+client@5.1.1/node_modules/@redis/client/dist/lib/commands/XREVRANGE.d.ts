import { CommandParser } from '../client/parser';
import { RedisArgument } from '../RESP/types';
export interface XRevRangeOptions {
    COUNT?: number;
}
declare const _default: {
    readonly CACHEABLE: true;
    readonly IS_READ_ONLY: true;
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument, start: RedisArgument, end: RedisArgument, options?: import("./XRANGE").XRangeOptions | undefined) => void;
    readonly transformReply: (this: void, reply: import("./generic-transformers").StreamMessageRawReply[], preserve?: any, typeMapping?: import("../RESP/types").TypeMapping | undefined) => import("./generic-transformers").StreamMessageReply[];
};
export default _default;
//# sourceMappingURL=XREVRANGE.d.ts.map