# Task management backend

Session 1 assignment. A Node.js console demo with separate task and user modules, ESM imports, and in-memory storage. It does not start an HTTP server.

## Requirements

- Node.js 22 or newer
- npm, included with Node.js

There are no third-party dependencies. The tests use Node's built-in test runner.

## Run locally

```bash
git clone https://github.com/AymanHammadi/task-management-backend.git session-1
cd session-1
npm ci
npm start
```

If you already have the project locally, open `session-1` and run `npm ci` followed by `npm start`.

Available scripts:

| Command | Purpose |
| --- | --- |
| `npm start` | Run the demo once and exit |
| `npm run dev` | Run the demo again whenever a source file changes |
| `npm test` | Run the automated tests |

## Expected output

After npm prints its script header, `npm start` prints:

```text
Task management backend
Users: [{"id":1,"name":"Ayman","email":"ayman@example.com"}]
User by ID: {"id":1,"name":"Ayman","email":"ayman@example.com"}
Created task: {"id":1,"title":"Set up the Node.js project","completed":false}
Tasks: [{"id":1,"title":"Set up the Node.js project","completed":false},{"id":2,"title":"Write the README","completed":false}]
Task by ID: {"id":1,"title":"Set up the Node.js project","completed":false}
Updated task: {"id":1,"title":"Set up the ESM project","completed":true}
Deleted task: {"id":2,"title":"Write the README","completed":false}
Remaining tasks: [{"id":1,"title":"Set up the ESM project","completed":true}]
Data is stored in memory and resets when the program exits.
```

## Project structure

```text
session-1/
├── src/
│   ├── index.js          # Demo entry point
│   ├── tasks.js          # Task storage and operations
│   └── users.js          # User storage and operations
├── test/
│   ├── tasks.test.js
│   └── users.test.js
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Module functions

Tasks have `id`, `title`, and `completed` fields. New tasks start with `completed: false`.

| Export from `src/tasks.js` | Returns |
| --- | --- |
| `createTask(title)` | The created task |
| `listTasks()` | An array of tasks |
| `getTask(id)` | The matching task |
| `updateTask(id, { title, completed })` | The updated task; either field can be supplied |
| `deleteTask(id)` | The deleted task |

Users have `id`, `name`, and `email` fields. Tasks are not assigned to users.

| Export from `src/users.js` | Returns |
| --- | --- |
| `createUser(name, email)` | The created user |
| `listUsers()` | An array of users |
| `getUser(id)` | The matching user |

Each module generates its own increasing integer IDs, starting at 1. Pass IDs as numbers, not strings. Deleted task IDs are not reused during the same run.

## Validation and storage

- Titles, names, and emails must be non-empty strings. Surrounding whitespace is removed.
- Emails are stored in lowercase and must be unique. This starter does not validate email address format or deliverability.
- Task updates accept only `title` and `completed`, require at least one field, and require a boolean for `completed`.
- Finding, updating, or deleting a nonexistent ID throws an error.
- Invalid operations throw an `Error` without changing stored records.
- Functions return copies so callers cannot change storage by editing a returned record or array.

Both arrays are private to their modules. They exist only while the Node.js process is running. Each fresh run starts with empty storage and IDs reset to 1; the demo then creates its sample records. There is no database, file storage, authentication, or HTTP API.

## Verification

```bash
npm test
npm start
```

The 18 tests cover task operations, user operations, invalid input, duplicate emails, missing IDs, and protection against changes through returned records. They also check that an invalid task update cannot save only part of its changes.

## Reading the code

Start with `src/index.js` to see the operations in order. Then read `src/tasks.js` and `src/users.js` to see how the arrays change. The tests show both successful calls and rejected inputs.

`"type": "module"` in `package.json` makes `.js` files use ESM. Modules share functions through `export` and `import`, rather than `module.exports` and `require`. Local imports include the `.js` extension.

To follow the implementation history, run:

```bash
git log --oneline --reverse
```

The commits separate project setup, module operations, tests, and the demo with documentation.
