import { CommandParser } from '../client/parser';
import { RedisArgument, ArrayReply, TuplesToMapReply, BlobStringReply, NumberReply, UnwrapReply, Resp2Reply } from '../RESP/types';
export type XInfoConsumersReply = ArrayReply<TuplesToMapReply<[
    [
        BlobStringReply<'name'>,
        BlobStringReply
    ],
    [
        BlobStringReply<'pending'>,
        NumberReply
    ],
    [
        BlobStringReply<'idle'>,
        NumberReply
    ],
    /** added in 7.2 */
    [
        BlobStringReply<'inactive'>,
        NumberReply
    ]
]>>;
declare const _default: {
    readonly IS_READ_ONLY: true;
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument, group: RedisArgument) => void;
    readonly transformReply: {
        readonly 2: (reply: UnwrapReply<Resp2Reply<XInfoConsumersReply>>) => {
            name: BlobStringReply<string>;
            pending: NumberReply<number>;
            idle: NumberReply<number>;
            inactive: NumberReply<number>;
        }[];
        readonly 3: () => XInfoConsumersReply;
    };
};
export default _default;
//# sourceMappingURL=XINFO_CONSUMERS.d.ts.map