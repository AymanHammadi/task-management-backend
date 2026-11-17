const users = [];
let nextId = 1;

export function createUser(name, email) {
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error('User name must be a non-empty string.');
  }

  if (typeof email !== 'string' || email.trim() === '') {
    throw new Error('User email must be a non-empty string.');
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('A user with this email already exists.');
  }

  const user = { id: nextId++, name: name.trim(), email: normalizedEmail };
  users.push(user);
  return { ...user };
}

export function listUsers() {
  return users.map((user) => ({ ...user }));
}

export function getUser(id) {
  const user = users.find((user) => user.id === id);

  if (!user) {
    throw new Error(`User with ID ${id} not found.`);
  }

  return { ...user };
}
