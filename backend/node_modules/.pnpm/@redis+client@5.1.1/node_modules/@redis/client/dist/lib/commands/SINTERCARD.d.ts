import { CommandParser } from '../client/parser';
import { NumberReply } from '../RESP/types';
import { RedisVariadicArgument } from './generic-transformers';
export interface SInterCardOptions {
    LIMIT?: number;
}
declare const _default: {
    readonly IS_READ_ONLY: true;
    readonly parseCommand: (this: void, parser: CommandParser, keys: RedisVariadicArgument, options?: SInterCardOptions | number) => void;
    readonly transformReply: () => NumberReply;
};
export default _default;
//# sourceMappingURL=SINTERCARD.d.ts.map