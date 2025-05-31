import { CommandParser } from '../client/parser';
import { RedisArgument, TuplesReply, BlobStringReply, ArrayReply, NullReply, TypeMapping } from '../RESP/types';
import { StreamMessageRawReply } from './generic-transformers';
export interface XAutoClaimOptions {
    COUNT?: number;
}
export type XAutoClaimRawReply = TuplesReply<[
    nextId: BlobStringReply,
    messages: ArrayReply<StreamMessageRawReply | NullReply>,
    deletedMessages: ArrayReply<BlobStringReply>
]>;
declare const _default: {
    readonly IS_READ_ONLY: false;
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument, group: RedisArgument, consumer: RedisArgument, minIdleTime: number, start: RedisArgument, options?: XAutoClaimOptions) => void;
    readonly transformReply: (this: void, reply: [nextId: BlobStringReply<string>, messages: ArrayReply<NullReply | StreamMessageRawReply>, deletedMessages: ArrayReply<BlobStringReply<string>>], preserve?: any, typeMapping?: TypeMapping) => {
        nextId: BlobStringReply<string>;
        messages: (NullReply | import("./generic-transformers").StreamMessageReply)[];
        deletedMessages: ArrayReply<BlobStringReply<string>>;
    };
};
export default _default;
//# sourceMappingURL=XAUTOCLAIM.d.ts.map