import { BlobStringReply, NullReply } from '../RESP/types';
declare const _default: {
    readonly IS_READ_ONLY: false;
    readonly parseCommand: (this: void, parser: import("../..").CommandParser, key: import("../RESP/types").RedisArgument, id: import("../RESP/types").RedisArgument, message: Record<string, import("../RESP/types").RedisArgument>, options?: import("./XADD").XAddOptions | undefined) => void;
    readonly transformReply: () => BlobStringReply | NullReply;
};
export default _default;
//# sourceMappingURL=XADD_NOMKSTREAM.d.ts.map