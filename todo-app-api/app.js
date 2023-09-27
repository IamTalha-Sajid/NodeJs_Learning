const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs'); // Import the 'fs' module for file operations

const todosFilePath = 'todos.json'; // File path for storing todo data

let todos = []; // Initialize the todos array

// Read todos from the JSON file on server startup
fs.readFile(todosFilePath, 'utf8', (err, data) => {
  if (!err) {
    todos = JSON.parse(data);
  }
});

function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url);
  const query = querystring.parse(parsedUrl.query);

  if (parsedUrl.pathname === '/todos') {
    if (req.method === 'GET') {
      // Get all todos
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(todos));
    } else if (req.method === 'POST') {
      // Add a new todo
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        const newTodo = JSON.parse(data);
        todos.push(newTodo);

        // Update the JSON file with the new data
        fs.writeFile(todosFilePath, JSON.stringify(todos), (err) => {
          if (err) {
            console.error('Error writing to todos.json:', err);
          }
        });

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newTodo));
      });
    }
  } else if (parsedUrl.pathname.startsWith('/todos/')) {
    
    const todoIndex = parseInt(query.index);
    if (!isNaN(todoIndex) && todoIndex >= 0 && todoIndex < todos.length) {
      if (req.method === 'GET') {
        // Get a specific todo
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(todos[todoIndex]));
      } else if (req.method === 'PUT') {
        // Edit a specific todo
        let data = '';
        req.on('data', (chunk) => {
          data += chunk;
        });
        req.on('end', () => {
          const editedTodo = JSON.parse(data);
          todos[todoIndex] = editedTodo;

          // Update the JSON file with the edited data
          fs.writeFile(todosFilePath, JSON.stringify(todos), (err) => {
            if (err) {
              console.error('Error writing to todos.json:', err);
            }
          });

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(editedTodo));
        });
      } else if (req.method === 'DELETE') {
        // Delete a specific todo
        todos.splice(todoIndex, 1);

        // Update the JSON file with the updated data
        fs.writeFile(todosFilePath, JSON.stringify(todos), (err) => {
          if (err) {
            console.error('Error writing to todos.json:', err);
          }
        });

        res.writeHead(204);
        res.end();
      }
    } else {
      // Invalid todo index
      res.writeHead(404);
      res.end('Not Found');
    }
  } else {
    // Invalid endpoint
    res.writeHead(404);
    res.end('Not Found');
  }
}

const server = http.createServer(handleRequest);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
