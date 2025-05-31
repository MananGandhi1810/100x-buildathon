import { CommandParser } from '../client/parser';
import { RedisArgument, ArrayReply, TuplesReply, BlobStringReply, NumberReply, UnwrapReply } from '../RESP/types';
export interface XPendingRangeOptions {
    IDLE?: number;
    consumer?: RedisArgument;
}
type XPendingRangeRawReply = ArrayReply<TuplesReply<[
    id: BlobStringReply,
    consumer: BlobStringReply,
    millisecondsSinceLastDelivery: NumberReply,
    deliveriesCounter: NumberReply
]>>;
declare const _default: {
    readonly CACHEABLE: true;
    readonly IS_READ_ONLY: true;
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument, group: RedisArgument, start: RedisArgument, end: RedisArgument, count: number, options?: XPendingRangeOptions) => void;
    readonly transformReply: (this: void, reply: UnwrapReply<XPendingRangeRawReply>) => {
        id: BlobStringReply<string>;
        consumer: BlobStringReply<string>;
        millisecondsSinceLastDelivery: NumberReply<number>;
        deliveriesCounter: NumberReply<number>;
    }[];
};
export default _default;
//# sourceMappingURL=XPENDING_RANGE.d.ts.map