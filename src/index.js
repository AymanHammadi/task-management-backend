import { createTask, deleteTask, getTask, listTasks, updateTask } from './tasks.js';
import { createUser, getUser, listUsers } from './users.js';

console.log('Task management backend');

const user = createUser('Ayman', 'ayman@example.com');
console.log('Users:', JSON.stringify(listUsers()));
console.log('User by ID:', JSON.stringify(getUser(user.id)));

const firstTask = createTask('Set up the Node.js project');
const secondTask = createTask('Write the README');
console.log('Created task:', JSON.stringify(firstTask));
console.log('Tasks:', JSON.stringify(listTasks()));
console.log('Task by ID:', JSON.stringify(getTask(firstTask.id)));

const updatedTask = updateTask(firstTask.id, {
  title: 'Set up the ESM project',
  completed: true,
});
console.log('Updated task:', JSON.stringify(updatedTask));
console.log('Deleted task:', JSON.stringify(deleteTask(secondTask.id)));
console.log('Remaining tasks:', JSON.stringify(listTasks()));

console.log('Data is stored in memory and resets when the program exits.');
