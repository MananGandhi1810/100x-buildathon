import { CommandParser } from '../client/parser';
import { RedisArgument, BlobStringReply, NullReply, ArrayReply, TuplesReply, NumberReply } from '../RESP/types';
declare const _default: {
    readonly CACHEABLE: true;
    readonly IS_READ_ONLY: true;
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument, group: RedisArgument) => void;
    readonly transformReply: (this: void, reply: [pending: NumberReply<number>, firstId: NullReply | BlobStringReply<string>, lastId: NullReply | BlobStringReply<string>, consumers: NullReply | ArrayReply<TuplesReply<[name: BlobStringReply<string>, deliveriesCounter: BlobStringReply<string>]>>]) => {
        pending: NumberReply<number>;
        firstId: NullReply | BlobStringReply<string>;
        lastId: NullReply | BlobStringReply<string>;
        consumers: {
            name: BlobStringReply<string>;
            deliveriesCounter: number;
        }[] | null;
    };
};
export default _default;
//# sourceMappingURL=XPENDING.d.ts.map