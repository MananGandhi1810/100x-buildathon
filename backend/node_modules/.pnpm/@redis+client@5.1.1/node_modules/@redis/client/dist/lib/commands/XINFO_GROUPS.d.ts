import { CommandParser } from '../client/parser';
import { RedisArgument, ArrayReply, TuplesToMapReply, BlobStringReply, NumberReply, NullReply, UnwrapReply, Resp2Reply } from '../RESP/types';
export type XInfoGroupsReply = ArrayReply<TuplesToMapReply<[
    [
        BlobStringReply<'name'>,
        BlobStringReply
    ],
    [
        BlobStringReply<'consumers'>,
        NumberReply
    ],
    [
        BlobStringReply<'pending'>,
        NumberReply
    ],
    [
        BlobStringReply<'last-delivered-id'>,
        NumberReply
    ],
    /** added in 7.0 */
    [
        BlobStringReply<'entries-read'>,
        NumberReply | NullReply
    ],
    /** added in 7.0 */
    [
        BlobStringReply<'lag'>,
        NumberReply
    ]
]>>;
declare const _default: {
    readonly IS_READ_ONLY: true;
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument) => void;
    readonly transformReply: {
        readonly 2: (reply: UnwrapReply<Resp2Reply<XInfoGroupsReply>>) => {
            name: BlobStringReply<string>;
            consumers: NumberReply<number>;
            pending: NumberReply<number>;
            'last-delivered-id': NumberReply<number>;
            'entries-read': NullReply | NumberReply<number>;
            lag: NumberReply<number>;
        }[];
        readonly 3: () => XInfoGroupsReply;
    };
};
export default _default;
//# sourceMappingURL=XINFO_GROUPS.d.ts.map