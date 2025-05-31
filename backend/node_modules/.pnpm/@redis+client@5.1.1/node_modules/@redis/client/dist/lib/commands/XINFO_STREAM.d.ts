import { CommandParser } from '../client/parser';
import { RedisArgument, TuplesToMapReply, BlobStringReply, NumberReply, NullReply, TuplesReply, ArrayReply } from '../RESP/types';
export type XInfoStreamReply = TuplesToMapReply<[
    [
        BlobStringReply<'length'>,
        NumberReply
    ],
    [
        BlobStringReply<'radix-tree-keys'>,
        NumberReply
    ],
    [
        BlobStringReply<'radix-tree-nodes'>,
        NumberReply
    ],
    [
        BlobStringReply<'last-generated-id'>,
        BlobStringReply
    ],
    /** added in 7.2 */
    [
        BlobStringReply<'max-deleted-entry-id'>,
        BlobStringReply
    ],
    /** added in 7.2 */
    [
        BlobStringReply<'entries-added'>,
        NumberReply
    ],
    /** added in 7.2 */
    [
        BlobStringReply<'recorded-first-entry-id'>,
        BlobStringReply
    ],
    [
        BlobStringReply<'groups'>,
        NumberReply
    ],
    [
        BlobStringReply<'first-entry'>,
        ReturnType<typeof transformEntry>
    ],
    [
        BlobStringReply<'last-entry'>,
        ReturnType<typeof transformEntry>
    ]
]>;
declare const _default: {
    readonly IS_READ_ONLY: true;
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument) => void;
    readonly transformReply: {
        readonly 2: (this: void, reply: any) => {
            length: NumberReply<number>;
            "radix-tree-keys": NumberReply<number>;
            "radix-tree-nodes": NumberReply<number>;
            "last-generated-id": BlobStringReply<string>;
            "max-deleted-entry-id": BlobStringReply<string>;
            "entries-added": NumberReply<number>;
            "recorded-first-entry-id": BlobStringReply<string>;
            groups: NumberReply<number>;
            "first-entry": NullReply | {
                id: BlobStringReply<string>;
                message: import("../RESP/types").MapReply<BlobStringReply<string>, BlobStringReply<string>>;
            };
            "last-entry": NullReply | {
                id: BlobStringReply<string>;
                message: import("../RESP/types").MapReply<BlobStringReply<string>, BlobStringReply<string>>;
            };
        };
        readonly 3: (this: void, reply: any) => XInfoStreamReply;
    };
};
export default _default;
type RawEntry = TuplesReply<[
    id: BlobStringReply,
    message: ArrayReply<BlobStringReply>
]> | NullReply;
declare function transformEntry(entry: RawEntry): NullReply | {
    id: BlobStringReply<string>;
    message: import("../RESP/types").MapReply<BlobStringReply<string>, BlobStringReply<string>>;
};
//# sourceMappingURL=XINFO_STREAM.d.ts.map