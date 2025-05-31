import { CommandParser } from '../client/parser';
import { RedisArgument } from '../RESP/types';
import { SortedSetMember } from './generic-transformers';
export interface ZAddOptions {
    condition?: 'NX' | 'XX';
    comparison?: 'LT' | 'GT';
    CH?: boolean;
}
declare const _default: {
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument, members: SortedSetMember | Array<SortedSetMember>, options?: ZAddOptions) => void;
    readonly transformReply: {
        2: (reply: import("../RESP/types").NullReply | import("../RESP/types").BlobStringReply<string>, preserve?: any, typeMapping?: import("../RESP/types").TypeMapping | undefined) => import("../RESP/types").DoubleReply<number> | null;
        3: () => import("../RESP/types").NullReply | import("../RESP/types").DoubleReply<number>;
    };
};
export default _default;
//# sourceMappingURL=ZADD_INCR.d.ts.map