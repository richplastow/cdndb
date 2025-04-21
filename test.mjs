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
        message: 'CDNDB is not defined or CDNDB.add() is missing',
    }, "Didn't define CDNDB.add() yet."
);

// Import the cdndb library.
eval(cdndb);

// Try to trigger all the errors in the CDNDB.add() function.
throws(
    () => global.CDNDB.add(), {
        message: 'CDNDB.add(): Got 0 arguments (less than 2)',
    }, "Didn't throw error for missing arguments."
);
throws(
    () => global.CDNDB.add({}, {}), {
        message: 'CDNDB.add(): First argument is not a Metadata object',
    }, "Didn't throw error for missing metadata."
);
throws(
    () => global.CDNDB.add({ kind: 'Metadata' }, 1), {
        message: 'CDNDB.add(): arguments[1] is not an object',
    }, "Didn't throw error for number instead of object."
);


// // Mock the CDNDB.add() function.
// let addCalledWith = null;
// global.CDNDB = {
//     add: function () {
//         addCalledWith = arguments;
//     }
// };

// eval(example01);
// eq(addCalledWith.length, 3, "CDNDB.add() was called with 3 arguments");


console.log('\n\u2705 All tests passed\n');
