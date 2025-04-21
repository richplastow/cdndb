!function(global){
if (typeof global !== 'object' || !global.CDNDB || !global.CDNDB.add)
    throw new Error('CDNDB is not defined or CDNDB.add() is missing');
global.CDNDB.add({
    dateCreated: ['2023-10-01 00:00:00', 'Jo Doe'],
    dateUpdated: ['2023-10-01 00:00:00', 'Jo Doe'],
    identifier: '01_unencrypted_data_example',
    notes: ['An example cdndb database containing two JS tables, neither protected by encryption.'],
    tags: ['unencrypted', 'example'],
    url: 'https://richplastow.com/cdndb/01-unencrypted-data-example.js',
    versionCdndb: '0.0.1',
    versionData: '1.0.0',
},{
    identifier: 'userProfiles',
    kind: 'UnencryptedJs',
    payload: {
        columns: [
            { identifier: 'userId', kind: 'BigInt' },
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
    identifier: 'chatMessages',
    kind: 'UnencryptedJs',
    payload: {
        columns: [
            { identifier: 'messageId', kind: 'BigInt' },
            { identifier: 'content', kind: 'String' },
            { identifier: 'sender', kind: 'Enum', valid: ['Alice', 'Bob', 'Charlie'] },
        ],
        rows: [
            [1, 'Hello everyone!', 'Alice'],
            [2, 'Hi Alice, how are you?', 'Bob'],
            [3, 'Welcome to the chat!', 'Charlie'],
            [4, "I'm doing great, thanks!", 'Alice'],
            [5, 'What are we discussing today?', 'Bob'],
        ],
    },
    tags: ['example', 'chat', 'messages'],
})
}(this || global);
