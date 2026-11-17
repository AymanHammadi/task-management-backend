import assert from 'node:assert/strict';
import test from 'node:test';
import { createTask, deleteTask, getTask, listTasks, updateTask } from '../src/tasks.js';

test('creates an incomplete task with a trimmed title and an integer ID', () => {
  const task = createTask('  Read the assignment  ');

  assert.ok(Number.isInteger(task.id));
  assert.deepEqual(task, { id: task.id, title: 'Read the assignment', completed: false });
  assert.deepEqual(getTask(task.id), task);
});

test('assigns different IDs even after deleting a task', () => {
  const first = createTask('First task');
  deleteTask(first.id);
  const second = createTask('Second task');

  assert.equal(second.id, first.id + 1);
});

test('lists stored tasks', () => {
  const before = listTasks();
  const task = createTask('List this task');

  assert.deepEqual(listTasks(), [...before, task]);
});

test('rejects invalid titles without changing storage or consuming an ID', () => {
  const previous = createTask('Before invalid input');
  const before = listTasks();

  for (const title of ['', '   ', null, undefined, 42, {}]) {
    assert.throws(() => createTask(title), /Task title must be a non-empty string/);
  }

  assert.deepEqual(listTasks(), before);
  assert.equal(createTask('After invalid input').id, previous.id + 1);
});

test('updates the title and completion without changing the ID', () => {
  const task = createTask('Draft');
  const updated = updateTask(task.id, { title: '  Finished  ', completed: true });

  assert.deepEqual(updated, { id: task.id, title: 'Finished', completed: true });
  assert.deepEqual(getTask(task.id), updated);
});

test('updates either field independently and can reopen a task', () => {
  const task = createTask('Original');

  updateTask(task.id, { completed: true });
  assert.deepEqual(getTask(task.id), { ...task, completed: true });

  updateTask(task.id, { title: 'Renamed' });
  assert.deepEqual(getTask(task.id), { ...task, title: 'Renamed', completed: true });

  updateTask(task.id, { completed: false });
  assert.equal(getTask(task.id).completed, false);
});

test('rejects invalid update objects and unsupported fields without changing the task', () => {
  const task = createTask('Unchanged');

  for (const changes of [null, undefined, [], 'title', 42]) {
    assert.throws(() => updateTask(task.id, changes), /Task changes must be an object/);
  }

  for (const changes of [{}, { id: 99 }, { title: 'Changed', owner: 1 }]) {
    assert.throws(() => updateTask(task.id, changes), /Provide title, completed, or both/);
  }

  assert.deepEqual(getTask(task.id), task);
});

test('rejects invalid updated titles without changing the task', () => {
  const task = createTask('Keep this title');

  for (const title of ['', '  ', null, undefined, 42]) {
    assert.throws(() => updateTask(task.id, { title }), /Task title must be a non-empty string/);
  }

  assert.deepEqual(getTask(task.id), task);
});

test('rejects non-boolean completion and does not partially apply a valid title', () => {
  const task = createTask('Keep both fields');

  for (const completed of ['true', 1, null, undefined]) {
    assert.throws(
      () => updateTask(task.id, { title: 'Do not save this', completed }),
      /Task completed must be a boolean/,
    );
    assert.deepEqual(getTask(task.id), task);
  }
});

test('deletes only the requested task and returns the deleted record', () => {
  const task = createTask('Delete this task');
  const kept = createTask('Keep this task');
  const before = listTasks();

  assert.deepEqual(deleteTask(task.id), task);
  assert.deepEqual(listTasks(), before.filter((entry) => entry.id !== task.id));
  assert.deepEqual(getTask(kept.id), kept);
  assert.throws(() => getTask(task.id), /not found/);
});

test('rejects missing IDs for find, update, and delete without changing storage', () => {
  const before = listTasks();

  assert.throws(() => getTask(-1), /Task with ID -1 not found/);
  assert.throws(() => updateTask(-1, { completed: true }), /Task with ID -1 not found/);
  assert.throws(() => deleteTask(-1), /Task with ID -1 not found/);
  assert.deepEqual(listTasks(), before);
});

test('returned task records and lists cannot mutate internal storage', () => {
  const created = createTask('Protected task');
  const expected = { ...created };
  created.title = 'Changed outside the module';
  getTask(created.id).completed = true;

  const listed = listTasks();
  listed.find((task) => task.id === created.id).title = 'Changed through the list';
  listed.length = 0;

  assert.deepEqual(getTask(created.id), expected);

  const updated = updateTask(created.id, { completed: true });
  updated.title = 'Changed through the update result';
  assert.deepEqual(getTask(created.id), { ...expected, completed: true });
});
