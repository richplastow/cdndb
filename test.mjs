/** #### Runs all tests
 *
 * @example
 * npm test
 */

import { deepEqual as eq, throws } from "node:assert";
import { readFileSync } from "node:fs";

import { addDbTests } from "./tests/add-db.test.mjs";
import { onAddDbTests } from "./tests/on-add-db.test.mjs";

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

// Test each method on the global CDNDB object.
addDbTests();
onAddDbTests();


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
