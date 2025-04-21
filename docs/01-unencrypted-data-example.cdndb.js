!function(global){
if (typeof global !== 'object' || !global.CDNDB || !global.CDNDB.add)
    throw Error('CDNDB is not defined or CDNDB.add() is missing');
global.CDNDB.add({
    dateCreated: ['2023-10-01 00:00:00', 'Jo Doe'],
    dateUpdated: ['2023-10-01 00:00:00', 'Jo Doe'],
    identifier: 'unencrypted-data-example',
    kind: 'Metadata',
    notes: ['An example cdndb database containing two JS tables, neither protected by encryption.'],
    tags: ['unencrypted', 'example'],
    url: 'https://richplastow.com/cdndb/01-unencrypted-data-example.cdndb.js',
    versionCdndb: '0.0.1',
    versionData: '1.0.0',
},{
    identifier: 'user-profiles',
    kind: 'UnencryptedJs',
    payload: {
        columns: [
            { identifier: 'user-id', kind: 'Integer' },
            { identifier: 'name', kind: 'String' },
            { identifier: 'theme', kind: 'Enum', valid: ['blue', 'red'] },
        ],
        rows: [
            [1, 'Alice', 'blue'],
            [2, 'Bob', 'red'],
            [3, 'Charlie', 'blue'],
        ],
    },
    tags: ['example', 'user', 'profile'],
},{
    identifier: 'chat-messages',
    kind: 'UnencryptedJs',
    payload: {
        columns: [
            { identifier: 'message-id', kind: 'Integer' },
            { identifier: 'content', kind: 'String' },
            { identifier: 'sender-id', kind: 'Integer' },
        ],
        rows: [
            [1, 'Hello everyone!', 1], // Alice
            [2, 'Hi Alice, how are you?', 2], // Bob
            [3, 'Welcome to the chat!', 3], // Charlie
            [4, "I'm doing great, thanks!", 1], // Alice
            [5, 'What are we discussing today?', 2], // Bob
        ],
    },
    tags: ['example', 'chat', 'messages'],
})
}(this || global);
