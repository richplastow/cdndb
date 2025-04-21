/** #### Runs all tests
 *
 * @example
 * npm test
 */

import { deepEqual as eq, throws } from "node:assert";
import { readFileSync } from "node:fs";

const cdndb = readFileSync(
    new URL('./docs/cdndb.js', import.meta.url),
    'utf8',
);
const example01 = readFileSync(
    new URL('./docs/01-unencrypted-data-example.cdndb.js', import.meta.url),
    'utf8',
);

// Importing a *.cdndb.js file should fail if the cdndb library is not present.
throws(
    () => eval(example01), {
        name: 'Error',
        message: 'CDNDB is not defined or CDNDB.addDb() is missing',
    }, "Didn't define CDNDB.addDb() yet."
);

// Import the cdndb library.
eval(cdndb);

// Try to trigger all the errors in the CDNDB.addDb() function.
throws(
    () => global.CDNDB.addDb(), {
        message: 'CDNDB.addDb(): Got 0 arguments (less than 2)',
    }, "Didn't throw error for missing arguments."
);
throws(
    () => global.CDNDB.addDb({}, 1), {
        message: 'CDNDB.addDb(): validateMetadata(): validateIdentifier(): identifier is type "undefined" not "string"',
    }, "Didn't throw error for missing Metadata identifier."
);
throws(
    () => global.CDNDB.addDb({ identifier: 'a' }, 1), {
        message: 'CDNDB.addDb(): validateMetadata(): validateIdentifier(): identifier "a" fails /^([a-z][-a-z0-9]{1,30}[a-z0-9])$/',
    }, "Didn't throw error for too-short Metadata identifier."
);
throws(
    () => global.CDNDB.addDb({ identifier: 'a--b' }, 1), {
        message: 'CDNDB.addDb(): validateMetadata(): validateIdentifier(): identifier "a--b" contains double-dashes',
    }, "Didn't throw error for Metadata identifier that contains double-dashes."
);
throws(
    () => global.CDNDB.addDb({ identifier: 'abc' }, 1), {
        message: 'CDNDB.addDb(): validateMetadata(): validateKind(): kind is type "undefined" not "string"',
    }, "Didn't throw error for missing metadata kind."
);
throws(
    () => global.CDNDB.addDb({ identifier: 'a-b', kind: 'UnencryptedJs' }, 1), {
        message: 'CDNDB.addDb(): validateMetadata(): kind is not "Metadata"',
    }, "Didn't throw error for incorrect metadata kind."
);
throws(
    () => global.CDNDB.addDb({ identifier: 'a'.repeat(32), kind: 'Metadata', versionCdndb: [] }, 1), {
        message: 'CDNDB.addDb(): validateMetadata(): validateVersionCdndb(): versionCdndb is type "object" not "string"',
    }, "Didn't throw error for wrong Metadata versionCdndb type."
);
throws(
    () => global.CDNDB.addDb({ identifier: 'a-b', kind: 'Metadata', versionCdndb: '0.0.0' }, 1), {
        message: 'CDNDB.addDb(): validateMetadata(): validateVersionCdndb(): versionCdndb "0.0.0" is not "0.0.1"',
    }, "Didn't throw error for invalid versionCdndb."
);
const minimalValidMetadata = { identifier: 'a-b', kind: 'Metadata', versionCdndb: '0.0.1' };
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, 1), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): not an object',
    }, "Didn't throw error for table item that isn't an object."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'a-b-' }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validateIdentifier(): identifier "a-b-" fails /^([a-z][-a-z0-9]{1,30}[a-z0-9])$/',
    }, "Didn't throw error for table item with identifier which ends with a dash."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 123 }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validateKind(): kind is type "number" not "string"',
    }, "Didn't throw error for incorrect type of table kind."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'Integer' }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validateKind(): kind "Integer" is not one of "Metadata" | "UnencryptedJs"',
    }, "Didn't throw error for incorrect table kind."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'Metadata' }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): kind is "Metadata"',
    }, "Didn't throw error for incorrect table kind."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs' }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload is type "undefined" not a plain object',
    }, "Didn't throw error for missing table payload."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: 123 }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload is type "number" not a plain object',
    }, "Didn't throw error for incorrect type of table payload."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {} }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.columns is not an array',
    }, "Didn't throw error for missing table payload columns."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: { columns: 123 } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.columns is not an array',
    }, "Didn't throw error for incorrect type of table payload columns array."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: { columns: [null] } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.columns[0] is type "object" not a plain object',
    }, "Didn't throw error for incorrect type of table payload column item."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: { columns: [] } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.columns is empty',
    }, "Didn't throw error for incorrect type of table payload column item."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: true }],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.columns[0]: ' +
            'validateIdentifier(): identifier is type "boolean" not "string"',
    }, "Didn't throw error for incorrect type of table payload column identifier."
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
    }, "Didn't throw error for incorrect type of table payload column identifier."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'BigInt' }],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.columns[0]: ' +
            'validateKind(): kind "BigInt" is not one of "Enum" | "Integer" | "String"',
    }, "Didn't throw error for unrecognised column kind."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'Enum', valid: 123 }],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): ' +
            'payload.columns[0].valid is not an array',
    }, "Didn't throw error for incorrect type of an Enum column's `valid` property."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'Enum', valid: ['a', 123] }],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): ' +
            'payload.columns[0].valid[1] is type "number" not "string"',
    }, "Didn't throw error for incorrect type of an item in an Enum column's `valid` array."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'String' }],
        rows: 123,
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.rows is not an array',
    }, "Didn't throw error for incorrect type of table payload rows property."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'String' }],
        rows: [['a','b']],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.rows[0] has 2 columns, expected 1',
    }, "Didn't throw error for incorrect number of columns in a table payload row."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'Enum', valid: ['a', 'b'] }],
        rows: [['c']],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.rows[0][0] "c" is not a valid Enum value',
    }, "Didn't throw error for incorrect Enum value in a table payload row cell."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'Integer' }],
        rows: [['a']],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.rows[0][0] is type "string" not "number"',
    }, "Didn't throw error for incorrect type of a table payload row cell (is string not number)."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'Integer' }],
        rows: [[1.23]],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.rows[0][0] "1.23" is not an integer',
    }, "Didn't throw error for incorrect type of a table payload row cell (is string not number)."
);
throws(
    () => global.CDNDB.addDb(minimalValidMetadata, { identifier: 'abc', kind: 'UnencryptedJs', payload: {
        columns: [{ identifier: 'a-b-c', kind: 'String' }],
        rows: [[123]],
    } }), {
        message: 'CDNDB.addDb(): item[1]: validateTable(): validatePayload(): payload.rows[0][0] is type "number" not "string"',
    }, "Didn't throw error for incorrect type of a table payload row cell (is number not string)."
);


// // Mock the CDNDB.addDb() function.
// let addCalledWith = null;
// global.CDNDB = {
//     addDb: function () {
//         addCalledWith = arguments;
//     }
// };

// eval(example01);
// eq(addCalledWith.length, 3, "CDNDB.addDb() was called with 3 arguments");


console.log('\n\u2705 All tests passed\n');
