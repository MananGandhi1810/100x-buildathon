import { BlobStringReply, ArrayReply } from '../RESP/types';
declare const _default: {
    readonly IS_READ_ONLY: false;
    readonly parseCommand: (this: void, parser: import("../..").CommandParser, key: import("../RESP/types").RedisArgument, group: import("../RESP/types").RedisArgument, consumer: import("../RESP/types").RedisArgument, minIdleTime: number, start: import("../RESP/types").RedisArgument, options?: import("./XAUTOCLAIM").XAutoClaimOptions | undefined) => void;
    readonly transformReply: (this: void, reply: [nextId: BlobStringReply<string>, messages: ArrayReply<BlobStringReply<string>>, deletedMessages: ArrayReply<BlobStringReply<string>>]) => {
        nextId: BlobStringReply<string>;
        messages: ArrayReply<BlobStringReply<string>>;
        deletedMessages: ArrayReply<BlobStringReply<string>>;
    };
};
export default _default;
//# sourceMappingURL=XAUTOCLAIM_JUSTID.d.ts.map