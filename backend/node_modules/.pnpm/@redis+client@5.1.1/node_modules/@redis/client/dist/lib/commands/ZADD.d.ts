import { CommandParser } from '../client/parser';
import { RedisArgument } from '../RESP/types';
import { SortedSetMember } from './generic-transformers';
export interface ZAddOptions {
    condition?: 'NX' | 'XX';
    /**
     * @deprecated Use `{ condition: 'NX' }` instead.
     */
    NX?: boolean;
    /**
     * @deprecated Use `{ condition: 'XX' }` instead.
     */
    XX?: boolean;
    comparison?: 'LT' | 'GT';
    /**
     * @deprecated Use `{ comparison: 'LT' }` instead.
     */
    LT?: boolean;
    /**
     * @deprecated Use `{ comparison: 'GT' }` instead.
     */
    GT?: boolean;
    CH?: boolean;
}
declare const _default: {
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument, members: SortedSetMember | Array<SortedSetMember>, options?: ZAddOptions) => void;
    readonly transformReply: {
        2: (reply: import("../RESP/types").BlobStringReply<string>, preserve?: any, typeMapping?: import("../RESP/types").TypeMapping | undefined) => import("../RESP/types").DoubleReply<number>;
        3: () => import("../RESP/types").DoubleReply<number>;
    };
};
export default _default;
export declare function pushMembers(parser: CommandParser, members: SortedSetMember | Array<SortedSetMember>): void;
//# sourceMappingURL=ZADD.d.ts.map