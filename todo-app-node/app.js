const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const todos = [];

function showTodos() {
  if (todos.length === 0) {
    console.log('No todos yet.');
  } else {
    console.log('Todo List:');
    todos.forEach((todo, index) => {
      console.log(`${index + 1}. ${todo}`);
    });
  }
  console.log('');
}

function addTodo() {
  rl.question('Enter a new todo: ', (newTodo) => {
    todos.push(newTodo);
    console.log('Todo added successfully.');
    showTodos();
    mainMenu();
  });
}

function editTodo() {
  showTodos();
  if (todos.length === 0) {
    mainMenu();
    return;
  }

  rl.question('Enter the number of the todo to edit: ', (index) => {
    const todoIndex = parseInt(index) - 1;
    if (!isNaN(todoIndex) && todoIndex >= 0 && todoIndex < todos.length) {
      rl.question(`Edit todo #${todoIndex + 1}: `, (editedTodo) => {
        todos[todoIndex] = editedTodo;
        console.log('Todo edited successfully.');
        showTodos();
        mainMenu();
      });
    } else {
      console.log('Invalid input. Please enter a valid todo number.');
      editTodo();
    }
  });
}

function deleteTodo() {
  showTodos();
  if (todos.length === 0) {
    mainMenu();
    return;
  }

  rl.question('Enter the number of the todo to delete: ', (index) => {
    const todoIndex = parseInt(index) - 1;
    if (!isNaN(todoIndex) && todoIndex >= 0 && todoIndex < todos.length) {
      const deletedTodo = todos.splice(todoIndex, 1);
      console.log(`Deleted: ${deletedTodo}`);
    } else {
      console.log('Invalid input. Please enter a valid todo number.');
    }
    showTodos();
    mainMenu();
  });
}

function mainMenu() {
  console.log('Todo App Menu:');
  console.log('1. Show Todos');
  console.log('2. Add Todo');
  console.log('3. Edit Todo');
  console.log('4. Delete Todo');
  console.log('5. Quit');

  rl.question('Select an option: ', (option) => {
    switch (option) {
      case '1':
        showTodos();
        mainMenu();
        break;
      case '2':
        addTodo();
        break;
      case '3':
        editTodo();
        break;
      case '4':
        deleteTodo();
        break;
      case '5':
        console.log('Goodbye!');
        rl.close();
        break;
      default:
        console.log('Invalid option. Please choose a valid option.');
        mainMenu();
    }
  });
}

mainMenu();
