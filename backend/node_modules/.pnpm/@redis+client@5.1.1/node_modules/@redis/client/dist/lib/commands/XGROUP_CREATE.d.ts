import { CommandParser } from '../client/parser';
import { RedisArgument, SimpleStringReply } from '../RESP/types';
export interface XGroupCreateOptions {
    MKSTREAM?: boolean;
    /**
     * added in 7.0
     */
    ENTRIESREAD?: number;
}
declare const _default: {
    readonly IS_READ_ONLY: false;
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument, group: RedisArgument, id: RedisArgument, options?: XGroupCreateOptions) => void;
    readonly transformReply: () => SimpleStringReply<'OK'>;
};
export default _default;
//# sourceMappingURL=XGROUP_CREATE.d.ts.map