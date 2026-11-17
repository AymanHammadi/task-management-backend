const tasks = [];
let nextId = 1;

function normalizeTitle(title) {
  if (typeof title !== 'string' || title.trim() === '') {
    throw new Error('Task title must be a non-empty string.');
  }

  return title.trim();
}

function findTaskIndex(id) {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    throw new Error(`Task with ID ${id} not found.`);
  }

  return index;
}

export function createTask(title) {
  const normalizedTitle = normalizeTitle(title);
  const task = { id: nextId++, title: normalizedTitle, completed: false };
  tasks.push(task);
  return { ...task };
}

export function listTasks() {
  return tasks.map((task) => ({ ...task }));
}

export function getTask(id) {
  return { ...tasks[findTaskIndex(id)] };
}

export function updateTask(id, changes) {
  const index = findTaskIndex(id);

  if (changes === null || typeof changes !== 'object' || Array.isArray(changes)) {
    throw new Error('Task changes must be an object.');
  }

  const fields = Object.keys(changes);

  if (fields.length === 0 || fields.some((field) => !['title', 'completed'].includes(field))) {
    throw new Error('Provide title, completed, or both to update a task.');
  }

  const updatedTask = { ...tasks[index] };

  if (fields.includes('title')) {
    updatedTask.title = normalizeTitle(changes.title);
  }

  if (fields.includes('completed')) {
    if (typeof changes.completed !== 'boolean') {
      throw new Error('Task completed must be a boolean.');
    }

    updatedTask.completed = changes.completed;
  }

  tasks[index] = updatedTask;
  return { ...updatedTask };
}

export function deleteTask(id) {
  const index = findTaskIndex(id);
  const [deletedTask] = tasks.splice(index, 1);
  return { ...deletedTask };
}
