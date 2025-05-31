import { CommandParser } from '../client/parser';
import { SimpleStringReply } from '../RESP/types';
export interface ShutdownOptions {
    mode?: 'NOSAVE' | 'SAVE';
    NOW?: boolean;
    FORCE?: boolean;
    ABORT?: boolean;
}
declare const _default: {
    readonly NOT_KEYED_COMMAND: true;
    readonly IS_READ_ONLY: false;
    readonly parseCommand: (this: void, parser: CommandParser, options?: ShutdownOptions) => void;
    readonly transformReply: () => void | SimpleStringReply;
};
export default _default;
//# sourceMappingURL=SHUTDOWN.d.ts.map