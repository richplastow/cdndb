!function(global){
if (typeof global.CDNDB === 'object')
    throw Error('CDNDB has already been defined');

// Create a private object to hold the metadata and tables.
const cdndb = {};

// Create the global namespace. Available as `window.CDNDB` in the browser.
global.CDNDB = {
    // A list of subscribers to the "cdndb-addDb" event.
    onAdd: [],

    // A list of subscribers to the "cdndb-remove" event.
    onRemove: [],

    // A list of subscribers to the "cdndb-update" event.
    onUpdate: [],
};

// Lets a .cdndb.js file register its metadata and tables as soon as it loads.
global.CDNDB.addDb = function () {
    const pfx = 'CDNDB.addDb(): ';
    const len = arguments.length;
    if (len < 2)
        throw Error(`${pfx}Got ${len} argument${len == 1 ? '' : 's'} (less than 2)`);

    validateMetadata(arguments[0], pfx);
    // TODO more Metadata validation

    const tableIdentifiers = new Set();
    for (let i = 1; i < len; i++) {
        const item = arguments[i];
        validateTable(item, `${pfx}item[${i}]: `);

        // Check that the table identifier is unique.
        const identifier = item.identifier;
        if (tableIdentifiers.has(identifier))
            throw Error(`${pfx}item[${i}] dupe identifier "${safe(identifier)}"`);
        tableIdentifiers.add(identifier);
    }

    // Store the metadata and tables in the private object.
    const dbIdentifier = arguments[0].identifier;
    cdndb[dbIdentifier] = {
        metadata: arguments[0],
        tables: Array.from(arguments).slice(1),
    };

    // Notify subscribers that the database has been added.
    if (global.CDNDB.onAdd.length > 0) {
        const event = new CustomEvent('cdndb-addDb', { detail: { dbIdentifier } });
        global.CDNDB.onAdd.forEach((sub) => sub(event));
    }
}

}(this || global);

function validateMetadata(item, pfx) {
    const p = `${pfx}validateMetadata(): `;
    if (typeof item !== 'object' || item === null || Array.isArray(item))
        throw Error(`${p}not an object`);
    validateIdentifier(item.identifier, p);
    validateKind(item.kind, p);
    if (item.kind !== 'Metadata')
        throw Error(`${p}kind is not "Metadata"`);
    validateVersionCdndb(item.versionCdndb, p);
}

function validateTable(item, pfx) {
    const p = `${pfx}validateTable(): `;
    if (typeof item !== 'object' || item === null || Array.isArray(item))
        throw Error(`${p}not an object`);
    validateIdentifier(item.identifier, p);
    validateKind(item.kind, p);
    if (item.kind === 'Metadata')
        throw Error(`${p}kind is "Metadata"`);
    validatePayload(item.payload, p);
}

// Checks that identifiers are 3 to 32 chars, kebab-case, start with a lowercase
// letter, don't end with a dash, and don't contain double-dashes.
function validateIdentifier(identifier, pfx) {
    const p = `${pfx}validateIdentifier(): `;
    if (typeof identifier !== 'string')
        throw Error(`${p}identifier is type "${typeof identifier}" not "string"`);
    const rx = /^([a-z][-a-z0-9]{1,30}[a-z0-9])$/;
    if (!rx.test(identifier))
        throw Error(`${p}identifier "${safe(identifier)}" fails ${rx}`);
    if (identifier.includes('--'))
        throw Error(`${p}identifier "${safe(identifier)}" contains double-dashes`);
}

const validMetadataOrTableKinds = new Set([
    'Metadata',
    'UnencryptedJs',
    // 'EncryptedJs',
]);
const validColumnKinds = new Set([
    'Enum',
    'Integer',
    'String',
]);

// Checks that the kind value is one of the recognised strings.
function validateKind(kind, pfx, schema = 'METADATA_OR_TABLE') {
    const p = `${pfx}validateKind(): `;
    if (typeof kind !== 'string')
        throw Error(`${p}kind is type "${typeof kind}" not "string"`);
    switch (schema) {
        case 'METADATA_OR_TABLE':
            if (!validMetadataOrTableKinds.has(kind))
                throw Error(`${p}kind "${safe(kind)}" is not one of "${Array.from(validMetadataOrTableKinds).join('" | "')}"`);
            break;
        case 'COLUMN':
            if (!validColumnKinds.has(kind))
                throw Error(`${p}kind "${safe(kind)}" is not one of "${Array.from(validColumnKinds).join('" | "')}"`);
            break;
        default:
            throw Error(`${p}unknown schema "${safe(schema)}"`);
    }
}

// Checks that a table's payload is an object with valid properties.
function validatePayload(payload, pfx) {
    const p = `${pfx}validatePayload(): `;
    if (typeof payload !== 'object' || payload === null || Array.isArray(payload))
        throw Error(`${p}payload is type "${typeof payload}" not a plain object`);

    const columnIdentifiers = new Set();
    if (!Array.isArray(payload.columns))
        throw Error(`${p}payload.columns is not an array`);
    for (let i = 0; i < payload.columns.length; i++) {
        const column = payload.columns[i];
        if (typeof column !== 'object' || column === null || Array.isArray(column))
            throw Error(`${p}payload.columns[${i}] is type "${typeof column}" not a plain object`);
        validateIdentifier(column.identifier, `${p}payload.columns[${i}]: `);
        validateKind(column.kind, `${p}payload.columns[${i}]: `, 'COLUMN');
        if (column.kind === 'Enum') {
            if (!Array.isArray(column.valid))
                throw Error(`${p}payload.columns[${i}].valid is not an array`);
            for (let j = 0; j < column.valid.length; j++) {
                const valid = column.valid[j];
                if (typeof valid !== 'string')
                    throw Error(`${p}payload.columns[${i}].valid[${j}] is type "${typeof valid}" not "string"`);
            }
        }

        // Check that the column identifier is unique.
        const identifier = column.identifier;
        if (columnIdentifiers.has(identifier))
            throw Error(`${p}payload.columns[${i}] dupe identifier "${safe(identifier)}"`);
        columnIdentifiers.add(identifier);
    }

    const numCols = payload.columns.length;
    if (numCols === 0)
        throw Error(`${p}payload.columns is empty`);
    if (!Array.isArray(payload.rows))
        throw Error(`${p}payload.rows is not an array`);
    for (let i = 0; i < payload.rows.length; i++) {
        const row = payload.rows[i];
        if (!Array.isArray(row))
            throw Error(`${p}payload.rows[${i}] is type "${typeof row}" not an array`);
        if (row.length !== numCols)
            throw Error(`${p}payload.rows[${i}] has ${row.length} columns, expected ${numCols}`);
        for (let j = 0; j < row.length; j++) {
            const cell = row[j];
            const column = payload.columns[j];
            switch (column.kind) {
                case 'Enum':
                    if (!column.valid.includes(cell))
                        throw Error(`${p}payload.rows[${i}][${j}] "${safe(cell)}" is not a valid Enum value`);
                    break;
                case 'Integer':
                    if (typeof cell !== 'number')
                        throw Error(`${p}payload.rows[${i}][${j}] is type "${typeof cell}" not "number"`);
                    if (!Number.isInteger(cell))
                        throw Error(`${p}payload.rows[${i}][${j}] "${safe(cell)}" is not an integer`);
                    break;
                case 'String':
                    if (typeof cell !== 'string')
                        throw Error(`${p}payload.rows[${i}][${j}] is type "${typeof cell}" not "string"`);
                    break;
            }
        }
    }
}

// Checks that the versionCdndb value is exactly "0.0.1".
function validateVersionCdndb(versionCdndb, pfx) {
    const p = `${pfx}validateVersionCdndb(): `;
    if (typeof versionCdndb !== 'string')
        throw Error(`${p}versionCdndb is type "${typeof versionCdndb}" not "string"`);
    if (versionCdndb !== '0.0.1')
        throw Error(`${p}versionCdndb "${safe(versionCdndb)}" is not "0.0.1"`);
}

// Makes a string safe for error messages.
function safe(any) {
    const str = String(any);
    const prt = str.replace(/[\x00-\x1F\x7F-\xFF]/g, '#'); // printable ASCII
    if (prt.length < 80) return prt;
    const short = prt.slice(0, 61) + '...' + prt.slice(-16);
    return short;
}