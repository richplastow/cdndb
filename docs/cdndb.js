!function(global){
if (typeof global.CDNDB === 'object')
    throw Error('CDNDB has already been defined');

// Create a private object to hold the metadata and tables.
const cdndb = {};

// Create the global namespace. Available as `window.CDNDB` in the browser.
global.CDNDB = {};

// Lets a .cdndb.js file register its metadata and tables as soon as it loads.
global.CDNDB.add = function () {
    const pfx = 'CDNDB.add(): ';
    const len = arguments.length;
    if (len < 2)
        throw Error(`${pfx}Got ${len} argument${len == 1 ? '' : 's'} (less than 2)`);
    if (typeof arguments[0] !== 'object' || arguments[0].kind !== 'Metadata')
        throw Error(`${pfx}First argument is not a Metadata object`);
    // TODO more Metadata validation
    for (let i = 1; i < len; i++) {
        const item = arguments[i];
        if (typeof item !== 'object')
            throw Error(`${pfx}arguments[${i}] is not an object`);
        if (!item.identifier)
            throw Error(`${pfx}arguments[${i}] does not have an identifier`);
        if (!item.kind)
            throw Error(`${pfx}arguments[${i}] does not have a kind`);
        if (item.kind !== 'UnencryptedJs')
            throw Error(`${pfx}arguments[${i}] is not an UnencryptedJs object`);
        if (!item.payload)
            throw Error(`${pfx}arguments[${i}] does not have a payload`);
        if (typeof item.payload !== 'object')
            throw Error(`${pfx}arguments[${i}] payload is not an object`);
        if (!item.payload.columns)
            throw Error(`${pfx}arguments[${i}] payload does not have columns`);
        if (!item.payload.rows)
            throw Error(`${pfx}arguments[${i}] payload does not have rows`);
        // TODO more table validation
    }

    // Store the metadata and tables in the private object.
    const dbIdentifier = arguments[0].identifier;
    cdndb[dbIdentifier] = {
        metadata: arguments[0],
        tables: Array.from(arguments).slice(1),
    };
}

}(this || global);
