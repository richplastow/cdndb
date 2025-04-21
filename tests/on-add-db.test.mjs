// Tests CDNDB.onAddDb() errors and typical usage.

import { deepEqual as eq, throws } from "node:assert";

    export const onAddDbTests = () => {
        const pfx = "onAddDbTests(): ";

    throws(
        () => global.CDNDB.onAddDb(), {
            message: 'CDNDB.onAddDb(): sub is type "undefined" not "function"',
        }, pfx + "Didn't throw error for for missing argument."
    );

    throws(
        () => global.CDNDB.onAddDb(123), {
            message: 'CDNDB.onAddDb(): sub is type "number" not "function"',
        }, pfx + "Didn't throw error for for incorrect argument type."
    );

    let didCall = false;
    let detail = null;
    const sub = (event) => {
        didCall = true;
        detail = event.detail;
    }
    global.CDNDB.onAddDb(sub);
    eq(didCall, false, pfx + "sub() was called without waiting for addDb()." );
    global.CDNDB.addDb(
        { identifier: 'my-db', kind: 'Metadata', versionCdndb: '0.0.1' },
        { identifier: 'my-table', kind: 'UnencryptedJs', payload: {
            columns: [{ identifier: 'my-col', kind: 'Integer' }],
            rows: [[123]],
        } },
    );
    eq(didCall, true, pfx + "sub() was not called after addDb()." );
    eq(detail.dbIdentifier, 'my-db', pfx + "sub() was called with wrong dbIdentifier." );

};