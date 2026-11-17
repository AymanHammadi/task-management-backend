import assert from 'node:assert/strict';
import test from 'node:test';
import { createUser, getUser, listUsers } from '../src/users.js';

test('creates a user with a trimmed name and normalized email', () => {
  const user = createUser('  Ayman  ', '  AYMAN@example.com  ');

  assert.ok(Number.isInteger(user.id));
  assert.deepEqual(user, { id: user.id, name: 'Ayman', email: 'ayman@example.com' });
  assert.deepEqual(getUser(user.id), user);
});

test('lists users and assigns increasing IDs', () => {
  const before = listUsers();
  const first = createUser('First', 'first@example.com');
  const second = createUser('Second', 'second@example.com');

  assert.equal(second.id, first.id + 1);
  assert.deepEqual(listUsers(), [...before, first, second]);
});

test('rejects invalid names and emails without storing users or consuming IDs', () => {
  const previous = createUser('Before validation', 'before-validation@example.com');
  const before = listUsers();

  for (const name of ['', '   ', null, undefined, 42, {}]) {
    assert.throws(() => createUser(name, 'valid@example.com'), /User name must be a non-empty string/);
  }

  for (const email of ['', '   ', null, undefined, 42, {}]) {
    assert.throws(() => createUser('Valid name', email), /User email must be a non-empty string/);
  }

  assert.deepEqual(listUsers(), before);
  assert.equal(createUser('After validation', 'after-validation@example.com').id, previous.id + 1);
});

test('rejects duplicate emails regardless of casing or surrounding whitespace', () => {
  const original = createUser('Original', 'duplicate@example.com');
  const before = listUsers();

  assert.throws(
    () => createUser('Duplicate', '  DUPLICATE@example.com  '),
    /A user with this email already exists/,
  );

  assert.deepEqual(listUsers(), before);
  assert.deepEqual(getUser(original.id), original);
});

test('rejects a missing user ID without changing storage', () => {
  const before = listUsers();

  assert.throws(() => getUser(-1), /User with ID -1 not found/);
  assert.deepEqual(listUsers(), before);
});

test('returned user records and lists cannot mutate internal storage', () => {
  const created = createUser('Protected user', 'protected@example.com');
  const expected = { ...created };
  created.email = 'changed@example.com';
  getUser(created.id).name = 'Changed outside the module';

  const listed = listUsers();
  listed.find((user) => user.id === created.id).email = 'changed-in-list@example.com';
  listed.length = 0;

  assert.deepEqual(getUser(created.id), expected);
});
