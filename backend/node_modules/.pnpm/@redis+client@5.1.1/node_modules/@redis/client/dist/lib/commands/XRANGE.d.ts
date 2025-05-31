import { CommandParser } from '../client/parser';
import { RedisArgument, ArrayReply, UnwrapReply, TypeMapping } from '../RESP/types';
import { StreamMessageRawReply } from './generic-transformers';
export interface XRangeOptions {
    COUNT?: number;
}
export declare function xRangeArguments(start: RedisArgument, end: RedisArgument, options?: XRangeOptions): RedisArgument[];
declare const _default: {
    readonly CACHEABLE: true;
    readonly IS_READ_ONLY: true;
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument, start: RedisArgument, end: RedisArgument, options?: XRangeOptions | undefined) => void;
    readonly transformReply: (this: void, reply: UnwrapReply<ArrayReply<StreamMessageRawReply>>, preserve?: any, typeMapping?: TypeMapping) => import("./generic-transformers").StreamMessageReply[];
};
export default _default;
//# sourceMappingURL=XRANGE.d.ts.map