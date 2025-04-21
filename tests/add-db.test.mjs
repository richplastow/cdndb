// Tests which should trigger all possible addDb() errors.

import { throws } from "node:assert";

export const addDbTests = () => {
    const pfx = "addDbTests(): Didn't throw error for ";

throws(
    () => global.CDNDB.addDb(), {
        message: 'CDNDB.addDb(): Got 0 arguments (less than 2)',
    }, pfx + "missing arguments."
);
throws(
    () => global.CDNDB.addDb({}, 1), {
        message: 'CDNDB.addDb(): validateMetadata(): validateIdentifier(): identifier is type "undefined" not "string"',
    }, pfx + "missing Metadata identifier."
);
throws(
    () => global.CDNDB.addDb({ identifier: 'a' }, 1), {
        message: 'CDNDB.addDb(): validateMetadata(): validateIdentifier(): identifier "a" fails /^([a-z][-a-z0-9]{1,30}[a-z0-9])$/',
    }, pfx + "too-short Metadata identifier."
);
throws(
    () => global.CDNDB.addDb({ identifier: 'a--b' }, 1), {
        message: 'CDNDB.addDb(): validateMetadata(): validateIdentifier(): identifier "a--b" contains double-dashes',
    }, pfx + "Metadata identifier that contains double-dashes."
);
throws(
    () => global.CDNDB.addDb({ identifier: 'abc' }, 1), {
        message: 'CDNDB.addDb(): validateMetadata(): validateKind(): kind is type "undefined" not "string"',
    }, pfx + "missing metadata kind."
);
throws(
    () => global.CDNDB.addDb({ identifier: 'a-b', kind: 'UnencryptedJs' }, 1), {
        message: 'CDNDB.addDb(): validateMetadata(): kind is not "Metadata"',
    }, pfx + "incorrect metadata kind."
);
throws(
    () => global.CDNDB.addDb({ identifier: 'a'.repeat(32), kind: 'Metadata', versionCdndb: [] }, 1), {
        message: 'CDNDB.addDb(): validateMetadata(): validateVersionCdndb(): versionCdndb is type "object" not "string"',
    }, pfx + "wrong Metadata versionCdndb type."
);
throws(
    () => global.CDNDB.addDb({ identifier: 'a-b', kind: 'Metadata', versionCdndb: '0.0.0' }, 1), {
        message: 'CDNDB.addDb(): validateMetadata(): validateVersionCdndb(): versionCdndb "0.0.0" is not "0.0.1"',
    }, pfx + "invalid versionCdndb."
);
const minimalValidMetadata = { identifier: 'a-b', kind: 'Metadata', versionCdndb: '0.0.1' };
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, 1), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): not an object',
    }, pfx + "table item that isn't an object."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'a-b-' }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validateIdentifier(): identifier "a-b-" fails /^([a-z][-a-z0-9]{1,30}[a-z0-9])$/',
    }, pfx + "table item with identifier which ends with a dash."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 123 }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validateKind(): kind is type "number" not "string"',
    }, pfx + "incorrect type of table kind."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'Integer' }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validateKind(): kind "Integer" is not one of "Metadata" | "UnencryptedJs"',
    }, pfx + "incorrect table kind."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'Metadata' }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): kind is "Metadata"',
    }, pfx + "incorrect table kind."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs' }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload is type "undefined" not a plain object',
    }, pfx + "missing table payload."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: 123 }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload is type "number" not a plain object',
    }, pfx + "incorrect type of table payload."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {} }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.columns is not an array',
    }, pfx + "missing table payload columns."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: { columns: 123 } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.columns is not an array',
    }, pfx + "incorrect type of table payload columns array."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: { columns: [null] } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.columns[0] is type "object" not a plain object',
    }, pfx + "incorrect type of table payload column item."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: { columns: [] } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.columns is empty',
    }, pfx + "incorrect type of table payload column item."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: true }],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.columns[0]: ' +
            'validateIdentifier(): identifier is type "boolean" not "string"',
    }, pfx + "incorrect type of table payload column identifier."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [
            { identifier: 'foo', kind: 'String' },
            { identifier: 'bar', kind: 'Integer' },
            { identifier: 'foo', kind: 'Integer' },
        ],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): ' +
            'payload.columns[2] dupe identifier "foo"',
    }, pfx + "incorrect type of table payload column identifier."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'BigInt' }],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.columns[0]: ' +
            'validateKind(): kind "BigInt" is not one of "Enum" | "Integer" | "String"',
    }, pfx + "unrecognised column kind."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'Enum', valid: 123 }],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): ' +
            'payload.columns[0].valid is not an array',
    }, pfx + "incorrect type of an Enum column's `valid` property."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'Enum', valid: ['a', 123] }],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): ' +
            'payload.columns[0].valid[1] is type "number" not "string"',
    }, pfx + "incorrect type of an item in an Enum column's `valid` array."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'String' }],
        rows: 123,
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.rows is not an array',
    }, pfx + "incorrect type of table payload rows property."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'String' }],
        rows: [['a','b']],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.rows[0] has 2 columns, expected 1',
    }, pfx + "incorrect number of columns in a table payload row."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'Enum', valid: ['a', 'b'] }],
        rows: [['c']],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.rows[0][0] "c" is not a valid Enum value',
    }, pfx + "incorrect Enum value in a table payload row cell."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'Integer' }],
        rows: [['a']],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.rows[0][0] is type "string" not "number"',
    }, pfx + "incorrect type of a table payload row cell (is string not number)."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'Integer' }],
        rows: [[1.23]],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.rows[0][0] "1.23" is not an integer',
    }, pfx + "incorrect type of a table payload row cell (is string not number)."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'String' }],
        rows: [[123]],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.rows[0][0] is type "number" not "string"',
    }, pfx + "incorrect type of a table payload row cell (is number not string)."
);

};