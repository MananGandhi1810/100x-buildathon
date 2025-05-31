import { CommandParser } from '../client/parser';
import { RedisArgument, SimpleStringReply } from '../RESP/types';
export interface RestoreOptions {
    REPLACE?: boolean;
    ABSTTL?: boolean;
    IDLETIME?: number;
    FREQ?: number;
}
declare const _default: {
    readonly IS_READ_ONLY: false;
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument, ttl: number, serializedValue: RedisArgument, options?: RestoreOptions) => void;
    readonly transformReply: () => SimpleStringReply<'OK'>;
};
export default _default;
//# sourceMappingURL=RESTORE.d.ts.map